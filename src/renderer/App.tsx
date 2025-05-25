import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from './components/theme-provider';
import { Outlet, useLocation, useNavigate } from 'react-router';
import TitleBar from './components/TitleBar/TitleBar';
import { cn, isNewTabKey, isNextTabKey, isPreviousTabKey, isZoomIn, isZoomOut } from './lib/utils';
import TerminalPanel from './features/terminalTabs/TerminalPanel';
import { useAppDispatch, useAppSelector } from './app/hooks';
import {
  cycleNextTab,
  cyclePreviousTab,
  selectFocusedTabId,
  selectIsHostSelectionDialogOpen,
  toggleHostSelectionDialog,
  unfocusTabs
} from './features/terminalTabs/terminalTabsSlice';
import { useEffect } from 'react';
import HostSelectionDialog from './features/terminalTabs/HostSelectionDialog';

function App() {
  // window.onkeydown = function(evt) {
  //   // disable zooming
  //   if (
  //     (evt.code === "Minus" || evt.code === "Equal") &&
  //     (evt.ctrlKey || evt.metaKey)
  //   ) {
  //     evt.preventDefault();
  //   }
  // };

  const location = useLocation();
  const isTerminalTab = location.pathname.includes('/terminals/');
  const hostSelectionDialogVisible = useAppSelector(selectIsHostSelectionDialogOpen);
  const focusedTabId = useAppSelector(selectFocusedTabId);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleHostSelectionDialogOpenChange = () => {
    dispatch(toggleHostSelectionDialog());
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (isNewTabKey(e)) {
        e.preventDefault();
        dispatch(toggleHostSelectionDialog());
      }
      if (isNextTabKey(e)) {
        e.preventDefault();
        dispatch(cycleNextTab());
      }
      if (isPreviousTabKey(e)) {
        e.preventDefault();
        dispatch(cyclePreviousTab());
      }
      if (isZoomIn(e) || isZoomOut(e)) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (focusedTabId) {
      navigate(`/terminals/${focusedTabId}`);
    } else {
      navigate('/');
    }
  }, [focusedTabId]);

  useEffect(() => {
    if (!isTerminalTab) {
      dispatch(unfocusTabs());
    }
  }, [location.pathname]);

  return (
    <ThemeProvider defaultTheme="system">
      <div className="flex flex-col h-screen w-screen">
        <TitleBar />
        <main className="flex flex-1 overflow-hidden">
          {!isTerminalTab && <Outlet />}
          {/* Need to keep these rendered but invisible */}
          <div className={cn('w-full h-full', !isTerminalTab && 'hidden')}>
            <TerminalPanel />
          </div>
        </main>
      </div>
      <Toaster />
      <HostSelectionDialog
        open={hostSelectionDialogVisible}
        handleOpenChange={handleHostSelectionDialogOpenChange}
      />
    </ThemeProvider>
  );
}

export default App;
