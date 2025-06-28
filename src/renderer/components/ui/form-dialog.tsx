import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

function FormDialog({
  title = 'Form Dialog',
  description,
  onSubmit,
  children,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { FormDialog };
