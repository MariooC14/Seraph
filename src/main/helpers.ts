import log from 'electron-log/main';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { SSHHostConfig } from '@/dts/host-config';
import { homedir } from 'os';

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

export async function getAvailableShells(platform: NodeJS.Platform) {
  if (platform === 'win32') {
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

export async function getHostsFromConfig(platform: NodeJS.Platform): Promise<SSHHostConfig[]> {
  const hosts: SSHHostConfig[] = [];
  try {
    if (platform === 'win32') {
      const configPaths = [
        path.join(homedir(), '.ssh', 'config'), // User config
        path.join(process.env.PROGRAMDATA || 'C:\\ProgramData', 'ssh', 'ssh_config'), // System config
        path.join(process.env.WINDIR || 'C:\\Windows', 'System32', 'OpenSSH', 'ssh_config') // Alternative system config
      ];

      for (const configPath of configPaths) {
        const windowsHosts = await parseSSHConfig(configPath);
        hosts.push(...windowsHosts);
      }
    } else {
      const configPaths = [
        path.join(homedir(), '.ssh', 'config'), // User config
        '/etc/ssh/ssh_config' // System config
      ];

      for (const configPath of configPaths) {
        const unixHosts = await parseSSHConfig(configPath);
        hosts.push(...unixHosts);
      }
    }
  } catch (error) {
    log.error('Failed to read SSH config:', error);
  }
  return hosts;
}

async function parseSSHConfig(filePath: string): Promise<SSHHostConfig[]> {
  const hosts: SSHHostConfig[] = [];
  let content = '';
  if (fs.existsSync(filePath)) {
    try {
      content = fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      log.error(`Failed to read SSH config from ${filePath}:`, error);
    }
  }
  const lines = content.split('\n');
  let currentHost: Partial<SSHHostConfig> | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Split the line into key and value parts (e.g., "Host myserver")
    const [key, ...valueParts] = trimmed.split(/\s+/);
    const value = valueParts.join('');

    // If key is 'host', store to array or proceed to next
    // Hosts that have wildcard '*' will be skipped
    if (key.toLowerCase() === 'host') {
      // Save host if it exists and is not a wildcard
      if (currentHost && currentHost.host && !currentHost.host.includes('*')) {
        hosts.push({
          host: currentHost.host,
          hostname: currentHost.hostname,
          user: currentHost.user,
          port: currentHost.port,
          identityFile: currentHost.identityFile,
          configPath: filePath
        });
      }

      if (!value.includes('*')) {
        currentHost = {
          host: value,
          configPath: filePath
        };
      } else {
        currentHost = null;
      }
    } else if (currentHost) {
      // Parse host options
      switch (key.toLowerCase()) {
        case 'hostname':
          currentHost.hostname = value;
          break;
        case 'user':
          currentHost.user = value;
          break;
        case 'port':
          const portNum = parseInt(value, 10);
          if (!isNaN(portNum)) {
            currentHost.port = portNum;
          }
          break;
        case 'identityfile':
          // Handle ~ expansion for both Windows and Unix
          let identityPath = value;
          if (identityPath.startsWith('~')) {
            identityPath = identityPath.replace('~', homedir());
          }
          // Convert Unix paths to Windows paths if needed
          if (process.platform === 'win32') {
            identityPath = identityPath.replace(/\//g, '\\');
          }
          currentHost.identityFile = identityPath;
          break;
      }
    }
  }

  if (currentHost && currentHost.host && !currentHost.host.includes('*')) {
    hosts.push({
      host: currentHost.host,
      hostname: currentHost.hostname,
      user: currentHost.user,
      port: currentHost.port,
      identityFile: currentHost.identityFile,
      configPath: filePath
    });
  }

  return hosts;
}
