import { cn } from "@/lib/utils";
import { TypographyProps } from "./typography";

export function TypographyH1({children, className, gutterBottom = false }: TypographyProps) {
  return (
    <h1 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className, gutterBottom && "mb-2")}>
      {children}
    </h1>
  )
}