import { HostConfig } from '@dts/host-config';
import HostCard from './host-card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import SelectedHostConfigDrawer from './selected-host-config-drawer';
import { useAppDispatch } from '@/app/hooks';
import { createTab } from '@/features/terminalTabs/terminalTabsSlice';

const mockHostConfig: HostConfig = {
  id: '1',
  label: 'Localhost',
  host: 'localhost',
  port: 3000,
  username: 'user',
  password: 'password',
  source: 'manual'
};

export default function HostsPage() {
  const [hostConfigs, setHostConfigs] = useState<HostConfig[]>([mockHostConfig]);
  const [selectedHostConfig, setSelectedHostConfig] = useState<HostConfig>();
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  // Load SSH hosts on component mount
  useEffect(() => {
    async function loadSSHHosts() {
      try {
        const sshHosts = await window.ssh.readConfig();
        const convertedHosts: HostConfig[] = sshHosts.map((sshHost, index) => ({
          id: `ssh-${index}`,
          label: sshHost.host,
          host: sshHost.hostname || sshHost.host,
          port: sshHost.port || 22,
          username: sshHost.user,
          source: 'ssh-config' as const,
          identityFile: sshHost.identityFile,
          configPath: sshHost.configPath
        }));

        setHostConfigs([mockHostConfig, ...convertedHosts]);
      } catch (error) {
        console.error('Failed to load SSH hosts:', error);
        toast.error('Failed to load SSH configuration');
        setHostConfigs([mockHostConfig]);
      } finally {
        setLoading(false);
      }
    }

    loadSSHHosts();
  }, []);

  // TODO: Implement add host logic
  function handleAddNewHost() {
    setHostConfigs(prevHostConfigs => [
      ...prevHostConfigs,
      { ...mockHostConfig, id: (prevHostConfigs.length + 1).toString() } as HostConfig
    ]);
  }

  // TODO: Implement delete host logic
  function handleDelete(hostConfig: HostConfig) {
    setHostConfigs(prevHostConfigs => prevHostConfigs.filter(h => h.id !== hostConfig.id));
    toast.success(`Deleted host ${hostConfig.label}`);
  }

  // Update connect logic
  async function handleConnect(hostConfig: HostConfig) {
    try {
      if (hostConfig.source === 'ssh-config') {
        const result = await window.ssh.connect(hostConfig);
        if (result.success && result.sessionId) {
          // Create a new terminal tab for the SSH connection
          dispatch(
            createTab({
              name: `SSH: ${hostConfig.label}`,
              sessionId: result.sessionId
            })
          );
          toast.success(`Connected to ${hostConfig.label}`);
        }
      } else {
        // Handle manual connections (existing logic)
        toast.success(`Connecting to ${hostConfig.label}...`);
      }
    } catch (error) {
      console.error('Connection failed:', error);
      toast.error(`Failed to connect to ${hostConfig.label}`);
    }
  }

  // TODO: Implement edit host logic
  function handleEdit(hostConfig: HostConfig) {
    setSelectedHostConfig(hostConfig);
  }

  // Show loading state
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading hosts...</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center sticky top-0 z-10 bg-background pb-2">
        <h1 className="text-3xl font-bold">Hosts</h1>
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <Button variant="ghost" onClick={handleAddNewHost}>
              <PlusCircle />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add new host</TooltipContent>
        </Tooltip>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {hostConfigs.map(hostConfig => (
          <HostCard
            key={hostConfig.id}
            hostConfig={hostConfig}
            onClickConnect={handleConnect}
            onClickEdit={handleEdit}
            onClickDelete={handleDelete}
          />
        ))}
      </div>
      <SelectedHostConfigDrawer
        hostConfig={selectedHostConfig}
        onClose={() => setSelectedHostConfig(undefined)}
        open={!!selectedHostConfig}
      />
    </>
  );
}
