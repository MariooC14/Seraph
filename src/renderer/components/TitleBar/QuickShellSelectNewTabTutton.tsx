import { useTerminalTabs } from "@/context/TerminalTabsProvider";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuGroup, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useConfig } from "@/context/ConfigProvider";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { formatShellName } from "@/lib/utils";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";


export default function QuickShellSelectNewTabTutton() {
  const { createTab } = useTerminalTabs();
  const { availableShells } = useConfig();
  const navigate = useNavigate();

  const handleNewTabClick = (shell: string) => {
    createTab(shell, shell).then((tab) => {
      navigate(`/terminals/${tab.id}`);
    });
  }

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
            <DropdownMenuLabel className="text-xs text-muted-foreground">Local Shells</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableShells?.map(shell => (
              <DropdownMenuItem key={shell} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleNewTabClick(shell)}>
                {formatShellName(shell)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
};
