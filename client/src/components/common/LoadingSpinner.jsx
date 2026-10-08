import React from 'react';

export const LoadingSpinner = ({ text = 'INITIALIZING SYSTEM...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-2 border-cyber-border rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-cyber-cyan border-r-cyber-cyan rounded-full animate-spin" />
      </div>
      <p className="font-mono text-xs text-cyber-cyan tracking-widest uppercase animate-pulse">
        {text}
      </p>
    </div>
  );
};

export default LoadingSpinner;
