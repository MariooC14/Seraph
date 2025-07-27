import { useAppSelector } from '@/app/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { selectHosts } from '../hosts/hosts-slice';

type SSHConnectionViewProps = {
  sessionId: string;
  hostId: string;
  onConnect: () => void;
};

function SSHConnectionDialog({ sessionId, hostId, onConnect }: SSHConnectionViewProps) {
  const [connectMsg, setConnectMsg] = useState('');
  const hosts = useAppSelector(selectHosts);
  const [hostConfig] = useState(() => hosts.find(host => host.id === hostId));

  const handleConnect = async () => {
    const response = await window.sshSetup.connect(sessionId);
    console.log(response);
    if (response.success === true) {
      setConnectMsg('Connection successful!');
      onConnect();
    } else {
      setConnectMsg(response.error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connecting to {hostConfig.label || hostConfig.host}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => handleConnect()} className="mt-4">
          Connect
        </Button>
        {connectMsg && <p className="mt-2 text-sm text-green-600">{connectMsg}</p>}
        {/* Add more UI elements as needed for SSH connection management */}
      </CardContent>
    </Card>
  );
}

export default SSHConnectionDialog;
