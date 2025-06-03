import { cn } from '@/lib/utils';
import { TypographyProps } from './typography';

export function TypographyLarge({ className, children }: TypographyProps) {
  return <div className={cn('text-lg font-semibold', className)}>{children}</div>;
}
