import { useAppDispatch } from '@/app/hooks';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup
} from '@/components/ui/command';
import { createTab } from '@/features/terminalTabs/terminalTabsSlice';
import { CirclePlus, Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';

type HostSelectionDialogProps = {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
};

export default function HostSelectionDialog({ open, handleOpenChange }: HostSelectionDialogProps) {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState('');

  useEffect(() => {
    if (open) setValue('');
  }, [open]);

  const handleLocalTerminalClick = () => {
    dispatch(createTab({ name: 'Localhost' }));
    handleOpenChange(false);
  };

  return (
    <CommandDialog
      open={open}
      title="Choose a host"
      description="Choose one of your hosts below to connect to"
      onOpenChange={handleOpenChange}>
      <CommandInput
        placeholder="Search hosts..."
        value={value}
        onValueChange={newValue => setValue(newValue)}
      />
      <CommandEmpty>
        <span className="text-lg">No hosts found.</span>
        <Button variant="outline" className="ml-2">
          Add host
        </Button>
      </CommandEmpty>
      <CommandList>
        <CommandGroup heading="Hosts">
          {/* Hosts from config */}
          <CommandItem>Lunar</CommandItem>
          <CommandItem>Solar</CommandItem>
        </CommandGroup>
        <CommandGroup heading="Quick Actions">
          <CommandItem>
            <CirclePlus />
            <span>
              Create host <strong>{value}</strong>
            </span>
          </CommandItem>
          <CommandItem onSelect={handleLocalTerminalClick}>
            <Terminal />
            Local Terminal
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
