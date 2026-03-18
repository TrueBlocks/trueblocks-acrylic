import { GetTableState, SetTableState } from '@app';
import { createDataTable } from '@trueblocks/ui';
import type { PersistTableState } from '@trueblocks/ui';

export type { Column, DataTableProps } from '@trueblocks/ui';
export type { SortDirection, SortColumn, ViewSort } from '@trueblocks/ui';

export const DataTable = createDataTable(
  (name) => GetTableState(name) as Promise<Partial<PersistTableState>>,
  (name, s) => SetTableState(name, s as Parameters<typeof SetTableState>[1])
);
