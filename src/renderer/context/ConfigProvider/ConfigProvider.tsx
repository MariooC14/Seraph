import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

type ConfigContextType = {
  defaultShellPath: string;
  updateDefaultShellPath: (path: string) => void;
  availableShells?: string[];
};

const ConfigContext = createContext<ConfigContextType>({} as ConfigContextType);

export default function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [defaultShellPath, setDefaultShellPath] = useState("");
  const [availableShells, setAvailableShells] = useState<string[]>();

  useEffect(() => {
    window.terminal.getUserPreferredShell().then((shellPath: string) => {
      console.log("shellPath", shellPath);
      setDefaultShellPath(shellPath);
    });
    window.terminal.getAvailableShells().then((shells: string[]) => {
      setAvailableShells(shells);
    });
  }, []);

  function updateDefaultShellPath(newShellPath: string) {
    const prevPath = defaultShellPath;
    setDefaultShellPath(newShellPath);
    window.terminal.saveDefaultShell(newShellPath).then((success) => {
      if (success) {
        toast.success("Default shell path saved successfully!");
      } else {
        toast.error("Failed to save default shell path!");
        setDefaultShellPath(prevPath);
      }
    });
  }

  const value = {
    defaultShellPath, 
    updateDefaultShellPath,
    availableShells,
  }
  
  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  )
};

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    console.warn("useConfig must be used within a ConfigProvider");
  }
  return context;
}
