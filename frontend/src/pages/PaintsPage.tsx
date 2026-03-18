import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconList, IconFileText } from '@tabler/icons-react';
import { TabView, type Tab } from '@trueblocks/ui';
import { NavigationProvider } from '@trueblocks/scaffold';
import { SetTab } from '@app';
import { PaintsList } from '@/pages/PaintsList';
import { PaintDetail } from '@/pages/PaintDetail';

export function PaintsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const paintId = id || undefined;
  const lastPaintIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (paintId !== undefined) {
      lastPaintIdRef.current = paintId;
    }
  }, [paintId]);

  const activeTab = paintId !== undefined ? 'detail' : 'list';

  useEffect(() => {
    SetTab('paints', activeTab);
  }, [activeTab]);

  const handleTabChange = useCallback(
    (newTab: string) => {
      if (newTab === 'list') {
        navigate('/paints');
      } else {
        const targetId = lastPaintIdRef.current;
        if (targetId !== undefined) {
          navigate(`/paints/${targetId}`);
        }
      }
    },
    [navigate]
  );

  const handlePaintClick = useCallback(
    (paint: { id: string }) => {
      navigate(`/paints/${paint.id}`);
    },
    [navigate]
  );

  const tabs: Tab[] = useMemo(
    () => [
      {
        value: 'list',
        label: 'List',
        icon: <IconList size={16} />,
        content: <PaintsList onPaintClick={handlePaintClick} />,
      },
      {
        value: 'detail',
        label: 'Detail',
        icon: <IconFileText size={16} />,
        content: paintId ? (
          <PaintDetail paintId={paintId} />
        ) : (
          <div>Select a paint to view details</div>
        ),
      },
    ],
    [paintId, handlePaintClick]
  );

  return (
    <NavigationProvider
      onNavigate={(entityType, navId) => {
        if (entityType === 'paint') {
          navigate(`/paints/${navId}`);
        }
      }}
    >
      <TabView tabs={tabs} defaultTab="list" activeTab={activeTab} onTabChange={handleTabChange} />
    </NavigationProvider>
  );
}
