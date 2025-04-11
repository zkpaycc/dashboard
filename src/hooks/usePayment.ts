import { useState, useEffect, useRef } from "react";
import { useWallet } from "./useWallet";
import { PaymentDetails } from "@zkpay/sdk";

export const usePayment = (paymentId: string) => {
  const { merchantInstance } = useWallet();
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use refs to prevent duplicate requests and dependency issues
  const isFetchingRef = useRef(false);
  const merchantRef = useRef(merchantInstance);
  const paymentIdRef = useRef(paymentId);

  // Update refs when their values change
  useEffect(() => {
    merchantRef.current = merchantInstance;
  }, [merchantInstance]);

  useEffect(() => {
    paymentIdRef.current = paymentId;
  }, [paymentId]);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      const merchant = merchantRef.current;
      const currentPaymentId = paymentIdRef.current;

      if (!merchant || !currentPaymentId || isFetchingRef.current) {
        return;
      }

      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const paymentDetails = await merchant.getPayment(currentPaymentId);
        setPayment(paymentDetails as PaymentDetails);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Error fetching payment:", err);
        const errorMessage = `An unexpected error occurred: ${err.message}`;
        setError(errorMessage);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    };

    fetchPaymentDetails();
  }, [merchantInstance, paymentId]); // Dependencies trigger the effect, but we use refs inside

  return { payment, loading, error };
};
