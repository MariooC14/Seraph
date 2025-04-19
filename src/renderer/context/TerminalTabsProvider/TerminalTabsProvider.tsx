import { Terminal } from "@xterm/xterm";
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid";
import HostSelectionDialog from "./HostSelectionDialog";

type TerminalTab = {
  id: string;
  name: string;
  terminal?: Terminal;
  isActive: boolean;
}

type TerminalTabsContextValue = {
  tabs: TerminalTab[];
  createTab: () => void;
  closeTab: (id: string) => void;
  showHostSelectionDialog: () => void;
}

const TerminalTabsContext = createContext<TerminalTabsContextValue>({} as TerminalTabsContextValue);

export default function TerminalTabsProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<TerminalTab[]>([]);
  const [hostSelectionDialogVisible, setHostSelectionDialogVisible] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (isNewTabKey(e)) {
        e.preventDefault()
        setHostSelectionDialogVisible(prev => !prev);
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleHostSelectionDialogOpenChange = (open: boolean) => {
    setHostSelectionDialogVisible(open);
  };

  const value: TerminalTabsContextValue = {
    tabs,
    showHostSelectionDialog: () => setHostSelectionDialogVisible(true),
    createTab: () => {
      setHostSelectionDialogVisible(true);
      const id = uuidv4();
      const newTab: TerminalTab = {
        id,
        name: `New Tab`,
        isActive: true,
      };
      setTabs((prev) => ({ ...prev, [id]: newTab })); 
    },
    closeTab: (id: string) => {
      const tabToClose = tabs.find((tab) => tab.id === id);
      // cleanup terminal 
      tabToClose.terminal?.dispose();
      setTabs((prev) => prev.filter((tab) => tab.id !== id));
    }
  }

  return (
    <TerminalTabsContext.Provider value={value}>
      <HostSelectionDialog open={hostSelectionDialogVisible} handleOpenChange={handleHostSelectionDialogOpenChange} />
      {children}
    </TerminalTabsContext.Provider>
  )
};


export function useTerminalTabs() {
  const context = useContext(TerminalTabsContext);
  if (!context) {
    console.warn("useTerminalTabs must be used within a TerminalTabsProvider");
  }
  return context;
}

function isNewTabKey(e: KeyboardEvent) {
  // Can also check for ctrl/cmd K
  return e.key === "t" && (e.metaKey || e.ctrlKey);
}