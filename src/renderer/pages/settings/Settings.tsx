import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotificationsTab from "./tabs/NotificationsTab";
import SecurityTab from "./tabs/SecurityTab";
import GeneralTab from "./tabs/GeneralTab";
import TerminalTab from "./tabs/TerminalTab";

function Settings() {

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="terminal" className="space-y-4">
        <TabsList className="">
          <TabsTrigger value="terminal">
            Terminal
          </TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            Security
          </TabsTrigger>
          <TabsTrigger value="general">
            General
          </TabsTrigger>
        </TabsList>

        <NotificationsTab />
        <SecurityTab />
        <GeneralTab />
        <TerminalTab />
      </Tabs>
    </div>
  );
}

export default Settings;