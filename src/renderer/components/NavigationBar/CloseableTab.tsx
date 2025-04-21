import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useTerminalTabs } from "@/context/TerminalTabsProvider";
import { cn } from "@/lib/utils";
import { Link, useParams } from "react-router";

interface CloseableTabProps {
  name: string;
  id: string;
}

export default function CloseableTab({ name, id }: CloseableTabProps) {
  const { closeTab } = useTerminalTabs();
  const { terminalId } = useParams();

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    closeTab(id);
  };

  const isActive = terminalId === id;

  return (
    <Link to={`/terminals/${id}`} className={cn("nonDraggable pl-2.5 pr-0.5 rounded-2xl border-2 border-slate-2 min-w-32 space-x-4 flex items-center justify-between cursor-pointer", isActive && "bg-accent")} >
      <span>{name}</span>
      <Button
        onClick={handleClose}
        variant="ghost"
        size="icon"
        className="cursor-pointer h-6 w-6"
      >
        <X size="15" />
      </Button>
    </Link>
  );
}
