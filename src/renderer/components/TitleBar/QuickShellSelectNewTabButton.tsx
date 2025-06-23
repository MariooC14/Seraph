import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router';
import { formatShellName } from '@/lib/utils';
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { createTab, TerminalTab } from '@/features/terminalTabs/terminalTabsSlice';
import { selectAvailableShells } from '@/features/config/configSlice';

export default function QuickShellSelectNewTabTutton() {
  const dispatch = useAppDispatch();
  const availableShells = useAppSelector(selectAvailableShells);
  const navigate = useNavigate();

  const handleNewTabClick = (tabName: string, shellPath: string) => {
    dispatch(createTab({ shellPath, name: tabName, type: 'local' })).then(action => {
      if (action.meta.requestStatus === 'fulfilled') {
        const tab = action.payload as TerminalTab;
        navigate(`/terminals/${tab.id}`);
      }
    });
  };

  const shellOptions = availableShells?.map(shell => {
    const formattedName = formatShellName(shell);

    return (
      <DropdownMenuItem
        key={shell}
        className="p-2 hover:bg-gray-200 cursor-pointer"
        onClick={() => handleNewTabClick(formattedName, shell)}>
        {formatShellName(shell)}
      </DropdownMenuItem>
    );
  });

  return (
    <div className="nonDraggable">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="cursor-pointer rounded-s-none size-7 w-6">
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="shadow-lg rounded-md p-2">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Local Shells
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {shellOptions}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
