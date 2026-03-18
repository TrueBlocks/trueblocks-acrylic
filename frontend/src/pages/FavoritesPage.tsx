import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconList, IconFileText } from '@tabler/icons-react';
import { TabView, type Tab } from '@trueblocks/ui';
import { NavigationProvider } from '@trueblocks/scaffold';
import { SetTab } from '@app';
import { FavoritesList } from '@/pages/FavoritesList';
import { FavoriteDetail } from '@/pages/FavoriteDetail';

export function FavoritesPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const favoriteId = id ? parseInt(id, 10) : undefined;
  const lastFavoriteIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (favoriteId !== undefined) {
      lastFavoriteIdRef.current = favoriteId;
    }
  }, [favoriteId]);

  const activeTab = favoriteId !== undefined ? 'detail' : 'list';

  useEffect(() => {
    SetTab('favorites', activeTab);
  }, [activeTab]);

  const handleTabChange = useCallback(
    (newTab: string) => {
      if (newTab === 'list') {
        navigate('/favorites');
      } else {
        const targetId = lastFavoriteIdRef.current;
        if (targetId !== undefined) {
          navigate(`/favorites/${targetId}`);
        }
      }
    },
    [navigate]
  );

  const handleFavoriteClick = useCallback(
    (fav: { id: number }) => {
      navigate(`/favorites/${fav.id}`);
    },
    [navigate]
  );

  const tabs: Tab[] = useMemo(
    () => [
      {
        value: 'list',
        label: 'List',
        icon: <IconList size={16} />,
        content: <FavoritesList onFavoriteClick={handleFavoriteClick} />,
      },
      {
        value: 'detail',
        label: 'Detail',
        icon: <IconFileText size={16} />,
        content: favoriteId ? (
          <FavoriteDetail favoriteId={favoriteId} />
        ) : (
          <div>Select a favorite to view details</div>
        ),
      },
    ],
    [favoriteId, handleFavoriteClick]
  );

  return (
    <NavigationProvider
      onNavigate={(entityType, navId) => {
        if (entityType === 'favorite') {
          navigate(`/favorites/${navId}`);
        }
      }}
    >
      <TabView tabs={tabs} defaultTab="list" activeTab={activeTab} onTabChange={handleTabChange} />
    </NavigationProvider>
  );
}
