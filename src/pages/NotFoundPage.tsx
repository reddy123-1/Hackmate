import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="hero-glow" />
      <div className="hero-glow-2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
          className="text-8xl font-bold gradient-text mb-6"
        >
          404
        </motion.div>
        <h1 className="text-2xl font-bold dark:text-white text-surface-900 mb-3">Page Not Found</h1>
        <p className="dark:text-surface-400 text-surface-600 max-w-sm mx-auto mb-8 text-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/" className="btn-primary">
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <button onClick={() => window.history.back()} className="btn-secondary">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
