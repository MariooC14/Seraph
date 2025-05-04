import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./components/theme-provider";
import { Outlet, useLocation } from "react-router";
import TitleBar from "./components/TitleBar/TitleBar";
import { cn, isNewTabKey } from "./lib/utils";
import TerminalPanel from "./features/terminalTabs/TerminalPanel";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { selectIsHostSelectionDialogOpen, toggleHostSelectionDialog } from "./features/terminalTabs/terminalTabsSlice";
import { useEffect } from "react";
import HostSelectionDialog from "./features/terminalTabs/HostSelectionDialog";

function App() {
  const location = useLocation();
  const isTerminalTab = location.pathname.includes("/terminals/");
  const hostSelectionDialogVisible = useAppSelector(selectIsHostSelectionDialogOpen);
  const dispatch = useAppDispatch();

  const handleHostSelectionDialogOpenChange = () => {
    dispatch(toggleHostSelectionDialog());
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (isNewTabKey(e)) {
        e.preventDefault()
        dispatch(toggleHostSelectionDialog());
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <ThemeProvider defaultTheme="system">
      <div className="flex flex-col h-screen w-screen">
        <TitleBar />
        <main className="flex flex-1 overflow-hidden">
          {!isTerminalTab && <Outlet />}
          {/* Need to keep these rendered but invisible */}
          <div className={cn("w-full h-full", !isTerminalTab && "hidden")}>
            <TerminalPanel />
          </div>
        </main>
      </div>
      <Toaster />
      <HostSelectionDialog open={hostSelectionDialogVisible} handleOpenChange={handleHostSelectionDialogOpenChange} />
    </ThemeProvider>
  );
}

export default App;
