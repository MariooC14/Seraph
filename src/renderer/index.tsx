/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import App from './App';
import './index.css';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router';
import Hosts from './pages/Home/pages/hosts';
import Containers from './pages/Home/pages/containers';
import Settings from './pages/Home/pages/settings';
import Home from './pages/Home/Home';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { initializeConfigState } from './features/config/configSlice';

const root = createRoot(document.body);
root.render(
  <HashRouter>
    <Provider store={store}>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Home />}>
            <Route index element={<Hosts />} />
            <Route path="containers" element={<Containers />} />
            <Route path="settings" element={<Settings />} />
            {/* The path below is rendered by App. We need to keep the terminals rendered but invisible */}
            <Route path="terminals/:terminalId" />
          </Route>
        </Route>
      </Routes>
    </Provider>
  </HashRouter>
);

store.dispatch(initializeConfigState());
