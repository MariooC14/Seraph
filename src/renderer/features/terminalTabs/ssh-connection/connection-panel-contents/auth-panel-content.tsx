import { Input } from '@/components/ui/input';
import { ConnectionPanelProps, useConnectionStepper } from '../stepper-config';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

function AuthPanelContent({ hostConfig }: ConnectionPanelProps) {
  const { next } = useConnectionStepper();
  const [password, setPassword] = useState(hostConfig.password || '');
  const [connectState, setConnectState] = useState('initial');

  useEffect(() => {
    if (hostConfig.password) {
      attemptConnect();
    }
  }, []);

  function attemptConnect() {
    setConnectState('pending');
    setTimeout(() => {
      setConnectState('complete');
    }, 1250);
  }

  return (
    <div>
      {connectState === 'initial' && !hostConfig.password && (
        <>
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <div className="w-full text-right mt-4">
            <Button onClick={() => attemptConnect()}>Connect</Button>
          </div>
        </>
      )}
      {connectState === 'pending' && <Spinner size={32} />}
      {connectState === 'complete' && (
        <>
          <div className="text-green-500 mt-4">Connected successfully!</div>
          <div className="w-full text-right mt-4">
            <Button onClick={next}>Next</Button>
          </div>
        </>
      )}
    </div>
  );
}

export default AuthPanelContent;
