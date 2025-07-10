import HomeSidebar from '@/components/HomeSidebar';
import { Outlet } from 'react-router';

export default function Home() {
  return (
    <>
      <HomeSidebar />
      <div className="p-8 h-full flex flex-col flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </>
  );
}
