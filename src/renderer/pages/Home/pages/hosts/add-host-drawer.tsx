import { useRef, useState } from 'react';
import { FormDrawer } from '@/components/ui/form-drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

type AddHostDrawerProps = Omit<React.ComponentProps<typeof FormDrawer>, 'onSubmit'> & {
  onSubmit: (host: { label: string; host: string; port: number; username: string }) => void;
};

export function AddHostDrawer(props: AddHostDrawerProps) {
  const [label, setLabel] = useState('');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('22');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // TODO: Handle private key validation through regex or other means
  const [privateKey, setPrivateKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const filePath = 'path' in file ? (file as any).path : file.name;
      setPrivateKey(filePath);
    }
  };

  const validateForm = () => {
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
  };

  const areRequiredFieldsMissing = (
    label: string,
    host: string,
    port: string,
    username: string
  ): boolean => {
    return !label || !host || !port || !username;
  };

  const isAuthenticationMissing = (password: string, privateKey: string): boolean => {
    return !password && !privateKey;
  };

  const isPortInvalid = (port: string): boolean => {
    const portNum = Number(port);
    return isNaN(portNum) || portNum < 1 || portNum > 65535;
  };

  const resetForm = () => {
    setLabel('');
    setHost('');
    setPort('22');
    setUsername('');
    setPassword('');
    setPrivateKey('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    props.onSubmit({ label, host, port: Number(port), username });
    resetForm();
    props.onOpenChange?.(false);
  };

  const { onSubmit: _, fadeFromIndex, ...drawerProps } = props;

  return (
    <FormDrawer
      {...drawerProps}
      title={props.title ?? 'Add Host'}
      description={props.description ?? 'Fill in the details for the new host you want to add.'}
      onSubmit={handleSubmit}>
      {error && (
        <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <Label htmlFor="label">Label</Label>
        <Input id="label" value={label} onChange={e => setLabel(e.target.value)} required />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="host">Host</Label>
        <Input id="host" value={host} onChange={e => setHost(e.target.value)} required />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="port">Port</Label>
        <Input
          id="port"
          type="number"
          value={port}
          onChange={e => setPort(e.target.value)}
          required
          min="1"
          max="65535"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Optional"
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="privateKey">Private Key</Label>
        <div className="flex gap-2">
          <Input
            id="privateKey"
            type="text"
            placeholder="Path to private key"
            value={privateKey}
            onChange={e => setPrivateKey(e.target.value)}
            className="flex-1"
          />
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Button type="button" onClick={() => fileInputRef.current?.click()} variant="outline">
            Browse
          </Button>
        </div>
      </div>
      <Button type="submit" className="w-full">
        Add Host
      </Button>
    </FormDrawer>
  );
}
