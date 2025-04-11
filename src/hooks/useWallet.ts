import { useContext } from "react";
import { WalletContext } from "../context/wallet/WalletContext";
import { WalletContextType } from "../context/wallet/walletTypes";

/**
 * Hook to access wallet context
 * @returns Wallet context with state and actions
 */
export const useWallet = (): WalletContextType => useContext(WalletContext);
