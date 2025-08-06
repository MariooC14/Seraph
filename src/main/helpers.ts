import log from 'electron-log/main';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const commonWindowShells = [
  { name: 'PowerShell', path: 'powershell.exe' },
  { name: 'PowerShell Core', path: 'pwsh.exe' },
  { name: 'Command Prompt', path: 'cmd.exe' },
  {
    name: 'Git Bash',
    path: 'C:\\Program Files\\Git\\bin\\bash.exe'
  },
  {
    name: 'Windows Subsystem for Linux (WSL)',
    path: 'wsl.exe'
  }
];

export function isWindows() {
  return process.platform === 'win32';
}

export async function getAvailableShells() {
  if (isWindows()) {
    return await getAvailableShellsForWindows();
  } else {
    return await getAvailableShellsForUnix();
  }
}

async function getAvailableShellsForUnix() {
  try {
    const { stdout } = await new Promise<{
      stdout: string;
      stderr: string;
    }>((resolve, reject) => {
      exec('cat /etc/shells', (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({ stdout, stderr });
      });
    });

    return stdout
      .split('\n')
      .filter(Boolean)
      .filter(line => !line.trim().startsWith('#'))
      .map(line => line.trim());
  } catch (error) {
    log.error('Failed to get available shells:', error);
    return [];
  }
}

async function getAvailableShellsForWindows() {
  const availableShells: string[] = [];
  for (const shell of commonWindowShells) {
    try {
      // Use 'where' command to check if the executable is in PATH
      await new Promise<void>(resolve => {
        exec(`where ${path.basename(shell.path)}`, error => {
          if (!error) {
            availableShells.push(shell.path);
          }
          resolve();
        });
      });
    } catch {
      // Shell not found in PATH, try alternative location check
      if (shell.path.includes(':\\') && fs.existsSync(shell.path)) {
        availableShells.push(shell.path);
      }
    }
  }
  return availableShells;
}

// Decorator function that wraps the return value of a method into an IPCResponse
// Similar in spirit to spring rest controllers but for IPC
export function IPCResponse<SuccessType, ErrorType = void>() {
  return function (_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]): IPCPromise<SuccessType, ErrorType> {
      try {
        const result = await originalMethod.apply(this, args);
        return { success: true, data: result };
      } catch (error) {
        log.error('IPC Response Error:', error);
        return {
          success: false,
          code: error.code,
          message: error.message,
          details: error.details as ErrorType
        };
      }
    };

    return descriptor;
  };
}

// IPC cannot directly pass errors from main to renderer.
// Our workaround is to create an error object that has a details field
// and put your custom error messages there.
export class IPCError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'IPCError';
  }
}
