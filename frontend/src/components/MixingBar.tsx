import { Box, Tooltip, Text } from '@mantine/core';
import { db } from '@models';

interface MixingBarProps {
  parts: db.MatchPart[] | db.FavoritePart[];
  height?: number;
}

export function MixingBar({ parts, height = 24 }: MixingBarProps) {
  const totalParts = parts.reduce((sum, p) => sum + p.parts, 0);
  if (totalParts === 0) {
    return (
      <Text size="xs" c="dimmed">
        No recipe
      </Text>
    );
  }

  return (
    <Box
      style={{
        display: 'flex',
        height,
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid var(--mantine-color-gray-4)',
      }}
    >
      {parts.map((part, i) => (
        <Tooltip
          key={`${part.paintId}-${i}`}
          label={`${part.paint?.name || part.paintId}: ${part.parts} part${part.parts !== 1 ? 's' : ''}`}
          withArrow
        >
          <Box
            style={{
              flex: part.parts,
              backgroundColor: part.paint?.hex || '#ccc',
              minWidth: 4,
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );
}
