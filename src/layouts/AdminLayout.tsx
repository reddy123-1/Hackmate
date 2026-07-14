import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Trophy, FileText, LogOut, Zap,
  ChevronLeft, ChevronRight, Menu, X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { logoutAdmin } from '../services/auth';
import Logo from '../components/Logo';
import toast from 'react-hot-toast';

const sidebarLinks = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Hackathons', href: '/admin/hackathons', icon: Trophy },
  { label: 'Applications', href: '/admin/applications', icon: FileText },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await logoutAdmin();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Logo size={24} iconOnly={collapsed} />
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-500/10 text-brand-400'
                  : 'dark:text-surface-400 text-surface-600 dark:hover:text-surface-200 hover:text-surface-900 dark:hover:bg-white/5 hover:bg-black/5'
              }`}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t dark:border-white/5 border-black/5 space-y-1">
        {!collapsed && user && (
          <div className="px-3 py-2 mb-1">
            <p className="text-xs dark:text-surface-500 text-surface-500 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium dark:text-surface-400 text-surface-600 dark:hover:text-red-400 hover:text-red-500 dark:hover:bg-red-500/5 hover:bg-red-500/5 transition-all w-full"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen dark:bg-surface-950 bg-surface-50">
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        className="relative hidden lg:flex flex-col border-r dark:border-white/5 border-black/5 dark:bg-surface-900/50 bg-white shrink-0"
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute bottom-4 -right-3 p-1 rounded-full dark:bg-surface-800 bg-white border dark:border-white/10 border-black/10 shadow-sm z-10"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </motion.aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 glass flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Logo size={22} />
          <span className="text-xs font-semibold px-2 py-0.5 rounded dark:bg-white/5 bg-black/5 dark:text-surface-400 text-surface-600">Admin</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <div className="relative w-60 h-full dark:bg-surface-900 bg-white shadow-xl">
              <SidebarContent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 overflow-auto lg:pt-0 pt-14">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 lg:p-8 max-w-7xl mx-auto"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
