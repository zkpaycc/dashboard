import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useWallet } from '../hooks/useWallet';
import { usePayments } from '../hooks/usePayments';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import Pagination from '../components/ui/Pagination';
import StatusBadge from '../components/ui/StatusBadge';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import ErrorMessage from '../components/ui/ErrorMessage';
import { formatDate, formatAddress } from '../utils/formatters';
import { PaymentStatus } from '../types/payment';

const IndexPage: React.FC = () => {
  const navigate = useNavigate();
  const { walletInfo } = useWallet();
  const {
    payments,
    loading,
    error,
    pagination,
    fetchPayments: refreshPayments,
    setPagination,
    toggleOrder,
  } = usePayments();

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleRowClick = (paymentId: string) => {
    navigate(`/channels/${paymentId}`);
  };

  if (!walletInfo) {
    return <Layout>Not connected</Layout>;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Payment Channels</h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage all payment activities
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/create-channel')}
              className="shadow-sm flex items-center justify-center"
            >
              <PlusIcon className="h-4 w-4 mr-1.5" />
              Create Channel
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={refreshPayments}
              disabled={loading}
              className="shadow-sm flex items-center justify-center"
            >
              <ArrowPathIcon
                className={`h-4 w-4 mr-1.5 ${loading ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              <span>{loading ? 'Refreshing' : 'Refresh'}</span>
            </Button>
          </div>
        </div>

        {/* Error Handling */}
        <ErrorMessage message={error} className="mb-6" />

        {/* Loading State */}
        {loading && payments.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 rounded-lg bg-white border border-gray-100 shadow-sm">
            <LoadingIndicator message="Loading payment data..." />
          </div>
        )}

        {/* Empty State */}
        {!loading && payments.length === 0 && (
          <Card className="text-center py-16 border border-gray-200">
            <svg
              className="mx-auto h-16 w-16 text-indigo-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No payments found</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              Get started by creating your first payment channel to begin accepting cryptocurrency payments.
            </p>
          </Card>
        )}

        {/* Payments Table - Mobile Responsive */}
        {payments.length > 0 && (
          <>
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white">
              {/* Mobile View */}
              <div className="block sm:hidden">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(payment.id)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium text-indigo-600 font-mono">
                        {formatAddress(payment.id)}
                      </div>
                      <StatusBadge status={payment.status as PaymentStatus} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-500">Amount:</div>
                      <div className="font-medium text-gray-900">
                        {payment.humanReadableAmount} {payment.currency}
                      </div>
                      <div className="text-gray-500">Chain:</div>
                      <div>{payment.chainId}</div>
                      <div className="text-gray-500">Created:</div>
                      <div>{formatDate(payment.createdAt)}</div>
                      {payment.referenceId && (
                        <>
                          <div className="text-gray-500">Reference:</div>
                          <div className="truncate">{payment.referenceId}</div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Payment ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Chain
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Reference
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150 group"
                        onClick={toggleOrder}
                      >
                        <div className="flex items-center">
                          <span>Created At</span>
                          <span className="ml-1.5 flex flex-col items-center">
                            <ChevronUpIcon
                              className={`h-3 w-3 ${pagination.order === 'ASC' ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}`}
                            />
                            <ChevronDownIcon
                              className={`h-3 w-3 ${pagination.order === 'DESC' ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'}`}
                            />
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                        onClick={() => handleRowClick(payment.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-indigo-600 font-mono">
                            {formatAddress(payment.id)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700 font-medium">{payment.chainId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.humanReadableAmount}{' '}
                            <span className="text-gray-500">{payment.currency}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700 max-w-[120px] truncate">
                            {payment.referenceId || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={payment.status as PaymentStatus} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(payment.createdAt)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-6">
              <Pagination
                pageCount={pagination.totalPages}
                currentPage={pagination.page}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default IndexPage;
