import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border border-gray-100 transition-shadow duration-200 hover:shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export default Card;