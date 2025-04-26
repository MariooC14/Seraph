import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Map of known shell executables to friendly names
const shellMappings: Record<string, string> = {
  "powershell.exe": "PowerShell",
  "cmd.exe": "Command Prompt",
  "bash.exe": "Git Bash",
  "wsl.exe": "WSL",
  "pwsh.exe": "PowerShell Core",
  zsh: "Z Shell",
  fish: "Fish Shell",
  sh: "Shell",
};

/**
 * Transforms shell paths into user-friendly display names
 * @param shellPath The full path to the shell executable
 * @returns A formatted display name for the shell
 */
export function formatShellName(shellPath: string): string {
  // Extract just the filename from the path
  const fileName = shellPath.split(/[/\\]/).pop() || shellPath;

  // Get the friendly name or capitalize the first letter if not in mappings
  const friendlyName =
    shellMappings[fileName.toLowerCase()] ||
    fileName
      .replace(/\.exe$/i, "")
      .charAt(0)
      .toUpperCase() + fileName.replace(/\.exe$/i, "").slice(1);

  // For WSL, try to extract the distribution name
  if (fileName.toLowerCase() === "wsl.exe" && shellPath.includes("-d")) {
    const distMatch = shellPath.match(/-d\s+([^\s]+)/);
    if (distMatch && distMatch[1]) {
      return `WSL (${distMatch[1]})`;
    }
  }

  // For paths with special info, add it as a detail
  if (shellPath.includes("Program Files") && !friendlyName.includes("Git")) {
    return `${friendlyName} (System)`;
  }

  return friendlyName;
}
export function isNewTabKey(e: KeyboardEvent) {
  // Can also check for ctrl/cmd K
  return e.key === "t" && (e.metaKey || e.ctrlKey);
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function debounce(fn: Function, ms = 300) {
  let timeoutId: ReturnType<typeof setTimeout>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}
