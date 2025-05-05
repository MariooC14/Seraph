import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { TabsContent } from '@/components/ui/tabs';
import { ModeToggle } from '@/components/mode-toggle';
import { TypographyH4 } from '@/components/ui/TypographyH4';

export default function AppearanceTab() {
  return (
    <TabsContent value="appearance">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the appearance of Seraph</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TypographyH4>Theme</TypographyH4>
          <ModeToggle />
        </CardContent>
      </Card>
    </TabsContent>
  );
}
