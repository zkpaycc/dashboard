import { createContext } from "react";
import { WalletContextType } from "./walletTypes";

const defaultContextValue: WalletContextType = {
  walletInfo: null,
  availableWallets: [],
  connecting: false,
  merchantInstance: null,
  connect: async () => false,
  disconnect: () => {},
  updateMerchantConfigs: () => {},
};

export const WalletContext =
  createContext<WalletContextType>(defaultContextValue);
