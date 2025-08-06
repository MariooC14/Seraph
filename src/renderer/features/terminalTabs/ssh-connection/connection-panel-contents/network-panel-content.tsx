import { Spinner } from '@/components/ui/spinner';
import { ConnectionPanelProps, useConnectionStepper } from '../stepper-config';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { TypographyH4 } from '@/components/ui/TypographyH4';
import { TypographyP } from '@/components/ui/TypographyP';

function NetworkPanelContent({ hostConfig }: ConnectionPanelProps) {
  const [connectState, setConnectState] = useState('initial');
  const [errors, setErrors] = useState<string[]>([]);
  const { next } = useConnectionStepper();

  function pingHost() {
    setConnectState('pending');
    window.network.ping(hostConfig.host, hostConfig.port).then(res => {
      if (res.success === true) {
        setConnectState('complete');
        setTimeout(next, 1000);
      } else {
        setConnectState('error');
        setErrors(res.details?.messages);
      }
    });
  }

  useEffect(() => {
    pingHost();
  }, []);

  return (
    <div>
      {connectState === 'pending' && <Spinner className="mt-4" size={32} />}
      {connectState === 'complete' && <div className="text-green-500 mt-4">Host is reachable!</div>}
      {connectState === 'error' && (
        <>
          <TypographyP className="text-red-500 mt-2">Failed to reach host.</TypographyP>
          {errors.length > 0 && (
            <div>
              <TypographyH4 gutterBottom>Details</TypographyH4>
              <ul className="pl-1">
                {errors.map((error, index) => (
                  <li key={index} className="font-mono">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
      <div className="w-full text-right mt-4">
        {connectState === 'error' && <Button onClick={() => pingHost()}>Retry</Button>}
      </div>
    </div>
  );
}

export default NetworkPanelContent;
