import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, TerminalIcon} from "lucide-react";
import TerminalWindow from "@/components/TerminalWindow/TerminalWindow";
import ServerCard from "./ServerCard";

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ServerCard
          id="1"
          host="192.168.1.1"
          isAccessible={false}
          name="Lunar"
          username="marioc14"
        />
        <Card className="text-center">
          <CardHeader className="text-lg font-medium">Local Terminal</CardHeader>
          <CardContent>
            <Button><TerminalIcon />Connect to localhost</Button>
          </CardContent>
        </Card>
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
            <TerminalWindow />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Terminals;
