import { Input } from '@/components/ui/input';
import { ConnectionPanelProps, useConnectionStepper } from '../stepper-config';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

function UserPanelContent({ hostConfig, sessionId }: ConnectionPanelProps) {
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

  async function updateUsername() {
    await window.sshSetup.setUsername(sessionId, username);
    next();
  }

  return (
    <div>
      <Input placeholder="user" value={username} onChange={e => setUsername(e.target.value)} />
      <div className="w-full flex justify-end mt-4 gap-2">
        <Button onClick={next}>Use OS username</Button>
        <Button disabled={!username} onClick={() => updateUsername()}>
          Continue
        </Button>
      </div>
    </div>
  );
}

export default UserPanelContent;
