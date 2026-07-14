import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, Zap } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Hackathons', href: '/#hackathons' },
  { label: 'About Me', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
  { label: 'Admin', href: '/admin' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      const id = href.slice(2);
      if (location.pathname === '/') {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = href;
      }
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass shadow-lg shadow-black/5 dark:shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-purple-500 shadow-lg shadow-brand-500/20">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight dark:text-white text-surface-900 group-hover:text-brand-400 transition-colors">
                HackMate
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.href.replace('/#', '/'));
                return link.href.startsWith('/#') ? (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'text-brand-400 bg-brand-500/10'
                        : 'dark:text-surface-400 text-surface-600 hover:text-brand-400 dark:hover:bg-white/5 hover:bg-black/5'
                    }`}
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'text-brand-400 bg-brand-500/10'
                        : 'dark:text-surface-400 text-surface-600 hover:text-brand-400 dark:hover:bg-white/5 hover:bg-black/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggle}
                className="p-2 rounded-lg dark:text-surface-400 text-surface-600 dark:hover:text-white hover:text-surface-900 dark:hover:bg-white/5 hover:bg-black/5 transition-all"
                aria-label="Toggle theme"
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg dark:text-surface-400 text-surface-600"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 top-16 z-40 glass md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {navLinks.map((link) =>
                link.href.startsWith('/#') ? (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium dark:text-surface-300 text-surface-700 dark:hover:bg-white/5 hover:bg-black/5 transition-all"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="px-4 py-3 rounded-lg text-sm font-medium dark:text-surface-300 text-surface-700 dark:hover:bg-white/5 hover:bg-black/5 transition-all"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
