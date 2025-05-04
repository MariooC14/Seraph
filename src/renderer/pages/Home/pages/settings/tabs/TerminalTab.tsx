import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TabsContent } from "@/components/ui/tabs";

import { TypographyH4 } from "@/components/ui/TypographyH4";
import { cn } from "@/lib/utils";
import { Command, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { useState } from "react";
import { selectAvailableShells, selectPreferredShellPath, updatePreferredShellPath } from "@/features/config/configSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

export default function TerminalTab() {
  return (
    <TabsContent value="terminal">
      <Card>
        <CardHeader>
          <CardTitle>Terminal Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <TypographyH4 gutterBottom>Default Shell Path</TypographyH4>
          <ShellSelectionSection />
        </CardContent>
      </Card>
    </TabsContent>
  )
}

function ShellSelectionSection() {
  const availableShells = useAppSelector(selectAvailableShells);
  const preferredShellPath = useAppSelector(selectPreferredShellPath);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[400px] justify-between"
        >
          {preferredShellPath}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[400px]">
        <Command>
          <CommandList>
            <CommandEmpty>No shells found.</CommandEmpty>
            <CommandGroup>
              {availableShells === undefined && <CommandItem>Loading...</CommandItem>}
              {availableShells.map((shell) => (
                <CommandItem
                  key={shell}
                  value={shell}
                  onSelect={(shell) => {
                    dispatch(updatePreferredShellPath(shell));
                    setOpen(false)
                  }}
                >
                  {shell}
                  <Check
                    className={cn(
                      "ml-auto",
                      shell === preferredShellPath ? "opacity-100" : "opacity-0"
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