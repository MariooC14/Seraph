import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Shield, Globe } from "lucide-react";
import NotificationsTab from "./tabs/NotificationsTab";
import SecurityTab from "./tabs/SecurityTab";
import GeneralTab from "./tabs/GeneralTab";

function Settings() {

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications">
            <Bell /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield /> Security
          </TabsTrigger>
          <TabsTrigger value="general">
            <Globe />General
          </TabsTrigger>
        </TabsList>

        <NotificationsTab />
        <SecurityTab />
        <GeneralTab />
      </Tabs>
    </div>
  );
}

export default Settings;