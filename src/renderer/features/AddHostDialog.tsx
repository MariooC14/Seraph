import { useRef, useState } from 'react';
import { FormDialog } from '@/components/ui/form-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

type AddHostDialogProps = Omit<React.ComponentProps<typeof FormDialog>, 'onSubmit'> & {
  onSubmit: (host: { label: string; host: string; port: number; username: string }) => void;
};

export function AddHostDialog(props: AddHostDialogProps) {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!label || !host || !port || !username) {
      setError('All fields are required.');
      return;
    }
    if (!password && !privateKey) {
      setError('Either password or private key is required.');
      return;
    }
    const portNum = Number(port);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      setError('Port must be a number between 1 and 65535.');
      return;
    }

    props.onSubmit({ label, host, port: Number(port), username });
    setLabel('');
    setHost('');
    setPort('22');
    setUsername('');
    setPassword('');
    setPrivateKey('');
    props.onOpenChange(false);
  };

  return (
    <FormDialog
      {...props}
      title={props.title ?? 'Add Host'}
      description={props.description ?? 'Fill in the details for the new host you want to add.'}
      onSubmit={handleSubmit}>
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
      <Button type="submit">Add Host</Button>
    </FormDialog>
  );
}
