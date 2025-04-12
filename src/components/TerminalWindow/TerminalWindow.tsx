import { useEffect, useRef } from "react";
import { Terminal, } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "@xterm/xterm/css/xterm.css";
import { defaultTerminalOptions } from "./terminalConfig";

function TerminalWindow() {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.terminal.spawnTerminal();
    const term = new Terminal(defaultTerminalOptions);

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);

    term.open(terminalRef.current);
    fitAddon.fit();

    // Write to terminal
    term.onData((data) => {
      window.terminal.sendData(data);
    });

    // Read from terminal
    window.terminal.onData(data => {
      term.write(data);
    })

    const handleResize = () => {
      fitAddon.fit(); // todo? could debounce this
    }

    term.onResize(() => {
        const dimensions = fitAddon.proposeDimensions();
        console.log(dimensions);
        term.resize(dimensions.cols, dimensions.rows);
    })

    window.addEventListener('resize', handleResize)

    return () => {
      term.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={terminalRef}
      className="bg-[#1a1b1e] p-0 min-h-96"
    />
  );
}

export default TerminalWindow;