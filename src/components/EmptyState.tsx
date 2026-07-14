import { motion } from 'framer-motion';
import { FileQuestion } from 'lucide-react';

interface Props {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="p-4 rounded-2xl dark:bg-white/5 bg-black/5 mb-4">
        {icon ?? <FileQuestion className="h-8 w-8 dark:text-surface-500 text-surface-400" />}
      </div>
      <h3 className="text-lg font-semibold dark:text-white text-surface-900 mb-2">{title}</h3>
      <p className="text-sm dark:text-surface-400 text-surface-600 max-w-sm mb-6">{description}</p>
      {action}
    </motion.div>
  );
}
