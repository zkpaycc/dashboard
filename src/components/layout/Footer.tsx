import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0 text-sm">
          <div className="flex items-center text-center sm:text-left">
            <p className="text-gray-600">
              © {new Date().getFullYear()} zkpay. CC0 1.0 Universal – No rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="https://github.com/zkpaycc/dashboard" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">
              Github
            </a>
            <a href="mailto:team@zkpay.cc" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
