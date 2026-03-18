import { useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, ThemeState, initLogger, initOS } from '@trueblocks/ui';
import { LogInfo, LogError, LogDebug, LogWarning, BrowserOpenURL } from '@wailsjs/runtime/runtime';
import { GetThemeState, SaveThemeState } from '@app';
import { appkit } from '@models';
import { TabProvider, DebugProvider } from '@/stores';
import App from './App';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

initLogger({ info: LogInfo, error: LogError, debug: LogDebug, warn: LogWarning });
initOS({ openURL: BrowserOpenURL });

function Root() {
  const loadTheme = useCallback(async (): Promise<ThemeState> => {
    const ts = await GetThemeState();
    return { theme: ts.theme || 'default', darkMode: ts.darkMode || false };
  }, []);

  const saveTheme = useCallback(async (state: ThemeState): Promise<void> => {
    const m = new appkit.UIPreferences({ theme: state.theme, darkMode: state.darkMode });
    await SaveThemeState(m);
  }, []);

  return (
    <ThemeProvider loadTheme={loadTheme} saveTheme={saveTheme}>
      <Notifications position="top-right" />
      <BrowserRouter>
        <TabProvider>
          <DebugProvider>
            <App />
          </DebugProvider>
        </TabProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Root />);
