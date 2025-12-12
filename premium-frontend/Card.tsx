import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  noPadding = false,
  hoverEffect = false,
  ...props 
}) => {
  return (
    <motion.div
      className={`
        relative overflow-hidden
        bg-dark-800/60 backdrop-blur-xl
        border border-white/10
        rounded-3xl
        shadow-xl
        ${noPadding ? '' : 'p-6 md:p-8'}
        ${hoverEffect ? 'hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Subtle top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
      
      {children}
    </motion.div>
  );
};

export default Card;
