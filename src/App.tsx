import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./components/theme-provider";
import { toast } from "sonner";
import { ModeToggle } from "./components/mode-toggle";

function App() {

  return (
    <ThemeProvider defaultTheme="system">
      <h2 className="text-3xl font-bold underline">Hi Electron</h2>
      <button onClick={() => toast("Toast message")}>Toast me</button>
      <Toaster />
      <ModeToggle />
    </ThemeProvider> 
  );
}

export default App;