import { useParams } from 'react-router';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { closeTab, selectTerminalTabs } from '@/features/terminalTabs/terminalTabsSlice';
import { terminalSessionRegistry } from '@/features/terminalTabs/ClientTerminalSessionRegistry';
import TerminalPanel from './terminal-panel';

function TerminalPanels() {
  const { terminalId } = useParams();
  const tabs = useAppSelector(selectTerminalTabs);
  const dispatch = useAppDispatch();

  const handleClose = (sessionId: string) => {
    dispatch(closeTab(sessionId));
  };

  return (
    <>
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={cn('p-4 h-full w-full bg-background', tab.id !== terminalId && 'hidden')}>
          <TerminalPanel
            key={tab.id}
            clientTerminalSession={terminalSessionRegistry.getSession(tab.id)}
            onClose={handleClose}
            isVisible={tab.id === terminalId}
          />
        </div>
      ))}
    </>
  );
}

export default TerminalPanels;
