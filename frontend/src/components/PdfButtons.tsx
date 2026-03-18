import { Group, ActionIcon, Tooltip } from '@mantine/core';
import { IconFileExport } from '@tabler/icons-react';
import {
  ExportComparisonPDF,
  ExportPaintByNumbersPDF,
  ExportColorDetailPDF,
  ExportShoppingListPDF,
} from '@app';
import { LogErr } from '@/utils';
import { notifications } from '@mantine/notifications';
import { useCallback } from 'react';

interface PdfButtonsProps {
  projectId: number;
}

const PDF_EXPORTS = [
  { label: 'Comparison PDF', fn: (id: number) => ExportComparisonPDF(id), key: '1' },
  { label: 'Paint-by-Numbers PDF', fn: (id: number) => ExportPaintByNumbersPDF(id), key: '2' },
  { label: 'Color Detail PDF', fn: (id: number) => ExportColorDetailPDF(id, 0), key: '3' },
  { label: 'Shopping List PDF', fn: (id: number) => ExportShoppingListPDF(id), key: '4' },
];

export function PdfButtons({ projectId }: PdfButtonsProps) {
  const handleExport = useCallback(
    async (exportFn: (id: number) => Promise<string>, label: string) => {
      try {
        const path = await exportFn(projectId);
        if (path) {
          notifications.show({
            message: `${label} saved`,
            color: 'green',
            autoClose: 2000,
          });
        }
      } catch (err) {
        LogErr(`Failed to export ${label}:`, err);
        notifications.show({
          message: `Export failed: ${label}`,
          color: 'red',
          autoClose: 5000,
        });
      }
    },
    [projectId]
  );

  return (
    <Group gap={4}>
      {PDF_EXPORTS.map((exp) => (
        <Tooltip key={exp.key} label={`${exp.label} (Cmd+${exp.key})`} withArrow>
          <ActionIcon variant="light" size="sm" onClick={() => handleExport(exp.fn, exp.label)}>
            <IconFileExport size={14} />
          </ActionIcon>
        </Tooltip>
      ))}
    </Group>
  );
}
