import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';

export const Card = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={cn(
          'bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] relative overflow-hidden transition-all duration-300 hover:bg-slate-900/60 hover:border-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] group',
          className
        )}
        {...props}
      >
        {/* Subtle gradient glow effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="absolute -inset-24 bg-gradient-to-tr from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }
);
Card.displayName = 'Card';
