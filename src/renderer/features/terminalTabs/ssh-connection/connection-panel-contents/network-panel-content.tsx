import { Spinner } from '@/components/ui/spinner';
import { useConnectionStepper } from '../stepper-config';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

function NetworkPanelContent() {
  const [connectState, setConnectState] = useState('initial');
  const { next } = useConnectionStepper();

  function pingHost() {
    setConnectState('pending');
    setTimeout(() => {
      setConnectState('complete');
    }, 1000);
  }

  useEffect(() => {
    pingHost();
  }, []);

  return (
    <div>
      {connectState === 'pending' && <Spinner className="mt-4" size={32} />}
      {connectState === 'complete' && (
        <div className="text-green-500 mt-4">Connected successfully!</div>
      )}
      {connectState === 'error' && (
        <div className="text-red-500 mt-4">Connection failed. Please try again.</div>
      )}
      <div className="w-full text-right mt-4">
        {connectState === 'error' && <Button onClick={() => pingHost()}>Retry</Button>}
        {connectState === 'complete' && <Button onClick={next}>Next</Button>}
      </div>
    </div>
  );
}

export default NetworkPanelContent;
