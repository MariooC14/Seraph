import { cn } from "@/lib/utils"
import { TypographyProps } from "./typography"

export function TypographyP({ children, className, gutterBottom = false }: TypographyProps) {
  return (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className, gutterBottom && "mb-2")}>
      {children}
    </p>
  )
}