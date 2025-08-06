import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';

type SpinnerProps = {
  className?: string;
  size?: number;
};

export function Spinner({ className, size = 24 }: SpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Loader className="animate-spin text-gray-500" size={size} />
    </div>
  );
}
