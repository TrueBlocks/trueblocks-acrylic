import { useState, useEffect, useCallback } from 'react';
import { Stack, Group, Text, Loader, Box } from '@mantine/core';
import { LogErr, Log } from '@/utils';
import { GetProject, GetProjectColorsWithMatches, UpdateProject, ReprocessProject } from '@app';
import { db } from '@models';
import { Canvas } from '@/components/Canvas';
import { CanvasControls } from '@/components/CanvasControls';
import { PaletteGrid } from '@/components/PaletteGrid';
import { ShoppingList } from '@/components/ShoppingList';
import { PdfButtons } from '@/components/PdfButtons';
import { ColorDetailModal } from '@/components/ColorDetailModal';

interface ProjectDetailProps {
  projectId: number;
}

export function ProjectDetail({ projectId }: ProjectDetailProps) {
  const [project, setProject] = useState<db.Project | null>(null);
  const [colorData, setColorData] = useState<db.ProjectColorWithMatches[]>([]);
  const [loading, setLoading] = useState(true);
  const [highlightedColorId, setHighlightedColorId] = useState<number | null>(null);
  const [colorDetailOpen, setColorDetailOpen] = useState(false);
  const [selectedColorData, setSelectedColorData] = useState<db.ProjectColorWithMatches | null>(
    null
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [proj, projColors] = await Promise.all([
        GetProject(projectId),
        GetProjectColorsWithMatches(projectId),
      ]);
      setProject(proj);
      setColorData(projColors || []);
    } catch (err) {
      LogErr('Failed to load project:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleParameterChange = useCallback(
    async (field: string, value: number | boolean | string) => {
      if (!project) return;
      try {
        const updated = new db.Project({
          ...project,
          [field]: value,
        });
        await UpdateProject(updated);
        await ReprocessProject(project.id);
        await loadData();
        Log(`Reprocessed project after ${field} change`);
      } catch (err) {
        LogErr('Failed to update project:', err);
      }
    },
    [project, loadData]
  );

  const handleColorClick = useCallback((pcm: db.ProjectColorWithMatches) => {
    setHighlightedColorId((prev) => (prev === pcm.color.id ? null : pcm.color.id));
  }, []);

  const handleColorDetailClick = useCallback((pcm: db.ProjectColorWithMatches) => {
    setSelectedColorData(pcm);
    setColorDetailOpen(true);
  }, []);

  if (loading) {
    return (
      <Stack align="center" justify="center" h="100%">
        <Loader />
        <Text size="sm" c="dimmed">
          Loading project...
        </Text>
      </Stack>
    );
  }

  if (!project) {
    return (
      <Stack align="center" justify="center" h="100%">
        <Text c="dimmed">Project not found</Text>
      </Stack>
    );
  }

  return (
    <Stack h="100%" gap="xs" style={{ overflow: 'hidden' }}>
      <Group justify="space-between" px="md" pt="xs">
        <Text fw={600} size="lg">
          {project.name}
        </Text>
        <PdfButtons projectId={project.id} />
      </Group>

      <Group grow align="flex-start" px="md" style={{ flex: 1, overflow: 'hidden' }}>
        <Box style={{ flex: 2, position: 'relative' }}>
          <Canvas
            imagePath={project.imagePath}
            colorData={colorData}
            highlightedColorId={highlightedColorId}
            posterize={project.posterize}
            tileSize={project.tileSize}
            smoothingPasses={project.smoothingPasses}
            aspectRatio={project.aspectRatio}
          />
        </Box>

        <Stack style={{ flex: 1, overflow: 'auto' }} gap="xs">
          <CanvasControls
            nColors={project.nColors}
            tileSize={project.tileSize}
            posterize={project.posterize}
            smoothingPasses={project.smoothingPasses}
            aspectRatio={project.aspectRatio}
            matchOwnedOnly={project.matchOwnedOnly}
            onParameterChange={handleParameterChange}
          />

          <PaletteGrid
            colorData={colorData}
            highlightedColorId={highlightedColorId}
            onColorClick={handleColorClick}
          />

          <ShoppingList
            colorData={colorData}
            matchOwnedOnly={project.matchOwnedOnly}
            onColorClick={handleColorDetailClick}
          />
        </Stack>
      </Group>

      <ColorDetailModal
        opened={colorDetailOpen}
        onClose={() => {
          setColorDetailOpen(false);
          setSelectedColorData(null);
        }}
        colorData={selectedColorData}
      />
    </Stack>
  );
}
