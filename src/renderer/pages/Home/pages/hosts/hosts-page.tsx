import { HostConfig } from '@dts/host-config';
import HostCard from './host-card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

import { useState } from 'react';
import { toast } from 'sonner';
import SelectedHostConfigDrawer from './selected-host-config-drawer';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { createTab } from '@/features/terminalTabs/terminalTabsSlice';
import { fetchHostConfigs, selectHostConfigs } from '@/features/config/configSlice';
import { AddHostDrawer } from './add-host-drawer';

export default function HostsPage() {
  const hostConfigs = useAppSelector(selectHostConfigs);
  const [addHostDrawerOpen, setAddHostDrawerOpen] = useState(false);
  const [selectedHostConfig, setSelectedHostConfig] = useState<HostConfig>();
  const dispatch = useAppDispatch();

  function handleAddNewHost() {
    setAddHostDrawerOpen(true);
  }

  async function handleAddHost(newHost: Omit<HostConfig, 'id'>) {
    const newHostConfig: HostConfig = {
      ...newHost,
      id: crypto.randomUUID() // Generate a unique ID for the new host
    };

    try {
      await window.hosts.add(newHostConfig);
      toast.success(`Added host ${newHostConfig.label}`);
      setAddHostDrawerOpen(false);
      dispatch(fetchHostConfigs());
    } catch (err) {
      toast.error(`Failed to add host: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  async function handleDelete(hostConfig: HostConfig) {
    await window.hosts.remove(hostConfig.id);
    dispatch(fetchHostConfigs());
    toast.success(`Deleted host ${hostConfig.label}`);
  }

  // TODO: Implement connect logic
  function handleConnect(hostConfig: HostConfig) {
    dispatch(createTab({ type: 'ssh', name: hostConfig.label, hostId: hostConfig.id }));
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
        onClose={() => setSelectedHostConfig(undefined)}
        open={!!selectedHostConfig}
      />
      <AddHostDrawer
        title="Add New Host"
        open={addHostDrawerOpen}
        onOpenChange={setAddHostDrawerOpen}
        onSubmit={handleAddHost}
      />
    </>
  );
}
