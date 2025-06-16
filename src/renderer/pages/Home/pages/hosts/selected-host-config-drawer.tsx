import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from '@/components/ui/drawer';
import { HostConfig } from '@dts/host-config';
import { DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type HostConfigDrawerContentProps = {
  hostConfig?: HostConfig;
  onClose: () => void;
  open: boolean;
};

function SelectedHostConfigDrawer({
  hostConfig,
  onClose,
  open = false
}: HostConfigDrawerContentProps) {
  return (
    <Drawer open={open} onClose={onClose} shouldScaleBackground>
      <DrawerContent className="px-4">
        <DrawerHeader>
          <DialogTitle>{hostConfig?.label || ''} (TODO)</DialogTitle>
        </DrawerHeader>
        <div className="p-4 min-h-40">
          {hostConfig && (
            <>
              <p>
                <strong>Port:</strong> {hostConfig.port}
              </p>
              <p>
                <strong>Host:</strong> {hostConfig.host}
              </p>
              <p>
                <strong>Username:</strong> {hostConfig.username}
              </p>
            </>
          )}
        </div>
        <DrawerFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default SelectedHostConfigDrawer;
