import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import StatusIndicator from '@/components/ui/status-indicator';
import { TypographyLarge } from '@/components/ui/typography-large';
import { TypographyMuted } from '@/components/ui/typography-muted';
import { HostConfig } from '@dts/host-config';
import { Ellipsis, Pencil, Server, Trash2 } from 'lucide-react';

type HostCardProps = {
  hostConfig: HostConfig;
  onClickConnect: (hostConfig: HostConfig) => void;
  onClickEdit: (hostConfig: HostConfig) => void;
  onClickDelete?: (hostConfig: HostConfig) => void;
};

export default function HostCard({
  hostConfig,
  onClickConnect,
  onClickEdit,
  onClickDelete
}: HostCardProps) {
  const { host, label, username } = hostConfig;

  return (
    <Card className="p-4 relative shadow-lg group hover:scale-102 transition-all">
      <StatusIndicator color="gray" className="absolute top-2 right-2" />
      <div className="flex items-center">
        <HostIcon />
        <div className="ml-2 min-w-0 flex-1">
          <TypographyLarge className="truncate">{label}</TypographyLarge>
          <TypographyMuted className="truncate">
            {username}@{host}
          </TypographyMuted>
        </div>
      </div>
      <div className="flex gap-2 justify-between select-none">
        <Button onClick={() => onClickConnect(hostConfig)}>Connect</Button>
        <OptionsMenu
          hostConfig={hostConfig}
          onClickEdit={onClickEdit}
          onClickDelete={onClickDelete}
        />
      </div>
    </Card>
  );
}

type OptionsMenuProps = {
  hostConfig: HostConfig;
  onClickEdit: (hostConfig: HostConfig) => void;
  onClickDelete: (hostConfig: HostConfig) => void;
};

function OptionsMenu({ hostConfig, onClickEdit, onClickDelete }: OptionsMenuProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onSelect={() => onClickEdit(hostConfig)}>
          <Pencil /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onClickDelete(hostConfig)} className="text-red-500">
          <Trash2 /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function HostIcon() {
  return (
    <div className="h-8 w-6">
      <Server color="gray" />
    </div>
  );
}
