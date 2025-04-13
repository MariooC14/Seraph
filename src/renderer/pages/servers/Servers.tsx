import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Server, Activity, HardDrive, Network, Trash2 } from "lucide-react";
import { toast } from "sonner";
// import { AddServerDialog } from "@/components/add-server-dialog";

type Server = {
  id: string;
  name: string;
  host: string;
};

function Servers() {
  const [servers, setServers] = useState<Server[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadServers();
  }, []);

  const loadServers = async () => {
    toast.error("Load servers not implemented yet.");
    // try {
    //   const data: Server[] = await getServers();
    //   setServers(data);
    // } catch (error) {
    //   toast.error("Failed to load servers.");
    // } finally {
    //   setIsLoading(false);
    }

  const handleDeleteServer = async (id: string) => {
    toast.error("Delete server not implemented yet.");
    // try {
    //   await deleteServer(id);
    //   setServers(servers.filter((server) => server.id !== id));
    //   toast.success("Server deleted successfully.");
    // } catch (error) {
    //   toast.error("Failed to delete server.");
    // }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Servers</h1>
        {/* <AddServerDialog /> */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {servers.map((server) => (
          <Card key={server.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {server.name}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  Connected
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteServer(server.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Host: {server.host}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPU</span>
                    <span>45%</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: "45%" }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Memory</span>
                    <span>62%</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: "62%" }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Disk</span>
                    <span>78%</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: "78%" }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Server Details</CardTitle>
          <CardDescription>
            Detailed metrics and management options for the selected server
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="metrics" className="space-y-4">
            <TabsList>
              <TabsTrigger value="metrics">
                <Activity className="h-4 w-4 mr-2" />
                Metrics
              </TabsTrigger>
              <TabsTrigger value="storage">
                <HardDrive className="h-4 w-4 mr-2" />
                Storage
              </TabsTrigger>
              <TabsTrigger value="network">
                <Network className="h-4 w-4 mr-2" />
                Network
              </TabsTrigger>
            </TabsList>
            <TabsContent value="metrics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label>CPU Usage</Label>
                  <div className="text-2xl font-bold">45%</div>
                </div>
                <div className="space-y-2">
                  <Label>Memory Usage</Label>
                  <div className="text-2xl font-bold">62%</div>
                </div>
                <div className="space-y-2">
                  <Label>Disk I/O</Label>
                  <div className="text-2xl font-bold">2.4 MB/s</div>
                </div>
                <div className="space-y-2">
                  <Label>Network</Label>
                  <div className="text-2xl font-bold">45 Mb/s</div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="storage" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Mount Points</Label>
                  <Input value="/dev/sda1 - 256GB (78% used)" readOnly />
                  <Input value="/dev/sdb1 - 512GB (45% used)" readOnly />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="network" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Network Interfaces</Label>
                  <Input value="eth0 - 192.168.1.100" readOnly />
                  <Input value="eth1 - 10.0.0.100" readOnly />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default Servers;