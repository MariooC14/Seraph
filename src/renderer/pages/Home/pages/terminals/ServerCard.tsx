import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TerminalIcon } from 'lucide-react';

interface ServerCardProps {
  id: string;
  name: string;
  isAccessible: boolean;
  host: string;
  username: string;
}

export default function ServerCard({
  // id,
  name,
  isAccessible,
  host,
  username
}: ServerCardProps) {
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="font-medium">{name}</CardTitle>
        <CardDescription>
          {username}@{host}
        </CardDescription>
        {/* Status indicator */}
        <div
          className={`absolute top-3 right-3 size-3 rounded-full ${isAccessible ? 'bg-green-400' : 'bg-red-400'}`}></div>
      </CardHeader>
      <CardContent>
        <Button>
          <TerminalIcon />
          Connect
        </Button>
      </CardContent>
    </Card>
  );
}
