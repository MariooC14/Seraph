import { HostConfig } from '@dts/host-config';
import HostCard from './host-card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

import { useEffect, useState } from 'react';
import { HostConfigDrawer } from './host-config-drawer';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { createTab } from '@/features/terminalTabs/terminalTabsSlice';
import {
  addHostConfig,
  getHosts,
  removeHostConfig,
  selectHosts,
  selectHostsFetching
} from '@/features/hosts/hosts-slice';
import { type HostFormData } from '@/lib/host-validation';
import { Skeleton } from '@/components/ui/skeleton';
import { TypographyH3 } from '@/components/ui/TypographyH3';

export default function HostsPage() {
  const hostConfigs = useAppSelector(selectHosts);
  const fetching = useAppSelector(selectHostsFetching);
  const [hostDrawerOpen, setHostDrawerOpen] = useState(false);
  const [hostDrawerMode, setHostDrawerMode] = useState<'add' | 'edit'>('add');
  const [selectedHostConfig, setSelectedHostConfig] = useState<HostConfig>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getHosts());
  }, []);

  function handleAddNewHost() {
    setHostDrawerMode('add');
    setSelectedHostConfig(undefined);
    setHostDrawerOpen(true);
  }

  async function handleAddHost(newHost: HostFormData) {
    dispatch(addHostConfig(newHost));
  }

  async function handleUpdateHost(hostConfig: HostConfig) {
    // TODO: Implement proper update method in the backend
    dispatch(removeHostConfig(hostConfig.id));
    dispatch(addHostConfig(hostConfig));
  }

  function handleDeleteHost(hostConfig: HostConfig) {
    dispatch(removeHostConfig(hostConfig.id));
  }

  function handleConnect(hostConfig: HostConfig) {
    dispatch(
      createTab({ type: 'ssh', name: hostConfig.label || hostConfig.host, hostId: hostConfig.id })
    );
  }

  function handleEdit(hostConfig: HostConfig) {
    setHostDrawerMode('edit');
    setSelectedHostConfig(hostConfig);
    setHostDrawerOpen(true);
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex justify-between items-center top-0 z-10 pb-2">
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
        {fetching ? (
          <SkeletonCards />
        ) : (
          hostConfigs.map(hostConfig => (
            <HostCard
              key={hostConfig.id}
              hostConfig={hostConfig}
              onClickConnect={handleConnect}
              onClickEdit={handleEdit}
              onClickDelete={handleDeleteHost}
            />
          ))
        )}
      </div>
      {!fetching && !hostConfigs.length && <EmptyDisplay />}
      <HostConfigDrawer
        mode={hostDrawerMode}
        open={hostDrawerOpen}
        onOpenChange={setHostDrawerOpen}
        onSubmit={handleAddHost}
        onUpdate={handleUpdateHost}
        onDelete={handleDeleteHost}
        hostConfig={selectedHostConfig}
      />
    </div>
  );
}

function SkeletonCards() {
  return [...Array(6)].map((_, index) => <Skeleton key={index} className="h-34 rounded-xl" />);
}

function EmptyDisplay() {
  return (
    <div className="m-auto">
      <TypographyH3 className="text-muted">Wow, such empty</TypographyH3>
    </div>
  );
}
