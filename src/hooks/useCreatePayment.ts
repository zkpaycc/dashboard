import { useState, useCallback } from "react";
import { useWallet } from "./useWallet";
import { PaymentParams } from "@zkpay/sdk";
import { isAddress } from "ethers";

export const useCreatePayment = () => {
  const { merchantInstance } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = useCallback(
    async (params: PaymentParams) => {
      if (!merchantInstance) {
        const errorMsg = "Merchant instance is missing.";
        setError(errorMsg);
        return { success: false, error: errorMsg, payment: null };
      }

      // Validate params
      const validationErrors: Record<string, string> = {};
      if (
        !params.amount ||
        isNaN(Number(params.amount)) ||
        Number(params.amount) <= 0
      ) {
        validationErrors.amount = "Please enter a valid amount";
      }
      if (params.tokenAddress && !isAddress(params.tokenAddress)) {
        validationErrors.tokenAddress = "Please enter a valid Ethereum address";
      }
      if (Object.keys(validationErrors).length > 0) {
        const errorMsg = Object.values(validationErrors).join("; ");
        setError(errorMsg);
        return { success: false, error: errorMsg, payment: null };
      }

      setLoading(true);
      setError(null);

      try {
        const payment = await merchantInstance.createPayment(params);
        return { success: true, error: null, payment };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Error creating payment:", err);

        // Extract the most meaningful error message
        let errorMessage;
        if (err.message) {
          // Standard error object
          errorMessage = err.message;
        } else {
          // Fallback for unknown error format
          errorMessage =
            "An unexpected error occurred while creating the payment";
        }

        setError(errorMessage);
        return { success: false, error: errorMessage, payment: null };
      } finally {
        setLoading(false);
      }
    },
    [merchantInstance]
  );

  return { createPayment, loading, error, setError };
};
