import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./components/theme-provider";
import { Outlet } from "react-router";
import ConfigProvider from "./context/ConfigProvider";
import TitleBar from "./components/TitleBar/TitleBar";
import TerminalTabsProvider from "./context/TerminalTabsProvider";

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <ConfigProvider>
        <TerminalTabsProvider>
          <div className="flex flex-col h-screen w-screen">
            <TitleBar />
            <main className="flex flex-1 overflow-hidden">
              <Outlet />
            </main>
          </div>
        </TerminalTabsProvider>
        <Toaster />
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default App;
