import { X } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface CloseableTabProps {
  name: string;
}

export default function CloseableTab({ name }: CloseableTabProps) {
  const handleClose = (event: React.MouseEvent) => {
    event.preventDefault();
    toast.warning(`Close ${name} tab not implemented yet`);
  };

  return (
    <div className="nonDraggable pl-2.5 pr-0.5 rounded-2xl border-2 border-slate-2 min-w-32 space-x-4 flex items-center justify-between cursor-pointer">
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
