import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../hooks/useWallet';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { WalletType } from '../../utils/walletUtils';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import MetaMaskIcon from '../../assets/wallets/metamask.svg';
import CoinbaseIcon from '../../assets/wallets/coinbase.svg';
import WalletConnectIcon from '../../assets/wallets/walletconnect.svg';

const WalletIcon: React.FC<{ walletType: WalletType }> = ({ walletType }) => {
  if (walletType === 'MetaMask') {
    return (
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-50">
        <img src={MetaMaskIcon} alt="MetaMask" className="w-6 h-6" />
      </div>
    );
  } else if (walletType === 'Coinbase') {
    return (
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50">
        <img src={CoinbaseIcon} alt="Coinbase Wallet" className="w-6 h-6" />
      </div>
    );
  } else if (walletType === 'WalletConnect') {
    return (
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50">
        <img src={WalletConnectIcon} alt="WalletConnect" className="w-6 h-6" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
      ?
    </div>
  );
};

const ConnectWallet: React.FC = () => {
  const { connect, connecting, availableWallets } = useWallet();
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  const handleConnect = async (walletType: WalletType) => {
    const connected = await connect(walletType);
    setShowOptions(false);
    if (connected) navigate('/');
  };

  return (
    <div className="w-full max-w-md px-4 sm:px-0">
      <Card className="text-center border border-gray-200 shadow-lg min-h-[320px] flex items-center justify-center w-full">
        {!showOptions ? (
          <div className="space-y-6 p-4 w-full">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 11V7C7 5.93913 7.42143 4.92172 8.17157 4.17157C8.92172 3.42143 9.93913 3 11 3H13C14.0609 3 15.0783 3.42143 15.8284 4.17157C16.5786 4.92172 17 5.93913 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Connect Your Wallet</h2>
            <p className="text-gray-600 px-4">
              Securely connect your wallet to access zkpay's payment management dashboard.
            </p>
            <Button
              onClick={() => setShowOptions(true)}
              className="w-full py-2.5"
              isLoading={connecting}
            >
              Connect Wallet
            </Button>
          </div>
        ) : (
          <div className="space-y-6 p-4 w-full">
            <h2 className="text-xl font-bold text-gray-900">Select a Wallet</h2>
            <div className="space-y-3">
              {availableWallets.length > 0 ? (
                availableWallets.map((wallet) => (
                  <button
                    key={wallet}
                    onClick={() => handleConnect(wallet)}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:border-indigo-200 cursor-pointer"
                    disabled={connecting}
                  >
                    <div className="flex items-center">
                      <WalletIcon walletType={wallet} />
                      <span className="ml-3 font-medium text-gray-900">{wallet}</span>
                    </div>
                    <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                  </button>
                ))
              ) : (
                <div className="text-center p-4">
                  <p className="text-gray-600 mb-4">No compatible wallets detected. Please install one of the following:</p>
                  <div className="space-y-3">
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="flex items-center">
                        <WalletIcon walletType="MetaMask" />
                        <span className="ml-3 font-medium text-gray-900">Install MetaMask</span>
                      </div>
                    </a>
                    <a
                      href="https://www.coinbase.com/wallet/downloads"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="flex items-center">
                        <WalletIcon walletType="Coinbase" />
                        <span className="ml-3 font-medium text-gray-900">Install Coinbase Wallet</span>
                      </div>
                    </a>
                    <a
                      href="https://walletconnect.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      <div className="flex items-center">
                        <WalletIcon walletType="WalletConnect" />
                        <span className="ml-3 font-medium text-gray-900">Use WalletConnect</span>
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowOptions(false)}
              className="text-sm text-gray-500 hover:text-indigo-600 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ConnectWallet;
