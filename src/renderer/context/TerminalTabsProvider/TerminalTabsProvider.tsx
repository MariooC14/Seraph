import { Terminal } from "@xterm/xterm";
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import HostSelectionDialog from "./HostSelectionDialog";
import { TerminalService } from "@/service/TerminalService/TerminalService";
import { useConfig } from "../ConfigProvider";

export type TerminalSession = {
  id: string;
  terminal: Terminal;
}

export type TerminalTab = {
  id: string;
  name: string;
  session: TerminalSession;
  isActive: boolean;
}

type TerminalTabsContextValue = {
  tabs: TerminalTab[];
  createTab: (name: string) => Promise<TerminalTab>;
  closeTab: (id: string) => void;
  showHostSelectionDialog: () => void;
}

const TerminalTabsContext = createContext<TerminalTabsContextValue>({} as TerminalTabsContextValue);

export default function TerminalTabsProvider({ children }: { children: ReactNode }) {
  const { defaultShellPath } = useConfig();
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

  const closeTab = (id: string) => {
    setTabs(currentTabs => {
      const tabToClose = currentTabs.find((tab) => tab.id === id);
      if (!tabToClose) return currentTabs;

      window.terminal.terminateSession(tabToClose.session.id);
      tabToClose.session.terminal.dispose();

      return currentTabs.filter((tab) => tab.id !== id);
    })
  }

  const value: TerminalTabsContextValue = {
    tabs, closeTab,
    showHostSelectionDialog: () => setHostSelectionDialogVisible(true),
    createTab: async (name: string) => {
      console.log("Creating new terminal tab");
      const numExistingTabNames = tabs.filter((tab) => tab.name === name).length;
      if (numExistingTabNames > 0) {
        name = `${name} (${numExistingTabNames})`;
      }
      try {
        const session = await TerminalService.createTerminalSession(defaultShellPath);
        const newTab: TerminalTab = {
          id: session.id,
          isActive: false,
          name, session,
        };
        setTabs((prev) => ([...prev, newTab ]));
        return newTab;
      } catch (error) {
        console.error("Failed to create terminal session:", error);
        throw error;
      }
    },
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