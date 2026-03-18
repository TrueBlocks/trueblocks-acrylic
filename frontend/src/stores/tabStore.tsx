import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { GetTab, SetTab } from '@app';

type TabbedPage = 'projects' | 'paints' | 'favorites';

interface TabContextValue {
  getTab: (page: TabbedPage) => string;
  setTab: (page: TabbedPage, tab: string) => void;
  cycleTab: (page: TabbedPage) => void;
}

const defaultActiveTab: Record<TabbedPage, string> = {
  projects: 'list',
  paints: 'list',
  favorites: 'list',
};

const defaultTabs: Record<TabbedPage, string[]> = {
  projects: ['list', 'detail'],
  paints: ['list', 'detail'],
  favorites: ['list', 'detail'],
};

const TabContext = createContext<TabContextValue | null>(null);

export function TabProvider({ children }: { children: ReactNode }) {
  const [tabState, setTabState] = useState<Record<TabbedPage, string>>(defaultActiveTab);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([GetTab('projects'), GetTab('paints'), GetTab('favorites')]).then(
      ([projectsTab, paintsTab, favoritesTab]) => {
        const newState: Record<TabbedPage, string> = { ...defaultActiveTab };
        if (projectsTab) newState.projects = projectsTab;
        if (paintsTab) newState.paints = paintsTab;
        if (favoritesTab) newState.favorites = favoritesTab;
        setTabState(newState);
        setLoaded(true);
      }
    );
  }, []);

  const getTab = useCallback((page: TabbedPage) => tabState[page], [tabState]);

  const setTab = useCallback((page: TabbedPage, tab: string) => {
    setTabState((prev) => ({ ...prev, [page]: tab }));
    SetTab(page, tab);
  }, []);

  const cycleTab = useCallback(
    (page: TabbedPage) => {
      const tabs = defaultTabs[page];
      const currentTab = tabState[page];
      const currentIndex = tabs.indexOf(currentTab);
      const nextIndex = (currentIndex + 1) % tabs.length;
      const nextTab = tabs[nextIndex];
      setTabState((prev) => ({ ...prev, [page]: nextTab }));
      SetTab(page, nextTab);
    },
    [tabState]
  );

  if (!loaded) {
    return null;
  }

  return <TabContext.Provider value={{ getTab, setTab, cycleTab }}>{children}</TabContext.Provider>;
}

export function useTabContext() {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabContext must be used within TabProvider');
  }
  return context;
}
