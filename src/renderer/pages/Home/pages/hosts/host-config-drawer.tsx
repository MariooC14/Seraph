import { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { HostFormData, hostFormSchema } from '@/lib/host-validation';
import { HostConfig } from '@dts/host-config';

const defaultFormValues = {
  label: '',
  host: '',
  port: 22,
  username: '',
  password: '',
  privateKey: ''
};

type HostConfigDrawerMode = 'add' | 'edit';

type HostConfigDrawerProps = React.ComponentProps<typeof Drawer> & {
  mode: HostConfigDrawerMode;
  onSubmit: (host: HostFormData) => void;
  onUpdate: (hostConfig: HostConfig) => void;
  onDelete: (hostConfig: HostConfig) => void;
  hostConfig?: HostConfig;
  title?: string;
};

export function HostConfigDrawer({
  mode,
  onSubmit,
  onUpdate,
  onDelete,
  hostConfig,
  title,
  open,
  onOpenChange,
  ...drawerProps
}: HostConfigDrawerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({ resolver: zodResolver(hostFormSchema), defaultValues: defaultFormValues });

  const {
    register,
    formState: { errors }
  } = form;

  useEffect(() => {
    if (mode === 'edit' && hostConfig) {
      form.setValue('label', hostConfig.label);
      form.setValue('host', hostConfig.host);
      form.setValue('port', hostConfig.port);
      form.setValue('username', hostConfig.username);
      form.setValue('password', '');
      form.setValue('privateKey', '');
    } else if (mode === 'add') {
      form.reset();
    }
  }, [mode, hostConfig, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const filePath = 'path' in file ? file.path : file.name;
      form.setValue('privateKey', filePath as string);
    }
  };

  const onFormSubmit = (data: HostFormData) => {
    const isAddMode = mode === 'add';
    const isEditMode = mode === 'edit';
    const canUpdate = isEditMode && hostConfig;

    if (isAddMode) {
      onSubmit(data);
      form.reset();
    } else if (canUpdate) {
      const updatedHostConfig: HostConfig = {
        ...hostConfig,
        ...data
      };
      onUpdate(updatedHostConfig);
    }

    onOpenChange(false);
  };

  const handleDelete = () => {
    const canDelete = mode === 'edit' && hostConfig;

    if (canDelete) {
      onDelete(hostConfig);
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const getTitle = () => {
    if (title) return title;
    return mode === 'add' ? 'Add Host' : `Edit ${hostConfig?.label || 'Host'}`;
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} {...drawerProps}>
      <DrawerContent className="px-4">
        <DrawerHeader>
          <DrawerTitle>{getTitle()}</DrawerTitle>
        </DrawerHeader>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4 p-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="label">Label</Label>
            <Input id="label" {...register('label')} placeholder="Label" />
            {errors.label && <span className="text-red-500 text-sm">{errors.label.message}</span>}
          </div>

          <div className="flex items-end gap-1">
            <div className="flex flex-col gap-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" {...register('username')} placeholder="me" />
            </div>
            <span className="my-2 mx-1">@</span>
            <div className="flex flex-col flex-1 gap-1">
              <Label htmlFor="host">Host</Label>
              <Input id="host" {...register('host')} placeholder="192.168.1.2" />
            </div>
            <span className="my-2 mx-1">:</span>
            <div className="flex flex-col gap-1">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                type="number"
                {...register('port', { valueAsNumber: true })}
                placeholder="22"
              />
            </div>
          </div>

          {/* Error messages for the connection string fields */}
          <div className="flex gap-1">
            <div className="flex flex-col gap-1">
              {errors.username && (
                <span className="text-red-500 text-sm">{errors.username.message}</span>
              )}
            </div>
            <div className="w-6"></div> {/* Spacer for @ symbol */}
            <div className="flex flex-col flex-1 gap-1">
              {errors.host && <span className="text-red-500 text-sm">{errors.host.message}</span>}
            </div>
            <div className="w-6"></div> {/* Spacer for : symbol */}
            <div className="flex flex-col gap-1">
              {errors.port && <span className="text-red-500 text-sm">{errors.port.message}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register('password')} placeholder="Password" />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="privateKey">Private Key</Label>
            <div className="flex gap-2">
              <Input
                id="privateKey"
                type="text"
                {...register('privateKey')}
                placeholder="Path to private key file"
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
        </form>

        <DrawerFooter>
          <div className="flex gap-2 w-full">
            <Button onClick={form.handleSubmit(onFormSubmit)} className="flex-1">
              {mode === 'add' ? 'Add Host' : 'Update Host'}
            </Button>
            {mode === 'edit' && (
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            )}
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
