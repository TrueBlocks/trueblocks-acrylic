import { useState, useEffect, useCallback } from 'react';
import { Stack, Group, Text, Box, Loader, Badge, Checkbox } from '@mantine/core';
import { LogErr } from '@/utils';
import { GetPaint, SetPaintOwned, GetPaintProjectCount } from '@app';
import { db } from '@models';

interface PaintDetailProps {
  paintId: string;
}

export function PaintDetail({ paintId }: PaintDetailProps) {
  const [paint, setPaint] = useState<db.Paint | null>(null);
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [paintData, count] = await Promise.all([
        GetPaint(paintId),
        GetPaintProjectCount(paintId),
      ]);
      setPaint(paintData);
      setProjectCount(count);
    } catch (err) {
      LogErr('Failed to load paint:', err);
    } finally {
      setLoading(false);
    }
  }, [paintId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleOwned = useCallback(async () => {
    if (!paint) return;
    try {
      await SetPaintOwned(paint.id, !paint.owned);
      setPaint((prev) => (prev ? ({ ...prev, owned: !prev.owned } as db.Paint) : prev));
    } catch (err) {
      LogErr('Failed to toggle owned:', err);
    }
  }, [paint]);

  if (loading) {
    return (
      <Stack align="center" justify="center" h="100%">
        <Loader />
      </Stack>
    );
  }

  if (!paint) {
    return (
      <Stack align="center" justify="center" h="100%">
        <Text c="dimmed">Paint not found</Text>
      </Stack>
    );
  }

  return (
    <Stack p="md" gap="lg">
      <Group gap="lg" align="flex-start">
        <Box
          w={120}
          h={120}
          style={{
            borderRadius: 8,
            backgroundColor: paint.hex,
            border: '2px solid var(--mantine-color-gray-4)',
          }}
        />
        <Stack gap="xs">
          <Text fw={700} size="xl">
            {paint.name}
          </Text>
          <Text size="sm" c="dimmed">
            {paint.brand} · Series {paint.series}
          </Text>
          <Group gap="xs">
            <Badge color={paint.opacity === 'Opaque' ? 'blue' : 'yellow'} variant="light">
              {paint.opacity}
            </Badge>
            <Badge variant="light">{paint.hex}</Badge>
          </Group>
        </Stack>
      </Group>

      <Group gap="md">
        <Checkbox
          checked={paint.owned}
          onChange={handleToggleOwned}
          size="md"
          color="green"
          label={paint.owned ? 'In your collection' : 'Not owned'}
        />
      </Group>

      <Stack gap="xs">
        <Text fw={600} size="sm">
          Details
        </Text>
        <Group gap="xl">
          <Stack gap={2}>
            <Text size="xs" c="dimmed">
              Pigments
            </Text>
            <Text size="sm">{paint.pigments}</Text>
          </Stack>
          <Stack gap={2}>
            <Text size="xs" c="dimmed">
              RGB
            </Text>
            <Text size="sm">
              {paint.r}, {paint.g}, {paint.b}
            </Text>
          </Stack>
          <Stack gap={2}>
            <Text size="xs" c="dimmed">
              Lab
            </Text>
            <Text size="sm">
              {paint.labL.toFixed(1)}, {paint.labA.toFixed(1)}, {paint.labB.toFixed(1)}
            </Text>
          </Stack>
        </Group>
      </Stack>

      <Stack gap="xs">
        <Text fw={600} size="sm">
          Usage
        </Text>
        <Text size="sm">
          Used in {projectCount} project{projectCount !== 1 ? 's' : ''}
        </Text>
      </Stack>
    </Stack>
  );
}
