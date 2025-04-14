import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./components/theme-provider";
import { Outlet } from "react-router";
import MainNav from "./components/main-nav";
import ConfigProvider from "./context/ConfigProvider";
import TitleBar from "./components/TitleBar/TitleBar";
import { ScrollArea } from "./components/ui/scroll-area";

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <ConfigProvider>
        <div className="h-screen w-screen">
          <TitleBar />
          <div id="mainContent" className="flex overflow-hidden">
            <div className="min-w-44 border-r bg-muted/10 p-3">
              <MainNav />
            </div>
            <ScrollArea className="flex-1 p-8 h-full">
              <Outlet />
            </ScrollArea>
          </div>
        </div>
        <Toaster />
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default App;
