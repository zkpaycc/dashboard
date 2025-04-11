import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface ErrorMessageProps {
  message: string | null;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`p-4 bg-red-50 rounded-md border border-red-100 text-sm text-red-800 flex items-start ${className}`}>
      <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;
