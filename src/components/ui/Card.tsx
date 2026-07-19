import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';

export const Card = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          'relative bg-[#0F0F0F]/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6 transition-all duration-300 hover:border-white/20 hover:bg-[#151515]/80 shadow-2xl overflow-hidden group',
          className
        )}
        {...props}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {children}
      </motion.div>
    );
  }
);
Card.displayName = 'Card';
