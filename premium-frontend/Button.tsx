import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  icon, 
  children, 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  
  const baseStyles = "relative inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 focus:outline-none overflow-hidden group";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_20px_rgba(107,70,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] border border-transparent",
    secondary: "bg-white text-dark-900 hover:bg-gray-100 shadow-lg",
    outline: "bg-transparent border border-white/20 text-white hover:border-white/50 hover:bg-white/5 backdrop-blur-sm",
    ghost: "bg-transparent text-gray-300 hover:text-white hover:bg-white/5",
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-lg",
    xl: "h-16 px-10 text-xl font-bold",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Glossy sheen effect for primary buttons */}
      {variant === 'primary' && (
        <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      
      <span className="relative flex items-center gap-3 z-10">
        {icon && <span className="text-current">{icon}</span>}
        {children}
      </span>
    </motion.button>
  );
};

export default Button;
