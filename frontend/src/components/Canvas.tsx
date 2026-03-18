import { useRef } from 'react';
import { Box } from '@mantine/core';
import { db } from '@models';
import { useCanvasRenderer } from '@/hooks/useCanvasRenderer';

interface CanvasProps {
  imagePath: string;
  colorData: db.ProjectColorWithMatches[];
  highlightedColorId: number | null;
  posterize: boolean;
  tileSize: number;
  smoothingPasses: number;
  aspectRatio: string;
}

export function Canvas({
  imagePath,
  colorData,
  highlightedColorId,
  posterize,
  tileSize,
  smoothingPasses,
  aspectRatio,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colors = colorData.map((pcm) => pcm.color);

  useCanvasRenderer({
    canvasRef,
    imagePath,
    colors,
    highlightedColorId,
    posterize,
    tileSize,
    smoothingPasses,
    aspectRatio,
  });

  return (
    <Box
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--mantine-color-gray-1)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
      />
    </Box>
  );
}
