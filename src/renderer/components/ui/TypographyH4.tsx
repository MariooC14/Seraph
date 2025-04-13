import { cn } from "@/lib/utils";
import { TypographyProps } from "./typography";

export function TypographyH4({ children, className, gutterBottom = false }: TypographyProps) {
  return (
    <h4 className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className, gutterBottom && "mb-2")}>
      {children}
    </h4>
  )
}
