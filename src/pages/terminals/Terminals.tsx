"use client";

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
import { Terminal as TerminalIcon, Plus, X } from "lucide-react";
import { toast } from "sonner";
import TerminalWindow from "@/components/TerminalWindow";
import { Label } from "@/components/ui/label";

function Terminals() {
  const [servers, setServers] = useState([]);
  const [activeConnection, setActiveConnection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadServers();
  }, []);

  const loadServers = async () => {
    toast.error("Load servers not implemented yet.");
    // try {
    //   const { getServers } = await import("@/lib/server");
    //   const data = await getServers();
    //   setServers(data);
    // } catch (error) {
    //   toast.error("Failed to load servers.");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleConnect = async (/*server*/) => {
    toast.error("Connect to server not implemented yet.");
    // try {
    //   const { connectToServer } = await import("@/lib/server");
    //   const connection = await connectToServer(server);
    //   setActiveConnection(connection);
    //   toast.success("Connected to server successfully.");
    // } catch (error) {
    //   toast.error("Failed to connect to server.");
    // }
  };

  const handleDisconnect = async () => {
    toast.error("Disconnect from server not implemented yet");
    // if (activeConnection) {
    //   activeConnection.dispose();
    //   setActiveConnection(null);
    //   toast.success("Disconnected from server.");
    // }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
        {servers.map((server) => (
          <Card key={server.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {server.name}
              </CardTitle>
              <div
                className={`px-2 py-1 rounded-full text-xs ${
                  activeConnection?.server?.id === server.id
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {activeConnection?.server?.id === server.id
                  ? "Connected"
                  : "Disconnected"}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Host</Label>
                  <Input value={server.host} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input value={server.username} readOnly />
                </div>
                <div className="flex space-x-2">
                  {activeConnection?.server?.id === server.id ? (
                    <Button
                      className="flex-1"
                      variant="destructive"
                      onClick={handleDisconnect}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      className="flex-1"
                      // onClick={() => handleConnect(server)}
                    >
                      <TerminalIcon className="mr-2 h-4 w-4" />
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Terminal</CardTitle>
          <CardDescription>
            Secure shell connection to the selected server
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeConnection ? (
            <div className="h-[400px] bg-black rounded-lg overflow-hidden">
              <TerminalWindow connection={activeConnection} />
            </div>
          ) : (
            <div className="h-[400px] bg-black text-green-400 font-mono p-4 rounded-lg flex items-center justify-center">
              <p>Select a server to connect</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Terminals;