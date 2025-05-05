import { useParams } from 'react-router';
import TerminalView from './TerminalView';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { closeTab, selectTerminalTabs } from '@/features/terminalTabs/terminalTabsSlice';
import { terminalSessionRegistry } from '@/features/terminalTabs/ClientTerminalSessionRegistry';

function TerminalPanel() {
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
          <TerminalView
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

export default TerminalPanel;
