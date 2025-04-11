import React from 'react';
import Layout from '../components/layout/Layout';
import ConnectWallet from '../components/wallet/ConnectWallet';

const WelcomePage: React.FC = () => {
  return (
    <Layout>
      <div className="py-16 sm:py-24 flex items-center justify-center min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-10">
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect your <strong>operation wallet</strong> to view and manage your payment channels. This is not your merchant wallet, and it will not be used for any fund-related actions.
            </p>
          </div>
          <div className="flex justify-center">
            <ConnectWallet />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WelcomePage;
