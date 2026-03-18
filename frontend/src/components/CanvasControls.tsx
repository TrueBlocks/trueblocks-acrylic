import { Stack, Group, Text, Slider, Switch, SegmentedControl } from '@mantine/core';

interface CanvasControlsProps {
  nColors: number;
  tileSize: number;
  posterize: boolean;
  smoothingPasses: number;
  aspectRatio: string;
  matchOwnedOnly: boolean;
  onParameterChange: (field: string, value: number | boolean | string) => void;
}

const TILE_SIZES = ['1', '2', '4', '8', '16'];
const ASPECT_RATIOS = ['original', '16:9', '9:16', '1:1'];

export function CanvasControls({
  nColors,
  tileSize,
  posterize,
  smoothingPasses,
  aspectRatio,
  matchOwnedOnly,
  onParameterChange,
}: CanvasControlsProps) {
  return (
    <Stack
      gap="xs"
      p="xs"
      style={{ border: '1px solid var(--mantine-color-gray-3)', borderRadius: 8 }}
    >
      <Text size="xs" fw={600} c="dimmed" tt="uppercase">
        Controls
      </Text>

      <Stack gap={4}>
        <Text size="xs">Colors: {nColors}</Text>
        <Slider
          value={nColors}
          onChange={(v) => onParameterChange('nColors', v)}
          min={2}
          max={40}
          step={1}
          size="xs"
        />
      </Stack>

      <Group gap="xs">
        <Switch
          label="Posterize"
          size="xs"
          checked={posterize}
          onChange={(e) => onParameterChange('posterize', e.currentTarget.checked)}
        />
      </Group>

      <Stack gap={4}>
        <Text size="xs">Tile Size</Text>
        <SegmentedControl
          size="xs"
          value={String(tileSize)}
          onChange={(v) => onParameterChange('tileSize', parseInt(v, 10))}
          data={TILE_SIZES}
        />
      </Stack>

      <Stack gap={4}>
        <Text size="xs">Smoothing: {smoothingPasses}</Text>
        <Slider
          value={smoothingPasses}
          onChange={(v) => onParameterChange('smoothingPasses', v)}
          min={0}
          max={5}
          step={1}
          size="xs"
        />
      </Stack>

      <Stack gap={4}>
        <Text size="xs">Aspect Ratio</Text>
        <SegmentedControl
          size="xs"
          value={aspectRatio}
          onChange={(v) => onParameterChange('aspectRatio', v)}
          data={ASPECT_RATIOS}
        />
      </Stack>

      <Group gap="xs">
        <Switch
          label="Match Owned Only"
          size="xs"
          checked={matchOwnedOnly}
          onChange={(e) => onParameterChange('matchOwnedOnly', e.currentTarget.checked)}
        />
      </Group>
    </Stack>
  );
}
