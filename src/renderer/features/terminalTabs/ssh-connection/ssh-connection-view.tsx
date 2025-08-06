import { useAppSelector } from '@/app/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { selectHosts } from '../../hosts/hosts-slice';

import UsernamePanelContent from './connection-panel-contents/username-panel-content';
import AuthPanelContent from './connection-panel-contents/auth-panel-content';
import NetworkPanelContent from './connection-panel-contents/network-panel-content';
import { ConnectionStepper } from './stepper-config';
import { TypographyH3 } from '@/components/ui/TypographyH3';
import SuccessPanelContent from './connection-panel-contents/success-panel-content';

type SSHConnectionViewProps = {
  sessionId: string;
  hostId: string;
  onConnect: () => void;
};

function SSHConnectionDialog({ hostId, sessionId, onConnect }: SSHConnectionViewProps) {
  const hosts = useAppSelector(selectHosts);
  const [hostConfig] = useState(() => hosts.find(host => host.id === hostId));

  const attemptConnect = async () => {
    const res = await window.sshSetup.connect(sessionId);
    return res.success;
  };

  const panelProps = { hostConfig, sessionId, attemptConnect };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect to {hostConfig.label || hostConfig.host}</CardTitle>
      </CardHeader>
      <CardContent>
        <ConnectionStepper.Provider variant="vertical">
          {({ methods }) => (
            <>
              <div className="flex gap-4">
                <ConnectionStepper.Navigation>
                  {methods.all.map(step => (
                    <ConnectionStepper.Step
                      key={step.id}
                      of={step.id}
                      icon={step.icon}></ConnectionStepper.Step>
                  ))}
                </ConnectionStepper.Navigation>

                {methods.switch({
                  'step-user': step => (
                    <Panel {...step}>
                      <UsernamePanelContent {...panelProps} />
                    </Panel>
                  ),
                  'step-network': step => (
                    <Panel {...step}>
                      <NetworkPanelContent {...panelProps} />
                    </Panel>
                  ),
                  'step-auth': step => (
                    <Panel {...step}>
                      <AuthPanelContent {...panelProps} />
                    </Panel>
                  ),
                  'step-success': step => (
                    <Panel {...step}>
                      <SuccessPanelContent onSuccess={onConnect} />
                    </Panel>
                  )
                })}
              </div>
            </>
          )}
        </ConnectionStepper.Provider>
      </CardContent>
    </Card>
  );
}

type PanelProps = {
  children?: React.ReactNode;
  icon: React.ReactNode;
  title: string;
};

function Panel({ children, icon, title }: PanelProps) {
  return (
    <ConnectionStepper.Panel className="flex-1 w-80">
      <header className="flex gap-2 items-center mb-2">
        {icon} <TypographyH3>{title}</TypographyH3>
      </header>
      {children}
    </ConnectionStepper.Panel>
  );
}

export default SSHConnectionDialog;
