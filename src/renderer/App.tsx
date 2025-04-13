import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { Outlet } from "react-router";
import MainNav from "./components/main-nav";
import ConfigProvider from "./context/ConfigProvider";

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <ConfigProvider>
        <div className="min-h-screen">
          <div className="flex">
            <div className="w-64 border-r bg-muted/10 min-h-[calc(100vh-4rem)] p-4">
              <MainNav />
            </div>
            <div className="flex-1 p-8">
              <Outlet />
            </div>
          </div>
        </div>
        <Toaster />
        <ModeToggle />
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default App;
