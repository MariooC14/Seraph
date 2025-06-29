export interface HostFormData {
  label: string;
  host: string;
  port: string;
  username: string;
  password: string;
  privateKey: string;
}
function areRequiredFieldsMissing(
  label: string,
  host: string,
  port: string,
  username: string
): boolean {
  return !label || !host || !port || !username;
}
function isAuthenticationMissing(password: string, privateKey: string): boolean {
  return !password && !privateKey;
}
function isPortInvalid(port: string): boolean {
  const portNum = Number(port);
  return isNaN(portNum) || portNum < 1 || portNum > 65535;
}

export function validateHostForm(formData: HostFormData): string | null {
  const { label, host, port, username, password, privateKey } = formData;

  if (areRequiredFieldsMissing(label, host, port, username)) {
    return 'All fields are required.';
  }

  if (isAuthenticationMissing(password, privateKey)) {
    return 'Either password or private key is required.';
  }

  if (isPortInvalid(port)) {
    return 'Port must be a number between 1 and 65535.';
  }

  return null;
}
