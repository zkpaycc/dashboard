import { useState, useEffect, useCallback, useRef } from "react";
import { useWallet } from "./useWallet";
import { GetChannelQuery, PaymentDetails } from "@zkpay/sdk";

export const usePayments = () => {
  const { merchantInstance } = useWallet();
  const [payments, setPayments] = useState<PaymentDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    order: "DESC" as "ASC" | "DESC",
  });

  // Use a ref to track if a fetch is in progress
  const isFetchingRef = useRef(false);
  // Use a ref to track the merchant instance to avoid dependency issues
  const merchantRef = useRef(merchantInstance);
  // Use a ref to track pagination state to avoid dependency issues
  const paginationRef = useRef(pagination);

  // Update refs when their values change
  useEffect(() => {
    merchantRef.current = merchantInstance;
  }, [merchantInstance]);

  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  const fetchPayments = useCallback(
    async (query: Partial<GetChannelQuery> = {}) => {
      const merchant = merchantRef.current;
      if (!merchant || isFetchingRef.current) return;

      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const currentPagination = paginationRef.current;
        const response = await merchant.queryPayments({
          page: query.page ?? currentPagination.page,
          limit: query.limit ?? currentPagination.limit,
          order: query.order ?? currentPagination.order,
        });

        setPayments(response.items || []);
        setPagination((prev) => ({
          ...prev,
          page: response.meta?.currentPage ?? prev.page,
          limit: response.meta?.itemsPerPage ?? prev.limit,
          total: response.meta?.totalItems ?? 0,
          totalPages: response.meta?.totalPages ?? 1,
        }));
      } catch (err) {
        console.error("Failed to fetch payments:", err);
        setError("Failed to load payment channels. Please try again.");
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [] // No dependencies to avoid recreation
  );

  const toggleOrder = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      order: prev.order === "ASC" ? "DESC" : "ASC",
    }));
  }, []);

  // Handle initial fetch when merchant becomes available
  useEffect(() => {
    if (merchantInstance && !isFetchingRef.current) {
      fetchPayments();
    }
  }, [merchantInstance, fetchPayments]);

  // Handle pagination changes
  useEffect(() => {
    if (merchantInstance && !isFetchingRef.current) {
      fetchPayments();
    }
  }, [
    pagination.page,
    pagination.limit,
    pagination.order,
    merchantInstance,
    fetchPayments,
  ]);

  // Manual refresh function
  const manualRefresh = useCallback(async () => {
    if (merchantRef.current && !isFetchingRef.current) {
      await fetchPayments();
    }
  }, [fetchPayments]);

  return {
    payments,
    loading,
    error,
    pagination,
    fetchPayments: manualRefresh,
    setPagination,
    toggleOrder,
  };
};
