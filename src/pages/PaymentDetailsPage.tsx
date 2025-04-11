import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import {
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { PAYMENT_URL } from '../constants';
import { usePayment } from '../hooks/usePayment';
import { getChainConfig } from '@zkpay/core';
import { BlockChainTransaction, PaymentDetails } from '@zkpay/sdk';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import CopyableText from '../components/ui/CopyableText';
import { formatDate, formatAddress } from '../utils/formatters';

const PaymentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { payment, loading, error } = usePayment(id || '');

  const transactionCurrency = (payment: PaymentDetails, tx: BlockChainTransaction) => {
    if (tx.token.address === payment.tokenAddress) {
      return payment.currency
    }

    return tx.token.category;
  }

  const scanUrl = (payment: PaymentDetails, tx: BlockChainTransaction) => {
    const config = getChainConfig(payment.chainId);
    if (!config) return undefined;

    return `${config.explorer.url}/tx/${tx.hash}`;
  }

  const statusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Awaiting Payment';
      case 'partial':
        return 'Partially Paid';
      case 'received':
        return 'Payment Complete';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'partial':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'received':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <LoadingIndicator message="Loading payment details..." />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !payment) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <div className="text-center py-12">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {error ? 'Error Loading Payment' : 'Payment Not Found'}
              </h3>
              <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                {error || 'The requested payment could not be found. It may have been deleted or you may not have permission to view it.'}
              </p>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Payment Details</h1>
              <p className="text-sm text-gray-500 mt-1">View transaction information and status</p>
            </div>
          </div>
          <a
            href={`${PAYMENT_URL}${payment.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium border border-indigo-200 rounded-md px-3 py-1.5 hover:bg-indigo-50 transition-colors"
          >
            View Payment Page
            <ArrowTopRightOnSquareIcon className="ml-1.5 h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <Card className="border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center mb-2 gap-2">
                  <h2 className="text-lg font-medium text-gray-900">Payment ID</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(payment.status)} border`}>
                    {statusLabel(payment.status)}
                  </span>
                </div>
                <CopyableText text={payment.id} monospace={true} />
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Created</div>
                <div className="font-medium">{formatDate(payment.createdAt)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-4">Payment Information</h3>
                <dl className="space-y-6">
                  <div className="flex flex-col">
                    <dt className="text-sm font-medium text-gray-500 mb-1">Amount</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {payment.humanReadableAmount} {payment.currency}
                    </dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-sm font-medium text-gray-500 mb-1">Chain ID</dt>
                    <dd className="text-sm text-gray-900">{payment.chainId}</dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-sm font-medium text-gray-500 mb-1">Target Address</dt>
                    <CopyableText text={payment.targetAddress} monospace={true} />
                  </div>
                  {payment.tokenAddress && (
                    <div className="flex flex-col">
                      <dt className="text-sm font-medium text-gray-500 mb-1">Token Address</dt>
                      <CopyableText text={payment.tokenAddress} monospace={true} />
                    </div>
                  )}
                  {payment.referenceId && (
                    <div className="flex flex-col">
                      <dt className="text-sm font-medium text-gray-500 mb-1">Reference ID</dt>
                      <dd className="text-sm text-gray-900">{payment.referenceId}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h3 className="text-base font-medium text-gray-900 mb-4">Integration Details</h3>
                <dl className="space-y-6">
                  {payment.webhookUrl && (
                    <div className="flex flex-col">
                      <dt className="text-sm font-medium text-gray-500 mb-1">Webhook URL</dt>
                      <dd className="text-sm text-gray-900 break-all bg-gray-50 p-2 rounded border border-gray-100">
                        {payment.webhookUrl}
                      </dd>
                    </div>
                  )}
                  {payment.redirectUrl && (
                    <div className="flex flex-col">
                      <dt className="text-sm font-medium text-gray-500 mb-1">Redirect URL</dt>
                      <dd className="text-sm text-gray-900 break-all bg-gray-50 p-2 rounded border border-gray-100">
                        {payment.redirectUrl}
                      </dd>
                    </div>
                  )}
                  {!payment.webhookUrl && !payment.redirectUrl && (
                    <div className="text-sm text-gray-500 italic">No integration details configured</div>
                  )}
                </dl>
              </div>
            </div>
          </Card>
        </div>

        {payment.transactions.length > 0 && (
          <Card className="border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
              <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                {payment.transactions.length} {payment.transactions.length === 1 ? 'transaction' : 'transactions'}
              </div>
            </div>
            <div className="overflow-x-auto -mx-6 -mb-6">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hash</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payment.transactions.map((tx) => (
                      <tr key={tx.hash} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a
                            href={scanUrl(payment, tx)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-mono text-indigo-600 hover:text-indigo-800 flex items-center"
                          >
                            {formatAddress(tx.hash)}
                            <ArrowTopRightOnSquareIcon className="ml-1 h-3 w-3" />
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                          {formatAddress(tx.from)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                          {formatAddress(tx.to)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {tx.humanReadableAmount} <span className="text-gray-500">{transactionCurrency(payment, tx)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(new Date(tx.timestamp * 1000).toISOString())}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default PaymentDetailsPage;
