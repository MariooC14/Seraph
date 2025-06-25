import { useState } from 'react';
import FormDialog, { FormDialogProps } from '@/components/ui/form-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

type AddHostDialogProps = Omit<FormDialogProps, 'onSubmit' | 'children'> & {
  onSubmit: (host: { label: string; host: string; port: number; username: string }) => void;
};

export function AddHostDialog(props: AddHostDialogProps) {
  const [label, setLabel] = useState('');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('22');
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onSubmit({ label, host, port: Number(port), username });
    setLabel('');
    setHost('');
    setPort('22');
    setUsername('');
    props.onOpenChange(false);
  };

  return (
    <FormDialog
      {...props}
      title={props.title ?? 'Add Host'}
      description={props.description ?? 'Fill in the details for the new host you want to add.'}
      onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="label">Label</Label>
        <Input id="label" value={label} onChange={e => setLabel(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="host">Host</Label>
        <Input id="host" value={host} onChange={e => setHost(e.target.value)} required />
      </div>
      <div>
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
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Add Host</Button>
    </FormDialog>
  );
}
