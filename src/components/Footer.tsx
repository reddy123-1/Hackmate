import { Link } from 'react-router-dom';
import { Code2, Globe, Heart } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="relative border-t dark:border-white/5 border-black/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Logo size={28} />
            </Link>
            <p className="dark:text-surface-400 text-surface-600 text-sm max-w-sm leading-relaxed">
              Connecting talented hackers with the perfect hackathon teams. Find your next adventure and build something amazing together.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold dark:text-white text-surface-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Hackathons', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`/#${item.toLowerCase()}`} className="text-sm dark:text-surface-400 text-surface-600 hover:text-brand-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold dark:text-white text-surface-900 mb-4">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg dark:bg-white/5 bg-black/5 dark:text-surface-400 text-surface-600 hover:text-brand-400 transition-all">
                <Code2 className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg dark:bg-white/5 bg-black/5 dark:text-surface-400 text-surface-600 hover:text-brand-400 transition-all">
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t dark:border-white/5 border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs dark:text-surface-500 text-surface-500">
            © {new Date().getFullYear()} HackerMate. All rights reserved.
          </p>
          <p className="text-xs dark:text-surface-500 text-surface-500 flex items-center gap-1">
            Built with <Heart className="h-3 w-3 text-red-400" /> for hackers
          </p>
        </div>
      </div>
    </footer>
  );
}
