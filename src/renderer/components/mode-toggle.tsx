import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Command, CommandGroup, CommandItem, CommandList } from "./ui/command"

const themeOptions: Theme[] = ["light", "dark", "system"];

export function ModeToggle() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between capitalize"
          >
          {theme}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[200px]">
        <Command>
          <CommandList>
            <CommandGroup>
              {themeOptions.map((themeOption) => (
                <CommandItem
                key={themeOption}
                value={themeOption}
                className="capitalize"
                onSelect={(themeOption: Theme) => {
                  setTheme(themeOption)
                  setOpen(false)
                }}
                >
                  {themeOption}
                  <Check
                    className={cn(
                      "ml-auto",
                      themeOption === theme ? "opacity-100" : "opacity-0"
                    )}
                    />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
