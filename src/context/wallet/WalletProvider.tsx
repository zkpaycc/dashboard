import React, { useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { Address, Merchant } from '@zkpay/sdk';
import {
  WalletInfo,
  WalletType,
  connectMetaMask,
  connectCoinbaseWallet,
  connectWalletConnect,
  disconnectWalletConnect,
  detectWallets
} from '../../utils/walletUtils';
import { WalletContext } from './WalletContext';
import { DefaultMerchantInfo } from './walletTypes';

export const CONNECTED_WALLET_KEY = 'connectedWallet';

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletType[]>([]);
  const [connecting, setConnecting] = useState(false);
  const [merchantConfigs, setMerchantConfigs] = useState<DefaultMerchantInfo | undefined>(undefined);

  // Detect available wallets on component mount
  useEffect(() => {
    setAvailableWallets(detectWallets());
  }, []);

  // Try to reconnect on startup if there's a saved wallet
  useEffect(() => {
    const tryReconnect = async () => {
      const savedWallet = localStorage.getItem('connectedWallet');

      if (savedWallet) {
        try {
          console.log('Reconnecting wallet:', savedWallet);
          await connect(savedWallet as WalletType);
          // Don't handle redirects here - AuthRedirectHandler will take care of it
        } catch (error) {
          console.error('Failed to reconnect wallet:', error);
          localStorage.removeItem('connectedWallet');
        }
      }
    };

    tryReconnect();
  }, []);

  /**
   * Create a memoized merchant instance when wallet or configs change
   */
  const merchantInstance = useMemo(() => {
    if (!walletInfo?.address) return null;

    return new Merchant({
      merchantAddress: merchantConfigs?.merchantAddress || walletInfo.address as Address,
      signer: walletInfo.signer,
      webhookUrl: merchantConfigs?.webhookUrl,
      redirectUrl: merchantConfigs?.redirectUrl,
    });
  }, [
    walletInfo?.address,
    walletInfo?.signer,
    merchantConfigs?.merchantAddress,
    merchantConfigs?.webhookUrl,
    merchantConfigs?.redirectUrl
  ]);

  const connect = useCallback(async (walletType: WalletType): Promise<boolean> => {
    if (!walletType) return false;

    setConnecting(true);
    try {
      let info: WalletInfo | null = null;
      console.log('Connecting to wallet:', walletType);

      switch (walletType) {
        case 'MetaMask':
          info = await connectMetaMask();
          break;
        case 'Coinbase':
          info = await connectCoinbaseWallet();
          break;
        case 'WalletConnect':
          info = await connectWalletConnect();
          break;
        default:
          console.warn(`Unknown wallet type: ${walletType}`);
          return false;
      }

      if (info && info.address) {
        console.log('Wallet connected successfully:', info.address);
        setWalletInfo(info);
        localStorage.setItem(CONNECTED_WALLET_KEY, walletType);
        return true;
      }
      console.log('Wallet connection failed: No address returned');
      return false;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return false;
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    // Properly disconnect WalletConnect if it's the current wallet
    if (walletInfo?.walletType === 'WalletConnect') {
      disconnectWalletConnect();
    }

    setWalletInfo(null);
    setMerchantConfigs(undefined);
    localStorage.removeItem(CONNECTED_WALLET_KEY);
  }, [walletInfo?.walletType]);

  const updateMerchantConfigs = useCallback((config: Partial<DefaultMerchantInfo>) => {
    setMerchantConfigs(prevConfigs => {
      const defaults: DefaultMerchantInfo = prevConfigs || {
        merchantAddress: walletInfo?.address as Address
      };
      return { ...defaults, ...config };
    });
  }, [walletInfo?.address]);

  /**
   * Memoized context value to prevent unnecessary re-renders
   */
  const contextValue = useMemo(() => ({
    walletInfo,
    availableWallets,
    connecting,
    connect,
    disconnect,
    merchantInstance,
    updateMerchantConfigs,
  }), [
    walletInfo,
    availableWallets,
    connecting,
    connect,
    disconnect,
    merchantInstance,
    updateMerchantConfigs
  ]);

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};
