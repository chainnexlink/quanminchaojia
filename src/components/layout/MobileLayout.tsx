import { motion } from 'framer-motion';
import { BottomNav } from '../navigation/BottomNav';
import { ReactNode } from 'react';

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="w-full min-h-screen bg-slate-900 relative">
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="pb-20"
        >
          {children}
        </motion.main>
        <BottomNav />
      </div>
    </div>
  );
}
