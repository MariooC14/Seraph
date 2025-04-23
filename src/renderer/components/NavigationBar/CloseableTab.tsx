import { X } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface CloseableTabProps {
  name: string;
  id: string;
  isActive?: boolean;
  onClose?: () => void;
  onClick?: () => void;
}

export default function CloseableTab({ name, onClose, onClick, isActive = false}: CloseableTabProps) {
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose?.();
  };

  return (
    <div onClick={onClick} className={cn("nonDraggable pl-2.5 pr-0.5 rounded-2xl border-2 border-slate-2 min-w-32 space-x-4 flex items-center justify-between cursor-pointer", isActive && "bg-accent")} >
      <span>{name}</span>
      <Button
        onClick={handleClose}
        variant="ghost"
        size="icon"
        className="cursor-pointer h-6 w-6"
      >
        <X size="15" />
      </Button>
    </div>
  );
}
