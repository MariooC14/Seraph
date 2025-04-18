import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./components/theme-provider";
import { Outlet } from "react-router";
import Sidebar from "./components/Sidebar";
import ConfigProvider from "./context/ConfigProvider";
import TitleBar from "./components/TitleBar/TitleBar";
import { ScrollArea } from "./components/ui/scroll-area";

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <ConfigProvider>
        <div className="flex flex-col h-screen w-screen">
          <TitleBar />
          <main className="flex flex-1 overflow-hidden">
            <Sidebar />
            <ScrollArea className="p-8 h-full flex-1">
              <Outlet />
            </ScrollArea>
          </main>
        </div>
        <Toaster />
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default App;
