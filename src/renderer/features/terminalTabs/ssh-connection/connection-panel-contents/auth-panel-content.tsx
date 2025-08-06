import { Input } from '@/components/ui/input';
import { ConnectionPanelProps, useConnectionStepper } from '../stepper-config';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

function AuthPanelContent({
  hostConfig,
  sessionId,
  attemptConnect
}: ConnectionPanelProps & { attemptConnect: () => Promise<boolean> }) {
  const { next } = useConnectionStepper();
  const [password, setPassword] = useState(hostConfig.password || '');
  const [connectState, setConnectState] = useState('initial');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hostConfig.password) {
      tryConnect();
    }
  }, []);

  async function tryConnect() {
    setConnectState('pending');
    if (password) {
      await window.sshSetup.setPassword(sessionId, password);
    }
    const success = await attemptConnect();
    if (success) {
      setConnectState('complete');
      next();
    } else {
      setConnectState('error');
      setError('Failed to connect. Please check your credentials.');
    }
  }

  return (
    <div>
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {connectState !== 'pending' && !hostConfig.password && (
        <>
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <div className="w-full text-right mt-4">
            <Button onClick={() => tryConnect()}>Connect</Button>
          </div>
        </>
      )}
      {connectState === 'pending' && <Spinner size={32} />}
    </div>
  );
}

export default AuthPanelContent;
