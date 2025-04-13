import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";

export default function GeneralTab() {
  return (
    <TabsContent value="general">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Configure general application settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Time Zone</Label>
            <Input value="UTC" readOnly />
          </div>
          <div className="space-y-2">
            <Label>Language</Label>
            <Input value="English" readOnly />
          </div>
          <div className="space-y-2">
            <Label>Date Format</Label>
            <Input value="YYYY-MM-DD" readOnly />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
