import { Address, Merchant } from "@zkpay/sdk";
import { WalletInfo, WalletType } from "../../utils/walletUtils";

export interface DefaultMerchantInfo {
  merchantAddress: Address;
  webhookUrl?: string;
  redirectUrl?: string;
}

export interface WalletContextState {
  walletInfo: WalletInfo | null;
  availableWallets: WalletType[];
  connecting: boolean;
  merchantInstance: Merchant | null;
}

export interface WalletContextActions {
  connect: (walletType: WalletType) => Promise<boolean>;
  disconnect: () => void;
  updateMerchantConfigs: (config: Partial<DefaultMerchantInfo>) => void;
}

export type WalletContextType = WalletContextState & WalletContextActions;
