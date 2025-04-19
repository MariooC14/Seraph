import { cn } from "@/lib/utils";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { Terminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";

type TerminalViewProps = {
  sessionId: string;
  terminal: Terminal;
  visible: boolean;
}

export default function TerminalView({ visible, sessionId, terminal }: TerminalViewProps) {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Terminal for", sessionId, "mounted");
    terminal.open(terminalRef.current);

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    terminal.loadAddon(fitAddon);
    terminal.loadAddon(webLinksAddon);

    // Write to terminal
    terminal.onData((data) => {
      const event = {
        newData: data,
        sessionId,
      }
      window.terminal.sendData(event);
    });

    // Read from terminal
    window.terminal.onData((data) => {
      if (data.sessionId !== sessionId) return;

      console.log("Received data from terminal:", data);
      terminal.write(data.newData);
    })

    const handleResize = () => {
      fitAddon.fit(); // todo? could debounce this
    }

    window.addEventListener('resize', handleResize)

    setTimeout(() => {
      fitAddon.fit();
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
