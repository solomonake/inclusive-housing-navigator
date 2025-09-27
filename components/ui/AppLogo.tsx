import React from 'react';

interface AppLogoProps {
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="h-8 w-8 rounded-full bg-[hsl(var(--accent))] flex items-center justify-center">
        <span className="text-[hsl(var(--accent-contrast))] font-bold text-sm">IH</span>
      </div>
      <span className="text-xl font-bold text-[hsl(var(--fg))]">Inclusive Housing Navigator</span>
    </div>
  );
};
