import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { TabsContent } from "@radix-ui/react-tabs";

export default function SecurityTab() {

  return (
    <TabsContent value="security">
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Configure security options for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Two-Factor Authentication</Label>
            <Button variant="outline" className="w-full">
              Enable 2FA
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Session Management</Label>
            <Button variant="outline" className="w-full">
              View Active Sessions
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Login History</Label>
            <Button variant="outline" className="w-full">
              View Login History
            </Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
