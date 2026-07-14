import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'danger' | 'default';
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  variant = 'default',
}: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md glass-card rounded-2xl p-6 dark:bg-surface-900 bg-white"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {variant === 'danger' && (
                  <div className="p-2 rounded-xl bg-red-500/10">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                )}
                <h3 className="text-lg font-semibold dark:text-white text-surface-900">{title}</h3>
              </div>
              <button onClick={onClose} className="p-1 rounded-lg dark:hover:bg-white/5 hover:bg-black/5">
                <X className="h-4 w-4 dark:text-surface-400 text-surface-600" />
              </button>
            </div>
            <p className="text-sm dark:text-surface-400 text-surface-600 mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={onClose} className="btn-secondary">Cancel</button>
              <button
                onClick={() => { onConfirm(); onClose(); }}
                className={variant === 'danger'
                  ? 'btn-primary !bg-gradient-to-r !from-red-600 !to-red-500 hover:!from-red-500 hover:!to-red-400'
                  : 'btn-primary'}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
