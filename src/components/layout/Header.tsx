import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import Button from '../ui/Button';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const { walletInfo, disconnect } = useWallet();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1
              className="text-2xl font-bold text-indigo-600 transition-colors duration-200 hover:text-indigo-700 cursor-pointer flex items-center"
              onClick={() => navigate('/')}
            >
              zkpay
            </h1>
          </div>

          {walletInfo && (
            <>
              {/* Desktop menu */}
              <div className="hidden sm:flex items-center space-x-4">
                <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {walletInfo.address.substring(0, 6)}...{walletInfo.address.substring(walletInfo.address.length - 4)}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={disconnect}>
                  Disconnect
                </Button>
              </div>

              {/* Mobile menu button */}
              <div className="sm:hidden">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
                  {mobileMenuOpen ? (
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {mobileMenuOpen && walletInfo && (
          <div className="sm:hidden mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pb-3">
              <div className="flex items-center bg-gray-50 px-3 py-2 rounded-md border border-gray-100">
                <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                <span className="text-sm font-medium text-gray-700">
                  {walletInfo.address.substring(0, 6)}...{walletInfo.address.substring(walletInfo.address.length - 4)}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={disconnect} className="w-full">
                Disconnect
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
