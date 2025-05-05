import { useAppDispatch } from '@/app/hooks';
import { Button } from '@/components/ui/button';
import { createTab } from '@/features/terminalTabs/terminalTabsSlice';

function Hosts() {
  const dispatch = useAppDispatch();

  const handleConnectClick = () => {
    console.log('Connecting to host...');
    dispatch(createTab({ name: 'New Host', type: 'ssh' }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Hosts</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Button onClick={() => handleConnectClick()}>Connect to the moon</Button>
      </div>
    </div>
  );
}

export default Hosts;
