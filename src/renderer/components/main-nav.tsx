import { cn } from '@/lib/utils';
import { ServerIcon, ContainerIcon, TerminalIcon, GaugeIcon, Settings } from 'lucide-react';
import { NavLink, useLocation } from 'react-router';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: GaugeIcon },
  { name: 'Servers', href: '/servers', icon: ServerIcon },
  { name: 'Containers', href: '/containers', icon: ContainerIcon },
  { name: 'SSH Terminal', href: '/terminals', icon: TerminalIcon },
  { name: 'Settings', href: '/settings', icon: Settings },
];

function MainNav() {
  const { pathname } = useLocation();

  return (
    <nav className="flex flex-col space-y-1">
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink draggable={false}
            key={item.name}
            to={item.href}
            className={cn(
              'flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent',
              pathname === item.href
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground'
            )}
          >
            <Icon className="h-5 w-5 mr-3" aria-hidden="true" />
            {item.name}
          </NavLink>
        );
      })}
    </nav>
  );
}

export default MainNav;