import { debounce, isCloseTabKey } from '@/lib/utils';
import '@xterm/xterm/css/xterm.css';
import { useEffect, useRef, KeyboardEvent } from 'react';
import { toast } from 'sonner';
import { ClientTerminalSession } from '@/features/terminalTabs/ClientTerminalSession';
import { useAppDispatch } from '@/app/hooks';
import { closeTab } from '@/features/terminalTabs/terminalTabsSlice';

type TerminalViewProps = {
  clientTerminalSession: ClientTerminalSession;
  onClose: (sessionId: string) => void;
  isVisible: boolean;
};

export default function TerminalView({
  clientTerminalSession: cts,
  onClose,
  isVisible
}: TerminalViewProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log('Terminal for session', cts.sessionId, 'mounted');
    cts.attachTo(terminalRef.current);

    window.terminal.onSessionTerminated(cts.sessionId, code => {
      toast.info(`Terminal session ended with code ${code}`);
      dispatch(closeTab(cts.sessionId));
    });

    const handleResize = debounce(() => {
      cts.resize();
    }, 200);

    window.addEventListener('resize', handleResize);

    setTimeout(() => {
      handleResize();
      cts.focus();
    }, 100); // Wait for the terminal to be mounted

    return () => {
      console.log('TerminalTab unmounted', cts.sessionId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    cts.isVisible = isVisible;
    if (cts.isVisible) {
      cts.resize();
      cts.focus();
    }
  }, [isVisible]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isCloseTabKey(e)) {
      e.preventDefault();
      onClose(cts.sessionId);
    }
  };

  return (
    <div
      className="h-full w-full bg-background rounded-2xl"
      onKeyDown={handleKeyDown}
      ref={terminalRef}
    />
  );
}
