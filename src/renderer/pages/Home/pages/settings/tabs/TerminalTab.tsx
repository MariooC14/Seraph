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
import { toast } from "sonner";

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

  const handlePreferredShellChange = (shell: string) => {
    window.terminal.saveDefaultShell(shell).then(success => {
      if (success) {
        dispatch(updatePreferredShellPath(shell));
      } else {
        console.error("Failed to save the preferred shell path.");
        toast.error("Failed to save the preferred shell path.");
      }
      setOpen(false);
    });
  }

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
                  onSelect={handlePreferredShellChange}
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