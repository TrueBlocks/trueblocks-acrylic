import { Group, Box, Text, Tooltip } from '@mantine/core';
import { db } from '@models';

interface PaletteGridProps {
  colorData: db.ProjectColorWithMatches[];
  highlightedColorId: number | null;
  onColorClick: (pcm: db.ProjectColorWithMatches) => void;
}

export function PaletteGrid({ colorData, highlightedColorId, onColorClick }: PaletteGridProps) {
  return (
    <Box p="xs" style={{ border: '1px solid var(--mantine-color-gray-3)', borderRadius: 8 }}>
      <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb="xs">
        Palette ({colorData.length} colors)
      </Text>
      <Group gap={4} wrap="wrap">
        {colorData.map((pcm) => (
          <Tooltip key={pcm.color.id} label={pcm.color.hex} withArrow>
            <Box
              w={28}
              h={28}
              onClick={() => onColorClick(pcm)}
              style={{
                borderRadius: 4,
                backgroundColor: pcm.color.hex,
                border:
                  highlightedColorId === pcm.color.id
                    ? '3px solid var(--mantine-color-red-6)'
                    : '1px solid var(--mantine-color-gray-4)',
                cursor: 'pointer',
                transition: 'transform 100ms',
                transform: highlightedColorId === pcm.color.id ? 'scale(1.2)' : 'scale(1)',
              }}
            />
          </Tooltip>
        ))}
      </Group>
    </Box>
  );
}
