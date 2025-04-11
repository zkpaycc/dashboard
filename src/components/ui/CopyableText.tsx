import React, { useState } from 'react';
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

interface CopyableTextProps {
  text: string;
  displayText?: string;
  label?: string;
  className?: string;
  monospace?: boolean;
}

const CopyableText: React.FC<CopyableTextProps> = ({
  text,
  displayText,
  label,
  className = '',
  monospace = false
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const textToDisplay = displayText || text;
  const fontClass = monospace ? 'font-mono' : '';

  return (
    <div className="flex flex-col">
      {label && <span className="text-sm font-medium text-gray-500 mb-1">{label}</span>}
      <div
        className={`flex items-center justify-between group ${className}`}
        onClick={handleCopy}
      >
        <span className={`text-sm ${fontClass} text-gray-900 break-all`}>{textToDisplay}</span>
        <button
          type="button"
          className="ml-2 text-gray-400 hover:text-indigo-600 transition-colors flex-shrink-0"
          title="Copy to clipboard"
        >
          {copied ? (
            <CheckIcon className="h-4 w-4 text-green-500" />
          ) : (
            <ClipboardDocumentIcon className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default CopyableText;
