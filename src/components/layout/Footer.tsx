import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0 text-sm">
          <div className="flex items-center text-center sm:text-left">
            <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-gray-600">
              © {new Date().getFullYear()} zkpay. CC0 1.0 Universal – No rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="https://api.zkpay.cc/docs" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600 transition-colors duration-200">
              API Reference
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
