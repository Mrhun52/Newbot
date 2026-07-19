const fs = require('fs');

const buttonCode = `import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-white text-black hover:bg-neutral-200 active:bg-neutral-300 font-semibold',
      secondary: 'bg-neutral-800 text-neutral-100 hover:bg-neutral-700 active:bg-neutral-600',
      danger: 'bg-red-500/10 text-red-500 hover:bg-red-500/20 active:bg-red-500/30',
      ghost: 'bg-transparent text-neutral-400 hover:text-white hover:bg-neutral-800/50',
      glass: 'bg-neutral-900/50 backdrop-blur-md border border-neutral-800 text-white hover:bg-neutral-800/50',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-lg',
      md: 'px-4 py-2 rounded-xl',
      lg: 'px-6 py-3 text-lg rounded-xl',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.96 }}
        className={cn(
          'relative flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
`;

const inputCode = `import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            'w-full bg-[#0A0A0A] border border-neutral-800 rounded-xl px-4 py-2.5 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 focus:border-neutral-500 transition-all',
            error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
`;

fs.writeFileSync('src/components/ui/Button.tsx', buttonCode);
fs.writeFileSync('src/components/ui/Input.tsx', inputCode);
