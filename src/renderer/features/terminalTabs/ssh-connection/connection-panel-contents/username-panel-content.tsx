import { Input } from '@/components/ui/input';
import { ConnectionPanelProps, useConnectionStepper } from '../stepper-config';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

function UserPanelContent({ hostConfig }: ConnectionPanelProps) {
  const { next, metadata, setMetadata } = useConnectionStepper({
    initialMetadata: { 'step-user': { alreadySkipped: false } } // Skip initially but allow to go back and change
  });
  const [username, setUsername] = useState(hostConfig.username || '');

  useEffect(() => {
    if (hostConfig.username && !metadata['step-user']?.alreadySkipped) {
      setMetadata('step-user', { alreadySkipped: true });
      next();
    }
  }, []);

  return (
    <div>
      <Input placeholder="user" value={username} onChange={e => setUsername(e.target.value)} />
      <div className="w-full flex justify-end mt-4 gap-2">
        <Tooltip delayDuration={250}>
          <TooltipTrigger asChild>
            <Button onClick={next}>Continue without username</Button>
          </TooltipTrigger>
          <TooltipContent>The username from your OS will be used instead.</TooltipContent>
        </Tooltip>
        <Button disabled={!username} onClick={next}>
          Continue
        </Button>
      </div>
    </div>
  );
}

export default UserPanelContent;
