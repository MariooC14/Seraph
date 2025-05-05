import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

interface CloseableTabProps {
  name: string;
  id: string;
  isActive?: boolean;
  onClose?: () => void;
  onClick?: () => void;
}

export default function CloseableTab({
  name,
  onClose,
  onClick,
  isActive = false
}: CloseableTabProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose?.();
  };

  useEffect(() => {
    if (isActive) {
      elRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [isActive]);

  return (
    <TooltipProvider>
      <div
        ref={elRef}
        onClick={onClick}
        className={cn(
          'nonDraggable select-none pl-2.5 pr-0.5 rounded-xl border-2 border-slate-2 min-w-22 max-w-36 max-h-8 transition-[width,background-color] flex items-center justify-between cursor-pointer truncate hover:bg-secondary',
          isActive && 'bg-accent w-40'
        )}>
        <Tooltip delayDuration={1000}>
          <TooltipTrigger className="truncate">{name}</TooltipTrigger>
          <TooltipContent>{name}</TooltipContent>
        </Tooltip>
        <Tooltip delayDuration={1000}>
          <TooltipTrigger asChild>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="cursor-pointer h-6 w-6 ml-1">
              <X size="15" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Close</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
