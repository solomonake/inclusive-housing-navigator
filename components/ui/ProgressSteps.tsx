import React from 'react';

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ 
  currentStep, 
  totalSteps, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`} role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        
        return (
          <div
            key={stepNumber}
            className={`w-3 h-3 rounded-full transition-colors ${
              isActive 
                ? 'bg-[hsl(var(--accent))]' 
                : 'bg-[hsl(var(--muted))]'
            }`}
            aria-current={stepNumber === currentStep ? 'step' : undefined}
            aria-label={`Step ${stepNumber} of ${totalSteps}`}
          />
        );
      })}
    </div>
  );
};
