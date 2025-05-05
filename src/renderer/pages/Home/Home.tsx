/**
 *
 */

import HomeSidebar from '@/components/HomeSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Outlet } from 'react-router';

export default function Home() {
  return (
    <>
      <HomeSidebar />
      <ScrollArea className="p-8 h-full flex-1">
        <Outlet />
      </ScrollArea>
    </>
  );
}
