import { cn } from '@/lib/utils';
import { TypographyProps } from './typography';

export function TypographyMuted({ className: className, children }: TypographyProps) {
  return <p className={cn('text-muted-foreground text-sm', className)}>{children}</p>;
}
