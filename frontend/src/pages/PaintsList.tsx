import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Box, Checkbox } from '@mantine/core';
import { LogErr } from '@/utils';
import { GetPaints, SetPaintOwned, GetPaintFilterOptions } from '@app';
import { db } from '@models';
import { DataTable, type Column } from '@/components/DataTable';

interface PaintsListProps {
  onPaintClick: (paint: { id: string }) => void;
}

export function PaintsList({ onPaintClick }: PaintsListProps) {
  const [paints, setPaints] = useState<db.Paint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState<db.PaintFilterOptions | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    Promise.all([GetPaints(), GetPaintFilterOptions()])
      .then(([paintsData, options]) => {
        setPaints(paintsData || []);
        setFilterOptions(options);
      })
      .catch((err) => {
        LogErr('Failed to load paints:', err);
        hasInitialized.current = false;
      })
      .finally(() => setLoading(false));
  }, []);

  const searchFn = useCallback((paint: db.Paint, search: string) => {
    const lower = search.toLowerCase();
    return (
      paint.name.toLowerCase().includes(lower) ||
      paint.brand.toLowerCase().includes(lower) ||
      paint.pigments.toLowerCase().includes(lower)
    );
  }, []);

  const handleSelectedChange = useCallback((_paint: db.Paint) => {
    // Paint IDs are strings; NavigationProvider uses numeric IDs
  }, []);

  const handleToggleOwned = useCallback(async (paint: db.Paint) => {
    try {
      await SetPaintOwned(paint.id, !paint.owned);
      setPaints((prev) =>
        prev.map((p) => (p.id === paint.id ? ({ ...p, owned: !p.owned } as db.Paint) : p))
      );
    } catch (err) {
      LogErr('Failed to toggle owned:', err);
    }
  }, []);

  const columns: Column<db.Paint>[] = useMemo(
    () => [
      {
        key: 'swatch',
        label: '',
        width: '4%',
        render: (p: db.Paint) => (
          <Box
            w={20}
            h={20}
            style={{
              borderRadius: 4,
              backgroundColor: p.hex,
              border: '1px solid var(--mantine-color-gray-4)',
            }}
          />
        ),
      },
      {
        key: 'name',
        label: 'Name',
        width: '25%',
        render: (p: db.Paint) => p.name,
        scrollOnSelect: true,
      },
      {
        key: 'brand',
        label: 'Brand',
        width: '15%',
        render: (p: db.Paint) => p.brand,
        filterOptions: filterOptions?.brands || [],
      },
      {
        key: 'series',
        label: 'Series',
        width: '8%',
        render: (p: db.Paint) => p.series,
      },
      {
        key: 'opacity',
        label: 'Opacity',
        width: '10%',
        render: (p: db.Paint) => p.opacity,
        filterOptions: filterOptions?.opacities || [],
      },
      {
        key: 'pigments',
        label: 'Pigments',
        width: '20%',
        render: (p: db.Paint) => p.pigments,
      },
      {
        key: 'owned',
        label: 'Owned',
        width: '8%',
        render: (p: db.Paint) => (
          <Box onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <Checkbox
              checked={p.owned}
              onChange={() => handleToggleOwned(p)}
              size="sm"
              color="green"
            />
          </Box>
        ),
        filterOptions: ['Owned', 'Not Owned'],
      },
    ],
    [filterOptions, handleToggleOwned]
  );

  const handleFilteredSortedChange = useCallback((_filteredPaints: db.Paint[]) => {
    // Paint IDs are strings; NavigationProvider uses numeric IDs
  }, []);

  return (
    <DataTable<db.Paint>
      tableName="paints"
      title="Paints"
      data={paints}
      columns={columns}
      loading={loading}
      getRowKey={(p) => p.id}
      onRowClick={onPaintClick}
      onSelectedChange={handleSelectedChange}
      onFilteredSortedChange={handleFilteredSortedChange}
      searchFn={searchFn}
    />
  );
}
