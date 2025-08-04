import { defineStepper } from '@/components/ui/stepper';
import { HostConfig } from '@dts/host-config';
import { User, KeyRound, Plug, Network } from 'lucide-react';

type ConnectionStep = {
  id: string;
  title: string;
  icon: React.ReactNode;
};

export type ConnectionPanelProps = {
  hostConfig?: HostConfig;
};

const allSteps = {
  user: { id: 'step-user', title: 'Username', icon: <User /> },
  network: { id: 'step-network', title: 'Network Check', icon: <Network /> },
  authCredentials: { id: 'step-auth', title: 'Authentication', icon: <KeyRound /> },
  success: { id: 'step-success', title: 'Success', icon: <Plug /> }
} as const satisfies Record<string, ConnectionStep>;

const { Stepper, steps, utils, useStepper } = defineStepper(...Object.values(allSteps));

export const ConnectionStepper = Stepper;
export const connectionSteps = steps;
export const connectionUtils = utils;
export const useConnectionStepper = useStepper;
