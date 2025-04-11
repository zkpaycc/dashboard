interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    isCoinbaseWallet?: boolean;
    request: (request: {
      method: string;
      params?: Array<unknown>;
    }) => Promise<unknown>;
    on: (eventName: string, callback: (...args: unknown[]) => void) => void;
  };
}
