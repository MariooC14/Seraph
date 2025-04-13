import { cn } from "@/lib/utils";
import { TypographyProps } from "./typography";

export function TypographyH3({ children, className, gutterBottom = false }: TypographyProps) {
  return (
    <h3 className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className, gutterBottom && "mb-2")}>
      {children}
    </h3>
  );
}
