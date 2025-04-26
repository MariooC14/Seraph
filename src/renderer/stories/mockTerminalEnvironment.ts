/**
 * Creates a simple mock terminal environment for Storybook
 */
function createSimpleMockTerminal() {
  // Command input buffer
  let inputBuffer = "";

  // Simple command processor
  const processCommand = (command: string) => {
    if (command.trim() === "") return "";

    if (command.trim() === "clear") {
      return "\x1Bc"; // ANSI clear screen
    }

    if (command.trim() === "hello") {
      return "Hello, Storybook!\r\n";
    }

    if (command.trim() === "help") {
      return (
        "Available commands:\r\n" +
        "  hello    - Get a greeting\r\n" +
        "  help     - Show this help\r\n" +
        "  ls       - List files\r\n" +
        "  clear    - Clear screen\r\n" +
        "  whoami   - Show user info\r\n"
      );
    }

    if (command.trim() === "ls") {
      return "file1.txt  file2.js  directory1/  homework/\r\n";
    }

    if (command.trim() === "whoami") {
      return "You are a bitch!\r\n";
    }

    return `Command not found: ${command}\r\n`;
  };

  return {
    onData: (_sessionId: string, callback: (data: string) => void) => {
      // Send initial terminal prompt
      setTimeout(() => {
        callback("\r\nMock Terminal\r\n$ ");
      }, 100);

      // Set up the input listener
      const listener = (event: Event) => {
        const { detail } = event as CustomEvent<string>;

        // Handle special keys
        if (detail === "\r") {
          // Enter key
          // Process the command
          const output = processCommand(inputBuffer);
          callback("\r\n" + output + "$ ");
          inputBuffer = "";
        } else if (detail === "\x7F" || detail === "\b") {
          // Backspace
          if (inputBuffer.length > 0) {
            inputBuffer = inputBuffer.slice(0, -1);
            callback("\b \b"); // Move back, clear, move back
          }
        } else {
          // Regular character - echo it
          inputBuffer += detail;
          callback(detail);
        }
      };

      window.addEventListener("mockTermSessionData", listener);
    },

    sendData: (_sessionId: string, data: string) => {
      console.log("User input:", data);
      window.dispatchEvent(
        new CustomEvent("mockTermSessionData", {
          detail: data,
        })
      );
    },

    // Simple stubs for required methods
    onResize: () => ({}),
    onTitleChange: () => ({}),
    onSessionTerminated: () => ({}),
    resizeTerminal: () => ({}),
  };
}

export default createSimpleMockTerminal;
