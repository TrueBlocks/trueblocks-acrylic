import { createPersistedTabContext } from '@trueblocks/ui';
import { GetTab, SetTab } from '@app';

type TabbedPage = 'projects' | 'paints' | 'favorites';

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

export const { TabProvider, useTabContext } = createPersistedTabContext<TabbedPage>({
  defaultActiveTab,
  defaultTabs,
  loadTab: GetTab,
  saveTab: SetTab,
});
