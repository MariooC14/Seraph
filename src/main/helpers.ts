import { exec } from "child_process";
import fs from "fs";
import path from "path";

const commonWindowShells = [
  { name: "PowerShell", path: "powershell.exe" },
  { name: "PowerShell Core", path: "pwsh.exe" },
  { name: "Command Prompt", path: "cmd.exe" },
  { name: "Git Bash", path: "C:\\Program Files\\Git\\bin\\bash.exe" },
  { name: "Windows Subsystem for Linux (WSL)", path: "wsl.exe" },
];

export async function getAvailableShells(platform: NodeJS.Platform) {
  if (platform === "win32") {
    return await getAvailableShellsForWindows();
  } else {
    return await getAvailableShellsForUnix();
  }
}

async function getAvailableShellsForUnix() {
  try {
    const { stdout } = await new Promise<{ stdout: string; stderr: string }>(
      (resolve, reject) => {
        exec("cat /etc/shells", (error, stdout, stderr) => {
          if (error) {
            reject(error);
            return;
          }
          resolve({ stdout, stderr });
        });
      }
    );

    return stdout
      .split("\n")
      .filter(Boolean)
      .filter((line) => !line.trim().startsWith("#"))
      .map((line) => line.trim());
  } catch (error) {
    console.error("Failed to get available shells:", error);
    return [];
  }
}

async function getAvailableShellsForWindows() {
  const availableShells: string[] = [];
  for (const shell of commonWindowShells) {
    try {
      // Use 'where' command to check if the executable is in PATH
      await new Promise<void>((resolve) => {
        exec(`where ${path.basename(shell.path)}`, (error) => {
          if (!error) {
            availableShells.push(shell.path);
          }
          resolve();
        });
      });
    } catch {
      // Shell not found in PATH, try alternative location check
      if (shell.path.includes(":\\") && fs.existsSync(shell.path)) {
        availableShells.push(shell.path);
      }
    }
  }
  return availableShells;
}
