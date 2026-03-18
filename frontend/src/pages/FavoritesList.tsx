import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Box } from '@mantine/core';
import { LogErr } from '@/utils';
import { GetFavorites, DeleteFavorite } from '@app';
import { db } from '@models';
import { DataTable, type Column } from '@/components/DataTable';
import { useNavigation } from '@trueblocks/scaffold';
import { MixingBar } from '@/components/MixingBar';

interface FavoritesListProps {
  onFavoriteClick: (fav: { id: number }) => void;
}

export function FavoritesList({ onFavoriteClick }: FavoritesListProps) {
  const { setCurrentId, setItems, currentId } = useNavigation();
  const [favorites, setFavorites] = useState<db.Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const hasInitialized = useRef(false);

  const loadFavorites = useCallback(() => {
    setLoading(true);
    GetFavorites()
      .then((favs) => setFavorites(favs || []))
      .catch((err) => LogErr('Failed to load favorites:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    GetFavorites()
      .then((favs) => setFavorites(favs || []))
      .catch((err) => {
        LogErr('Failed to load favorites:', err);
        hasInitialized.current = false;
      })
      .finally(() => setLoading(false));
  }, []);

  const searchFn = useCallback((fav: db.Favorite, search: string) => {
    return fav.name.toLowerCase().includes(search.toLowerCase());
  }, []);

  const handleSelectedChange = useCallback(
    (fav: db.Favorite) => {
      setCurrentId(fav.id);
    },
    [setCurrentId]
  );

  const columns: Column<db.Favorite>[] = useMemo(
    () => [
      {
        key: 'swatch',
        label: '',
        width: '4%',
        render: (f: db.Favorite) => (
          <Box
            w={20}
            h={20}
            style={{
              borderRadius: 4,
              backgroundColor: f.hex,
              border: '1px solid var(--mantine-color-gray-4)',
            }}
          />
        ),
      },
      {
        key: 'name',
        label: 'Name',
        width: '25%',
        render: (f: db.Favorite) => f.name,
        scrollOnSelect: true,
      },
      {
        key: 'recipe',
        label: 'Recipe',
        width: '40%',
        render: (f: db.Favorite) => <MixingBar parts={f.parts || []} height={16} />,
      },
      {
        key: 'createdAt',
        label: 'Created',
        width: '20%',
        render: (f: db.Favorite) =>
          f.createdAt ? new Date(f.createdAt + 'Z').toLocaleDateString() : '-',
      },
    ],
    []
  );

  const handleFilteredSortedChange = useCallback(
    (filteredFavorites: db.Favorite[]) => {
      const items = filteredFavorites.map((f) => ({ id: f.id }));
      const navCurrentId = currentId ?? filteredFavorites[0]?.id ?? 0;
      setItems('favorite', items, navCurrentId);
    },
    [currentId, setItems]
  );

  return (
    <DataTable<db.Favorite>
      tableName="favorites"
      title="Favorites"
      data={favorites}
      columns={columns}
      loading={loading}
      getRowKey={(f) => f.id}
      onRowClick={onFavoriteClick}
      onSelectedChange={handleSelectedChange}
      onFilteredSortedChange={handleFilteredSortedChange}
      searchFn={searchFn}
      onDelete={(f: db.Favorite) => {
        DeleteFavorite(f.id).then(() => loadFavorites());
      }}
    />
  );
}
