import { useTerminalTabs } from "@/context/TerminalTabsProvider";
import { cn } from "@/lib/utils";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { Terminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

type TerminalViewProps = {
  sessionId: string;
  terminal: Terminal;
  visible: boolean;
}

export default function TerminalView({ visible, sessionId, terminal }: TerminalViewProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const { closeTab } = useTerminalTabs();

  useEffect(() => {
    console.log("Terminal for", sessionId, "mounted");
    terminal.open(terminalRef.current);

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    terminal.loadAddon(fitAddon);
    terminal.loadAddon(webLinksAddon);

    // Write to terminal
    terminal.onData((data) => {
      window.terminal.sendData(sessionId, data);
    });

    // Read from terminal
    window.terminal.onData(sessionId, (newData: string) => {
      console.log(`Received data from terminal with sessionId ${sessionId}`, newData);
      terminal.write(newData);
    })

    window.terminal.onSessionTerminated(sessionId, (code) => {
      toast.info(`Terminal session ended with code ${code}`);
      closeTab(sessionId);
    });

    const handleResize = () => {
      fitAddon.fit(); // todo? could debounce this
      const { rows, cols } = fitAddon.proposeDimensions();
      window.terminal.resizeTerminal(sessionId, cols, rows);
    }

    window.addEventListener('resize', handleResize)

    setTimeout(() => {
      handleResize();
    }, 50); // Wait for the terminal to be mounted

    return () => {
      console.log("TerminalTab unmounted", sessionId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={cn("p-4 h-full w-full bg-background", !visible && "hidden")}>
      <div ref={terminalRef} className="h-full w-full bg-background rounded-2xl" />
    </div>
  );
};
