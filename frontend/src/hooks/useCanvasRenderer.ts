import { useState, useEffect, useCallback, RefObject } from 'react';
import { db } from '@models';
import { GetImageURL } from '@app';

interface UseCanvasRendererOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  imagePath: string;
  colors: db.ProjectColor[];
  highlightedColorId: number | null;
  posterize: boolean;
  tileSize: number;
  smoothingPasses: number;
  aspectRatio: string;
}

export function useCanvasRenderer({
  canvasRef,
  imagePath,
  colors,
  highlightedColorId,
  posterize,
  tileSize,
  smoothingPasses: _smoothingPasses,
  aspectRatio,
}: UseCanvasRendererOptions) {
  const [imageURL, setImageURL] = useState('');

  useEffect(() => {
    if (imagePath) {
      GetImageURL(imagePath).then(setImageURL);
    }
  }, [imagePath]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageURL) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      let targetWidth = img.width;
      let targetHeight = img.height;

      if (aspectRatio === '16:9') {
        targetHeight = Math.round(targetWidth * (9 / 16));
      } else if (aspectRatio === '9:16') {
        targetWidth = Math.round(targetHeight * (9 / 16));
      } else if (aspectRatio === '1:1') {
        const size = Math.min(targetWidth, targetHeight);
        targetWidth = size;
        targetHeight = size;
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      if (posterize && colors.length > 0) {
        applyPosterize(ctx, targetWidth, targetHeight, colors, tileSize);
      } else if (tileSize > 1) {
        applyTile(ctx, targetWidth, targetHeight, tileSize);
      }

      if (highlightedColorId !== null) {
        const color = colors.find((c) => c.id === highlightedColorId);
        if (color) {
          applyHighlight(ctx, targetWidth, targetHeight, color, tileSize);
        }
      }
    };

    img.src = imageURL;
  }, [imageURL, colors, highlightedColorId, posterize, tileSize, aspectRatio, canvasRef]);

  useEffect(() => {
    render();
  }, [render]);
}

function applyPosterize(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: db.ProjectColor[],
  tileSize: number
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const step = Math.max(1, tileSize);

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const nearest = findNearestColor(r, g, b, colors);

      for (let dy = 0; dy < step && y + dy < height; dy++) {
        for (let dx = 0; dx < step && x + dx < width; dx++) {
          const ti = ((y + dy) * width + (x + dx)) * 4;
          data[ti] = nearest.r;
          data[ti + 1] = nearest.g;
          data[ti + 2] = nearest.b;
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function applyTile(ctx: CanvasRenderingContext2D, width: number, height: number, tileSize: number) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y += tileSize) {
    for (let x = 0; x < width; x += tileSize) {
      let r = 0;
      let g = 0;
      let b = 0;
      let count = 0;

      for (let dy = 0; dy < tileSize && y + dy < height; dy++) {
        for (let dx = 0; dx < tileSize && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
          count++;
        }
      }

      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);

      for (let dy = 0; dy < tileSize && y + dy < height; dy++) {
        for (let dx = 0; dx < tileSize && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function applyHighlight(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: db.ProjectColor,
  tileSize: number
) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const threshold = 30;
  const step = Math.max(1, tileSize);

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      const dist = Math.sqrt(
        Math.pow(data[idx] - color.r, 2) +
          Math.pow(data[idx + 1] - color.g, 2) +
          Math.pow(data[idx + 2] - color.b, 2)
      );

      if (dist > threshold) {
        for (let dy = 0; dy < step && y + dy < height; dy++) {
          for (let dx = 0; dx < step && x + dx < width; dx++) {
            const ti = ((y + dy) * width + (x + dx)) * 4;
            data[ti + 3] = 60;
          }
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function findNearestColor(
  r: number,
  g: number,
  b: number,
  colors: db.ProjectColor[]
): db.ProjectColor {
  let minDist = Infinity;
  let nearest = colors[0];

  for (const c of colors) {
    const dist = Math.pow(r - c.r, 2) + Math.pow(g - c.g, 2) + Math.pow(b - c.b, 2);
    if (dist < minDist) {
      minDist = dist;
      nearest = c;
    }
  }

  return nearest;
}
