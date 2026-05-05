import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  PenTool,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useAuthStore } from '../../store/authStore';

import { WorkspaceNav } from '../dashboard/WorkspaceNav';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Templates', to: '/templates', icon: FileText },
  { label: 'Editor', to: '/editor', icon: PenTool },
  { label: 'Settings', to: '/settings', icon: Settings },
];

export const AppNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const isActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const displayName = user?.displayName ?? user?.email?.split('@')[0] ?? 'User';
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const email = user?.email ?? '';

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white border border-gray-200 rounded-xl shadow-lg text-gray-600"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`w-64 bg-white border-r border-[#E5E7EB] h-screen fixed left-0 top-0 flex flex-col z-40 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#E5E7EB]">
          <Logo variant="full" size="xl" href="/" />
        </div>

        {/* Primary nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive(to)
                  ? 'bg-indigo-50 text-indigo-600 border-r-2 border-indigo-600 rounded-r-none pr-2'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-[#111827]',
              ].join(' ')}
            >
              <Icon size={18} className="flex-shrink-0" />
              {label}
            </Link>
          ))}

          {/* Workspaces section */}
          <WorkspaceNav />
        </nav>

        {/* User footer */}
        <div className="border-t border-[#E5E7EB] px-3 py-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {avatarLetter}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#111827] truncate">{displayName}</p>
              <p className="text-xs text-gray-400 truncate">{email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"
              aria-label="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppNav;
