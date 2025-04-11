import { ethers, Signer } from "ethers";
import { createCoinbaseWalletSDK } from "@coinbase/wallet-sdk";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { WALLETCONNECT_ID } from "../constants";

export type WalletType = "MetaMask" | "WalletConnect" | "Coinbase" | null;

export interface WalletInfo {
  signer: Signer;
  address: string;
  walletType: WalletType;
}

export async function connectMetaMask(): Promise<WalletInfo | null> {
  if (!window.ethereum) return null;

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);

    if (accounts.length === 0) return null;

    const address = accounts[0];
    const signer = await provider.getSigner();

    return {
      signer,
      address,
      walletType: "MetaMask",
    };
  } catch (error) {
    console.error("Error connecting to MetaMask:", error);
    return null;
  }
}

export async function connectCoinbaseWallet(): Promise<WalletInfo | null> {
  try {
    // Initialize Coinbase Wallet SDK
    const coinbaseWallet = createCoinbaseWalletSDK({
      appName: "zkpay",
      appLogoUrl: "", // Optional: Add your app logo URL
    });

    // Create a provider
    const provider = coinbaseWallet.getProvider();

    // Request connection
    await provider.request({ method: "eth_requestAccounts" });

    const ethersProvider = new ethers.BrowserProvider(provider);
    const accounts = await ethersProvider.listAccounts();

    if (accounts.length === 0) return null;

    const signer = await ethersProvider.getSigner();
    const address = accounts[0].address;

    return {
      signer,
      address,
      walletType: "Coinbase",
    };
  } catch (error) {
    console.error("Error connecting to Coinbase Wallet:", error);
    return null;
  }
}

export async function connectWalletConnect(): Promise<WalletInfo | null> {
  try {
    const provider = await EthereumProvider.init({
      projectId: WALLETCONNECT_ID,
      // we only need personal_sign to verify owner of address, chain is not important
      chains: [1],
      showQrModal: true,
      methods: ["personal_sign"],
      events: ["chainChanged", "accountsChanged"],
    });

    await provider.enable();

    const ethersProvider = new ethers.BrowserProvider(provider);
    const accounts = await ethersProvider.listAccounts();

    if (accounts.length === 0) return null;

    const signer = await ethersProvider.getSigner();
    const address = accounts[0].address;

    return {
      signer,
      address,
      walletType: "WalletConnect",
    };
  } catch (error) {
    console.error("Error connecting to WalletConnect:", error);
    return null;
  }
}

export function detectWallets(): WalletType[] {
  const wallets: WalletType[] = [];

  if (window.ethereum && window.ethereum.isMetaMask) {
    wallets.push("MetaMask");
  }

  if (window.ethereum && window.ethereum.isCoinbaseWallet) {
    wallets.push("Coinbase");
  }

  // WalletConnect is always available since it’s cloud-based
  wallets.push("WalletConnect");

  return wallets;
}
