import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store';
import {
  LayoutDashboard,
  Inbox,
  Zap,
  Clock,
  CalendarDays,
  Sparkles,
  ClipboardList,
  Tag,
  Users,
  CheckCircle,
  LogOut,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/inbox', label: 'Inbox', icon: Inbox },
  { path: '/next-actions', label: 'Next Actions', icon: Zap },
  { path: '/waiting-for', label: 'Waiting For', icon: Clock },
  { path: '/scheduled', label: 'Scheduled', icon: CalendarDays },
  { path: '/someday', label: 'Someday', icon: Sparkles },
  { path: '/projects', label: 'Projects', icon: ClipboardList },
  { path: '/contexts', label: 'Contexts', icon: Tag },
  { path: '/family', label: 'Family', icon: Users },
  { path: '/review', label: 'Weekly Review', icon: CheckCircle },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const { user, logout } = useAuthStore();

  return (
    <aside className="w-64 bg-stone-900 text-white flex flex-col h-screen">
      <div className="p-4 border-b border-stone-800 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">GTD Family</h1>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 text-stone-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-amber-600/15 text-amber-500'
                      : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-stone-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-sm font-medium">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-stone-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
