import { Modal, Stack, Group, Box, Text } from '@mantine/core';
import { db } from '@models';
import { MixingBar } from '@/components/MixingBar';

interface ColorDetailModalProps {
  opened: boolean;
  onClose: () => void;
  colorData: db.ProjectColorWithMatches | null;
}

export function ColorDetailModal({ opened, onClose, colorData }: ColorDetailModalProps) {
  if (!colorData) return null;

  const color = colorData.color;
  const bestMatch = colorData.matches?.[0];

  return (
    <Modal opened={opened} onClose={onClose} title="Color Detail" size="lg">
      <Stack gap="md">
        <Group gap="lg">
          <Stack gap="xs" align="center">
            <Text size="xs" c="dimmed">
              Target
            </Text>
            <Box
              w={80}
              h={80}
              style={{
                borderRadius: 8,
                backgroundColor: color.hex,
                border: '2px solid var(--mantine-color-gray-4)',
              }}
            />
            <Text size="xs">{color.hex}</Text>
            <Text size="xs" c="dimmed">
              RGB({color.r}, {color.g}, {color.b})
            </Text>
          </Stack>

          {bestMatch && (
            <Stack gap="xs" align="center">
              <Text size="xs" c="dimmed">
                Best Match
              </Text>
              <Box
                w={80}
                h={80}
                style={{
                  borderRadius: 8,
                  backgroundColor: computeMixedColor(bestMatch.parts),
                  border: '2px solid var(--mantine-color-gray-4)',
                }}
              />
              <Text size="xs">
                {bestMatch.matchRating} (ΔE {bestMatch.deltaE.toFixed(1)})
              </Text>
            </Stack>
          )}
        </Group>

        {bestMatch && (
          <>
            <Stack gap="xs">
              <Text fw={600} size="sm">
                Mixing Recipe
              </Text>
              <MixingBar parts={bestMatch.parts} height={32} />
            </Stack>

            <Stack gap="xs">
              <Text fw={600} size="sm">
                Paint Components
              </Text>
              {bestMatch.parts.map((part) => (
                <Group key={part.id} gap="md" align="center">
                  <Box
                    w={24}
                    h={24}
                    style={{
                      borderRadius: 4,
                      backgroundColor: part.paint?.hex || '#ccc',
                      border: '1px solid var(--mantine-color-gray-4)',
                    }}
                  />
                  <Text size="sm" fw={500}>
                    {part.paint?.name || part.paintId}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {part.paint?.brand}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {part.parts} part{part.parts !== 1 ? 's' : ''}
                  </Text>
                  {part.paint?.owned ? (
                    <Text size="xs" c="green">
                      ✓ Owned
                    </Text>
                  ) : (
                    <Text size="xs" c="orange">
                      Need to buy
                    </Text>
                  )}
                </Group>
              ))}
            </Stack>
          </>
        )}

        {colorData.matches && colorData.matches.length > 1 && (
          <Stack gap="xs">
            <Text fw={600} size="sm">
              Alternative Matches
            </Text>
            {colorData.matches.slice(1).map((match) => (
              <Group key={match.id} gap="xs">
                <Box
                  w={20}
                  h={20}
                  style={{
                    borderRadius: 4,
                    backgroundColor: computeMixedColor(match.parts),
                    border: '1px solid var(--mantine-color-gray-4)',
                  }}
                />
                <Text size="xs">
                  #{match.rank} — {match.matchRating} (ΔE {match.deltaE.toFixed(1)})
                </Text>
                <Text size="xs" c="dimmed">
                  {match.parts.map((p) => p.paint?.name || p.paintId).join(' + ')}
                </Text>
              </Group>
            ))}
          </Stack>
        )}
      </Stack>
    </Modal>
  );
}

function computeMixedColor(parts: db.MatchPart[]): string {
  const totalParts = parts.reduce((sum, p) => sum + p.parts, 0);
  if (totalParts === 0) return '#ccc';

  let r = 0;
  let g = 0;
  let b = 0;
  for (const part of parts) {
    if (part.paint?.hex) {
      const hex = part.paint.hex.replace('#', '');
      r += (parseInt(hex.slice(0, 2), 16) * part.parts) / totalParts;
      g += (parseInt(hex.slice(2, 4), 16) * part.parts) / totalParts;
      b += (parseInt(hex.slice(4, 6), 16) * part.parts) / totalParts;
    }
  }

  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}
