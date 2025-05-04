import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import TerminalPanel from "@/features/terminalTabs/TerminalPanel";

function Terminals() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">SSH Terminal</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Connection
        </Button>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Terminal</CardTitle>
          <CardDescription>
            Secure shell connection to the selected server
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-black rounded-lg overflow-hidden">
            <TerminalPanel />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Terminals;
