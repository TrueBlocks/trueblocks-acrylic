import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Box } from '@mantine/core';
import { LogErr } from '@/utils';
import { GetProjects, DeleteProjectWithFiles, GetImageURL } from '@app';
import { db } from '@models';
import { DataTable, type Column } from '@/components/DataTable';
import { useNavigation } from '@trueblocks/scaffold';
import { notifications } from '@mantine/notifications';
import { NewProjectModal } from '@/components/NewProjectModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';

interface ProjectsListProps {
  onProjectClick: (project: { id: number }) => void;
  onFilteredDataChange: (projects: { id: number }[]) => void;
}

export function ProjectsList({ onProjectClick, onFilteredDataChange }: ProjectsListProps) {
  const { currentId, setCurrentId, setItems } = useNavigation();
  const [projects, setProjects] = useState<db.Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState<db.Project | null>(null);
  const hasInitialized = useRef(false);

  const loadProjects = useCallback(() => {
    setLoading(true);
    GetProjects()
      .then((projs) => setProjects(projs || []))
      .catch((err) => LogErr('Failed to load projects:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    GetProjects()
      .then((projs) => setProjects(projs || []))
      .catch((err) => {
        LogErr('Failed to load projects:', err);
        hasInitialized.current = false;
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    function handleReload() {
      loadProjects();
    }
    window.addEventListener('reloadCurrentView', handleReload);
    return () => window.removeEventListener('reloadCurrentView', handleReload);
  }, [loadProjects]);

  const searchFn = useCallback((project: db.Project, search: string) => {
    return project.name.toLowerCase().includes(search.toLowerCase());
  }, []);

  const handleSelectedChange = useCallback(
    (project: db.Project) => {
      setCurrentId(project.id);
    },
    [setCurrentId]
  );

  const handleDeleteClick = useCallback((project: db.Project) => {
    setDeletingProject(project);
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingProject) return;
    try {
      await DeleteProjectWithFiles(deletingProject.id);
      setDeleteModalOpen(false);
      setDeletingProject(null);
      notifications.show({ message: 'Project deleted', color: 'green', autoClose: 2000 });
      loadProjects();
    } catch (err) {
      LogErr('Failed to delete project:', err);
      notifications.show({ message: 'Delete failed', color: 'red', autoClose: 5000 });
    }
  }, [deletingProject, loadProjects]);

  const handleProjectCreated = useCallback(() => {
    setNewModalOpen(false);
    loadProjects();
  }, [loadProjects]);

  const columns: Column<db.Project>[] = useMemo(
    () => [
      {
        key: 'thumbnail',
        label: '',
        width: '5%',
        render: (p: db.Project) => (
          <Box
            w={40}
            h={40}
            style={{
              borderRadius: 4,
              overflow: 'hidden',
              backgroundColor: 'var(--mantine-color-gray-2)',
            }}
          >
            {p.thumbnailPath && <Thumbnail path={p.thumbnailPath} alt={p.name} />}
          </Box>
        ),
      },
      {
        key: 'name',
        label: 'Name',
        width: '40%',
        render: (p: db.Project) => p.name,
        scrollOnSelect: true,
      },
      {
        key: 'nColors',
        label: 'Colors',
        width: '15%',
        render: (p: db.Project) => p.nColors,
      },
      {
        key: 'updatedAt',
        label: 'Last Modified',
        width: '25%',
        render: (p: db.Project) =>
          p.updatedAt ? new Date(p.updatedAt + 'Z').toLocaleDateString() : '-',
      },
    ],
    []
  );

  const handleFilteredSortedChange = useCallback(
    (filteredProjects: db.Project[]) => {
      onFilteredDataChange(filteredProjects);
      const items = filteredProjects.map((p) => ({ id: p.id }));
      const navCurrentId = currentId ?? filteredProjects[0]?.id ?? 0;
      setItems('project', items, navCurrentId);
    },
    [onFilteredDataChange, currentId, setItems]
  );

  return (
    <>
      <DataTable<db.Project>
        tableName="projects"
        title="Projects"
        data={projects}
        columns={columns}
        loading={loading}
        getRowKey={(p) => p.id}
        onRowClick={onProjectClick}
        onSelectedChange={handleSelectedChange}
        onFilteredSortedChange={handleFilteredSortedChange}
        searchFn={searchFn}
        onDelete={handleDeleteClick}
        headerActions={
          <Box
            component="button"
            onClick={() => setNewModalOpen(true)}
            style={{
              cursor: 'pointer',
              border: '1px solid var(--mantine-color-gray-4)',
              borderRadius: 4,
              padding: '4px 12px',
              background: 'var(--mantine-color-blue-6)',
              color: 'white',
              fontSize: 13,
            }}
          >
            New Project
          </Box>
        }
      />
      <NewProjectModal
        opened={newModalOpen}
        onClose={() => setNewModalOpen(false)}
        onCreated={handleProjectCreated}
      />
      <DeleteConfirmModal
        opened={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingProject(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message={`Are you sure you want to delete "${deletingProject?.name}"? This will remove the project, its images, and all associated data.`}
      />
    </>
  );
}

function Thumbnail({ path, alt }: { path: string; alt: string }) {
  const [src, setSrc] = useState('');
  useEffect(() => {
    GetImageURL(path).then(setSrc);
  }, [path]);
  if (!src) return null;
  return <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
}
