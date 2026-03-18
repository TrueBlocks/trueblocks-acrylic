import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconList, IconFileText } from '@tabler/icons-react';
import { TabView, type Tab } from '@trueblocks/ui';
import { NavigationProvider } from '@trueblocks/scaffold';
import { SetTab } from '@app';
import { ProjectsList } from '@/pages/ProjectsList';
import { ProjectDetail } from '@/pages/ProjectDetail';

export function ProjectsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const projectId = id ? parseInt(id, 10) : undefined;
  const lastProjectIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (projectId !== undefined) {
      lastProjectIdRef.current = projectId;
    }
  }, [projectId]);

  const activeTab = projectId !== undefined ? 'detail' : 'list';

  useEffect(() => {
    SetTab('projects', activeTab);
  }, [activeTab]);

  const handleTabChange = useCallback(
    (newTab: string) => {
      if (newTab === 'list') {
        navigate('/projects');
      } else {
        const targetId = lastProjectIdRef.current;
        if (targetId !== undefined) {
          navigate(`/projects/${targetId}`);
        }
      }
    },
    [navigate]
  );

  const handleProjectClick = useCallback(
    (project: { id: number }) => {
      navigate(`/projects/${project.id}`);
    },
    [navigate]
  );

  const [_filteredProjects, setFilteredProjects] = useState<{ id: number }[]>([]);

  const tabs: Tab[] = useMemo(
    () => [
      {
        value: 'list',
        label: 'List',
        icon: <IconList size={16} />,
        content: (
          <ProjectsList
            onProjectClick={handleProjectClick}
            onFilteredDataChange={setFilteredProjects}
          />
        ),
      },
      {
        value: 'detail',
        label: 'Detail',
        icon: <IconFileText size={16} />,
        content: projectId ? (
          <ProjectDetail projectId={projectId} />
        ) : (
          <div>Select a project to view details</div>
        ),
      },
    ],
    [projectId, handleProjectClick]
  );

  return (
    <NavigationProvider
      onNavigate={(entityType, navId) => {
        if (entityType === 'project') {
          navigate(`/projects/${navId}`);
        }
      }}
    >
      <TabView tabs={tabs} defaultTab="list" activeTab={activeTab} onTabChange={handleTabChange} />
    </NavigationProvider>
  );
}
