import { useEffect, useRef } from "react";
import { Terminal, } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import "xterm/css/xterm.css";

interface TerminalWindowProps {
  connection: any; // SSH connection instance
}

function TerminalWindow({ connection }: TerminalWindowProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstance = useRef<Terminal | null>(null);

  useEffect(() => {
    if (!terminalRef.current || !connection) return;

    // Initialize terminal
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: "#1a1b1e",
        foreground: "#f8f9fa",
        cursor: "#f8f9fa",
        selectionForeground: "rgba(248, 249, 250, 0.3)",
        black: "#1a1b1e",
        red: "#e03131",
        green: "#2f9e44",
        yellow: "#f08c00",
        blue: "#1971c2",
        magenta: "#9c36b5",
        cyan: "#0c8599",
        white: "#f8f9fa",
        brightBlack: "#495057",
        brightRed: "#ff6b6b",
        brightGreen: "#51cf66",
        brightYellow: "#fcc419",
        brightBlue: "#339af0",
        brightMagenta: "#cc5de8",
        brightCyan: "#22b8cf",
        brightWhite: "#ffffff",
      },
      allowTransparency: true,
      scrollback: 10000,
      rows: 24,
    });

    // Add addons
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);

    // Open terminal
    term.open(terminalRef.current);
    fitAddon.fit();

    // Handle terminal input
    term.onData((data) => {
      if (connection.shell) {
        connection.shell.write(data);
      }
    });

    // Handle terminal output
    if (connection.shell) {
      connection.shell.on("data", (data: Buffer) => {
        term.write(data.toString());
      });
    }

    // Handle window resize
    const handleResize = () => {
      fitAddon.fit();
      const dimensions = fitAddon.proposeDimensions();
      if (dimensions && connection.shell) {
        connection.shell.setWindow(dimensions.rows, dimensions.cols);
      }
    };

    window.addEventListener("resize", handleResize);

    // Store terminal instance
    terminalInstance.current = term;

    // Initial resize
    setTimeout(() => {
      handleResize();
    }, 100);

    return () => {
      term.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [connection]);

  return (
    <div
      ref={terminalRef}
      className="h-full w-full bg-[#1a1b1e] rounded-lg overflow-hidden"
    />
  );
}

export default TerminalWindow;