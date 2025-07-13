import React from 'react';

const Badge = React.forwardRef(({ 
  className = '', 
  variant = 'default', 
  children, 
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  
  const variants = {
    default: 'border-transparent bg-primary-500 text-white hover:bg-primary-600',
    secondary: 'border-transparent bg-stone-100 text-stone-800 hover:bg-stone-200',
    destructive: 'border-transparent bg-red-500 text-white hover:bg-red-600',
    outline: 'text-foreground',
  };
  
  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});
Badge.displayName = 'Badge';

export { Badge };