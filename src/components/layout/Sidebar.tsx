import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Settings,
  Megaphone,
  ChevronLeft,
  LogOut,
  Star,
  Gift,
  Plug,
  Building2,
  CalendarCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['admin', 'agent'] },
  { name: 'Leads', href: '/leads', icon: Users, roles: ['admin', 'agent'] },
  { name: 'Follow-ups', href: '/followups', icon: CalendarCheck, roles: ['admin', 'agent'] },
  { name: 'Quick Messages', href: '/messages', icon: MessageSquare, roles: ['admin', 'agent'] },
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone, roles: ['admin'] },
  { name: 'Reviews', href: '/reviews', icon: Star, roles: ['admin', 'agent'] },
  { name: 'Birthdays', href: '/birthdays', icon: Gift, roles: ['admin', 'agent'] },
  { name: 'Organization', href: '/settings/organization', icon: Building2, roles: ['admin'] },
  { name: 'Integrations', href: '/integrations', icon: Plug, roles: ['admin'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin'] },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [userRole, setUserRole] = useState<'admin' | 'agent'>('admin'); // Default to admin, can be toggled

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <span className="text-sm font-bold text-sidebar-primary-foreground">A</span>
              </div>
              <span className="font-semibold text-sidebar-foreground">Abhivrudhi</span>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <span className="text-sm font-bold text-sidebar-primary-foreground">A</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              collapsed && 'absolute -right-3 top-6 z-50 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar shadow-md'
            )}
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {navigation.filter(item => item.roles.includes(userRole)).map((item) => {
            const isActive = location.pathname === item.href;
            const NavItem = (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-soft'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.name} delayDuration={0}>
                  <TooltipTrigger asChild>{NavItem}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return NavItem;
          })}
        </nav>

        {/* Role Switcher (For Demo/Testing) */}
        {!collapsed && (
          <div className="px-3 pb-2">
            <div className="flex items-center justify-between rounded-md bg-sidebar-accent/50 p-2 text-xs">
              <span className="font-medium text-sidebar-foreground">View as:</span>
              <div className="flex gap-1 rounded bg-background p-1">
                <button
                  onClick={() => setUserRole('admin')}
                  className={cn(
                    "px-2 py-0.5 rounded transition-colors",
                    userRole === 'admin' ? "bg-primary text-primary-foreground" : "hover:bg-sidebar-accent"
                  )}
                >
                  Admin
                </button>
                <button
                  onClick={() => setUserRole('agent')}
                  className={cn(
                    "px-2 py-0.5 rounded transition-colors",
                    userRole === 'agent' ? "bg-primary text-primary-foreground" : "hover:bg-sidebar-accent"
                  )}
                >
                  Agent
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User section */}
        <div className="border-t border-sidebar-border p-3">
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2',
              collapsed && 'justify-center'
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent">
              <span className="text-xs font-medium text-sidebar-accent-foreground">
                {userRole === 'admin' ? 'PS' : 'JD'}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-sidebar-foreground">
                  {userRole === 'admin' ? 'Priya Sharma' : 'John Doe'}
                </p>
                <p className="truncate text-xs text-sidebar-foreground/60 capitalize">{userRole}</p>
              </div>
            )}
            {!collapsed && (
              <Button variant="ghost" size="icon-sm" className="text-sidebar-foreground/60 hover:text-sidebar-foreground">
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
