import { Stack, Group, Box, Text, ActionIcon } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';
import { MixingBar } from '@/components/MixingBar';
import { CreateFavorite } from '@app';
import { db } from '@models';
import { LogErr } from '@/utils';
import { notifications } from '@mantine/notifications';
import { useCallback } from 'react';

interface ShoppingListProps {
  colorData: db.ProjectColorWithMatches[];
  matchOwnedOnly: boolean;
  onColorClick: (pcm: db.ProjectColorWithMatches) => void;
}

export function ShoppingList({ colorData, matchOwnedOnly, onColorClick }: ShoppingListProps) {
  const handleSaveFavorite = useCallback(
    async (pcm: db.ProjectColorWithMatches, match: db.ColorMatch) => {
      try {
        const favParts = match.parts.map(
          (p) =>
            new db.FavoritePart({
              paintId: p.paintId,
              parts: p.parts,
            })
        );
        const fav = new db.Favorite({
          name: pcm.color.hex,
          notes: '',
          r: pcm.color.r,
          g: pcm.color.g,
          b: pcm.color.b,
          hex: pcm.color.hex,
          parts: favParts,
        });
        await CreateFavorite(fav);
        notifications.show({
          message: 'Saved as favorite',
          color: 'green',
          autoClose: 2000,
        });
      } catch (err) {
        LogErr('Failed to save favorite:', err);
      }
    },
    []
  );

  return (
    <Stack
      gap="xs"
      p="xs"
      style={{
        border: '1px solid var(--mantine-color-gray-3)',
        borderRadius: 8,
        maxHeight: 400,
        overflow: 'auto',
      }}
    >
      <Text size="xs" fw={600} c="dimmed" tt="uppercase">
        Shopping List
      </Text>
      {colorData.map((pcm) => {
        const bestMatch = pcm.matches?.[0];
        if (!bestMatch) return null;

        const needToBuy = bestMatch.parts.filter((p) => !p.paint?.owned);
        if (matchOwnedOnly && needToBuy.length === 0) return null;

        return (
          <Box
            key={pcm.color.id}
            p="xs"
            style={{
              border: '1px solid var(--mantine-color-gray-2)',
              borderRadius: 6,
              cursor: 'pointer',
            }}
            onClick={() => onColorClick(pcm)}
          >
            <Group gap="xs" mb={4}>
              <Box
                w={16}
                h={16}
                style={{
                  borderRadius: 3,
                  backgroundColor: pcm.color.hex,
                  border: '1px solid var(--mantine-color-gray-4)',
                }}
              />
              <Text size="xs" fw={500}>
                {pcm.color.hex}
              </Text>
              <Text size="xs" c="dimmed">
                {bestMatch.matchRating} (ΔE {bestMatch.deltaE.toFixed(1)})
              </Text>
              <Box style={{ flex: 1 }} />
              <ActionIcon
                variant="subtle"
                size="xs"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleSaveFavorite(pcm, bestMatch);
                }}
              >
                <IconHeart size={12} />
              </ActionIcon>
            </Group>
            <MixingBar parts={bestMatch.parts} height={14} />
            {needToBuy.length > 0 && (
              <Text size="xs" c="orange" mt={2}>
                Need: {needToBuy.map((p) => p.paint?.name || p.paintId).join(', ')}
              </Text>
            )}
          </Box>
        );
      })}
    </Stack>
  );
}
