import { useState, useEffect, useCallback } from 'react';
import { Stack, Group, Text, Box, Loader, ActionIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { LogErr } from '@/utils';
import { GetFavorite, DeleteFavorite } from '@app';
import { db } from '@models';
import { MixingBar } from '@/components/MixingBar';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';

interface FavoriteDetailProps {
  favoriteId: number;
}

export function FavoriteDetail({ favoriteId }: FavoriteDetailProps) {
  const [favorite, setFavorite] = useState<db.Favorite | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const fav = await GetFavorite(favoriteId);
      setFavorite(fav);
    } catch (err) {
      LogErr('Failed to load favorite:', err);
    } finally {
      setLoading(false);
    }
  }, [favoriteId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = useCallback(async () => {
    if (!favorite) return;
    try {
      await DeleteFavorite(favorite.id);
      notifications.show({ message: 'Favorite deleted', color: 'green', autoClose: 2000 });
      navigate('/favorites');
    } catch (err) {
      LogErr('Failed to delete favorite:', err);
    }
  }, [favorite, navigate]);

  if (loading) {
    return (
      <Stack align="center" justify="center" h="100%">
        <Loader />
      </Stack>
    );
  }

  if (!favorite) {
    return (
      <Stack align="center" justify="center" h="100%">
        <Text c="dimmed">Favorite not found</Text>
      </Stack>
    );
  }

  const parts = favorite.parts || [];

  return (
    <Stack p="md" gap="lg">
      <Group justify="space-between">
        <Group gap="lg" align="flex-start">
          <Box
            w={80}
            h={80}
            style={{
              borderRadius: 8,
              backgroundColor: favorite.hex,
              border: '2px solid var(--mantine-color-gray-4)',
            }}
          />
          <Stack gap="xs">
            <Text fw={700} size="xl">
              {favorite.name}
            </Text>
            <Text size="sm" c="dimmed">
              {favorite.hex} · RGB({favorite.r}, {favorite.g}, {favorite.b})
            </Text>
          </Stack>
        </Group>
        <ActionIcon variant="light" color="red" size="lg" onClick={handleDelete}>
          <IconTrash size={20} />
        </ActionIcon>
      </Group>

      {favorite.notes && (
        <Stack gap="xs">
          <Text fw={600} size="sm">
            Notes
          </Text>
          <Text size="sm">{favorite.notes}</Text>
        </Stack>
      )}

      <Stack gap="xs">
        <Text fw={600} size="sm">
          Mixing Recipe
        </Text>
        <MixingBar parts={parts} height={32} />
      </Stack>

      {parts.length > 0 && (
        <Stack gap="xs">
          <Text fw={600} size="sm">
            Paint Components
          </Text>
          {parts.map((part) => (
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
            </Group>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
