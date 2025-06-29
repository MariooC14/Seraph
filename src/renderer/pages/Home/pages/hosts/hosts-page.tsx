import { HostConfig } from '@dts/host-config';
import HostCard from './host-card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useState } from 'react';
import { toast } from 'sonner';
import { HostConfigDrawer } from './host-config-drawer';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { createTab } from '@/features/terminalTabs/terminalTabsSlice';
import { fetchHostConfigs, selectHostConfigs } from '@/features/config/configSlice';
import { type HostSubmissionData } from '@/lib/host-validation';

export default function HostsPage() {
  const hostConfigs = useAppSelector(selectHostConfigs);
  const [hostDrawerOpen, setHostDrawerOpen] = useState(false);
  const [hostDrawerMode, setHostDrawerMode] = useState<'add' | 'edit'>('add');
  const [selectedHostConfig, setSelectedHostConfig] = useState<HostConfig>();
  const dispatch = useAppDispatch();

  function handleAddNewHost() {
    setHostDrawerMode('add');
    setSelectedHostConfig(undefined);
    setHostDrawerOpen(true);
  }

  async function handleAddHost(newHost: HostSubmissionData) {
    const newHostConfig: HostConfig = {
      ...newHost,
      // TODO: Generate ID in the backend
      id: crypto.randomUUID()
    };

    try {
      await window.hosts.add(newHostConfig);
      toast.success(`Added host ${newHostConfig.label}`);
      dispatch(fetchHostConfigs());
    } catch (err) {
      toast.error(`Failed to add host: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  async function handleUpdateHost(hostConfig: HostConfig) {
    try {
      // TODO: Implement proper update method in the backend
      await window.hosts.remove(hostConfig.id);
      await window.hosts.add(hostConfig);
      toast.success(`Updated host ${hostConfig.label}`);
      dispatch(fetchHostConfigs());
    } catch (err) {
      toast.error(`Failed to update host: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  async function handleDeleteHost(hostConfig: HostConfig) {
    try {
      await window.hosts.remove(hostConfig.id);
      toast.success(`Deleted host ${hostConfig.label}`);
      dispatch(fetchHostConfigs());
    } catch (err) {
      toast.error(`Failed to delete host: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  // TODO: Implement connect logic
  function handleConnect(hostConfig: HostConfig) {
    dispatch(createTab({ type: 'ssh', name: hostConfig.label, hostId: hostConfig.id }));
  }

  function handleEdit(hostConfig: HostConfig) {
    setHostDrawerMode('edit');
    setSelectedHostConfig(hostConfig);
    setHostDrawerOpen(true);
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
            onClickDelete={handleDeleteHost}
          />
        ))}
      </div>
      <HostConfigDrawer
        mode={hostDrawerMode}
        open={hostDrawerOpen}
        onOpenChange={setHostDrawerOpen}
        onSubmit={handleAddHost}
        onUpdate={handleUpdateHost}
        onDelete={handleDeleteHost}
        hostConfig={selectedHostConfig}
      />
    </>
  );
}
