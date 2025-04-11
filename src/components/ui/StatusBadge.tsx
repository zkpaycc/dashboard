import React from 'react';
import { PaymentStatus } from '../../types/payment';

interface StatusBadgeProps {
  status: PaymentStatus;
}

/**
 * Renders a badge indicating payment status
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const baseClasses = "px-2.5 py-1 rounded-full text-xs font-medium";

  switch (status) {
    case 'active':
      return <span className={`${baseClasses} bg-indigo-100 text-indigo-700 border border-indigo-200`}>Active</span>;
    case 'partial':
      return <span className={`${baseClasses} bg-amber-100 text-amber-700 border border-amber-200`}>Partial</span>;
    case 'received':
      return <span className={`${baseClasses} bg-green-100 text-green-700 border border-green-200`}>Completed</span>;
    default:
      return <span className={`${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`}>Pending</span>;
  }
};

export default StatusBadge;
