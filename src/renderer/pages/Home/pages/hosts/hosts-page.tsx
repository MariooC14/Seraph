import { HostConfig } from '@dts/host-config';
import HostCard from './host-card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

import { useState } from 'react';
import { toast } from 'sonner';
import SelectedHostConfigDrawer from './selected-host-config-drawer';

const mockHostConfig: HostConfig = {
  id: '1',
  label: 'Localhost',
  host: 'localhost',
  port: 3000,
  username: 'user',
  password: 'password'
};

export default function HostsPage() {
  const [hostConfigs, setHostConfigs] = useState<HostConfig[]>([mockHostConfig]);
  const [selectedHostConfig, setSelectedHostConfig] = useState<HostConfig | null>(null);

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

  // TODO: Implement connect logic
  function handleConnect(hostConfig: HostConfig) {
    toast.success(`Connecting to ${hostConfig.label}...`);
  }

  // TODO: Implement edit host logic
  function handleEdit(hostConfig: HostConfig) {
    setSelectedHostConfig(hostConfig);
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
        onClose={() => setSelectedHostConfig(null)}
        open={!!selectedHostConfig}
      />
    </>
  );
}
