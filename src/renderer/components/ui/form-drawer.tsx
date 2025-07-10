import * as React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription
} from '@/components/ui/drawer';

type FormDrawerProps = React.ComponentProps<typeof Drawer> & {
  title?: string;
  description?: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

function FormDrawer({
  title = 'Form Drawer',
  description,
  onSubmit,
  children,
  ...props
}: FormDrawerProps) {
  return (
    <Drawer {...props}>
      <DrawerContent className="px-4">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <form onSubmit={onSubmit} className="space-y-4 p-4">
          {children}
        </form>
      </DrawerContent>
    </Drawer>
  );
}

export { FormDrawer };
