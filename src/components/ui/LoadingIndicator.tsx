import React from 'react';

interface LoadingIndicatorProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Loading...',
  size = 'md',
  fullPage = false
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-indigo-500 ${sizeClasses[size]}`}></div>
      {message && <p className="mt-4 text-sm font-medium text-gray-600">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingIndicator;
