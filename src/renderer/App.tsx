import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./components/theme-provider";
import { Outlet, useLocation } from "react-router";
import ConfigProvider from "./context/ConfigProvider";
import TitleBar from "./components/TitleBar/TitleBar";
import TerminalTabsProvider from "./context/TerminalTabsProvider";
import { cn } from "./lib/utils";
import TerminalPanel from "./components/TerminalWindow/TerminalPanel";

function App() {
  const location = useLocation();
  const isTerminalTab = location.pathname.includes("/terminals/");

  return (
    <ThemeProvider defaultTheme="system">
      <ConfigProvider>
        <TerminalTabsProvider>
          <div className="flex flex-col h-screen w-screen">
            <TitleBar />
            <main className="flex flex-1 overflow-hidden">
              {!isTerminalTab && <Outlet />}
              {/* Need to keep these rendered but invisible */}
              <div className={cn("w-full h-full",!isTerminalTab && "hidden")}>
                <TerminalPanel />
              </div>
            </main>
          </div>
        </TerminalTabsProvider>
        <Toaster />
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default App;
