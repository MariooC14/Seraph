import { cn } from '@/lib/utils';

type StatusIndicatorProps = {
  color: 'green' | 'amber' | 'red' | 'gray';
  className?: string;
};

const colorClasses = {
  green: 'bg-green-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  gray: 'bg-gray-500'
};

export default function StatusIndicator({ color, className }: StatusIndicatorProps) {
  return <div className={cn('h-2 w-2 rounded-full', colorClasses[color], className)}></div>;
}
