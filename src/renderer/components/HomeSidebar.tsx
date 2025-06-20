import { cn } from '@/lib/utils';
import { ContainerIcon, GaugeIcon, Settings } from 'lucide-react';
import { NavLink, useLocation } from 'react-router';

const navigation = [
  { name: 'Hosts', href: '/', icon: GaugeIcon },
  {
    name: 'Containers',
    href: '/containers',
    icon: ContainerIcon
  },
  { name: 'Settings', href: '/settings', icon: Settings }
];

function HomeSidebar() {
  const { pathname } = useLocation();

  return (
    <nav className="min-w-44 border-r bg-muted/10 p-3 flex flex-col space-y-1">
      {navigation.map(item => {
        const Icon = item.icon;
        return (
          <NavLink
            draggable={false}
            key={item.name}
            to={item.href}
            className={cn(
              'flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent',
              pathname === item.href ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            )}>
            <Icon className="h-5 w-5 mr-3" aria-hidden />
            {item.name}
          </NavLink>
        );
      })}
    </nav>
  );
}

export default HomeSidebar;
