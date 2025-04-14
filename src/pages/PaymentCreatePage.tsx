import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useWallet } from '../hooks/useWallet';
import { useCreatePayment } from '../hooks/useCreatePayment';
import { Chain, sepolia } from 'viem/chains';
import { evmConfig } from "@zkpay/core";
import { Address, PaymentParams, chainMap, extractTokenMetadata } from '@zkpay/sdk';
import { isAddress } from 'ethers';
import {
  Cog6ToothIcon,
  ChevronDownIcon,
  ExclamationCircleIcon,
  ClipboardDocumentIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { DefaultMerchantInfo } from '../context/wallet/walletTypes';

const availableChains: Chain[] = evmConfig.chains.map(c => chainMap.get(c.chainId)).filter(c => c) as Chain[];

const PaymentCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { merchantInstance, walletInfo, updateMerchantConfigs } = useWallet();
  const { createPayment, loading, error: submitError } = useCreatePayment();
  const [formData, setFormData] = useState<PaymentParams>({
    chain: availableChains[0] || sepolia,
    tokenAddress: undefined,
    amount: '0.1',
    metadata: { referenceId: '' },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfigPopup, setShowConfigPopup] = useState(false);
  const [configData, setConfigData] = useState<DefaultMerchantInfo>({
    merchantAddress: walletInfo?.address as Address,
    webhookUrl: undefined,
    redirectUrl: undefined
  });
  const [copiedFields, setCopiedFields] = useState<Record<string, boolean>>({});
  const [validatingToken, setValidatingToken] = useState(false);

  useEffect(() => {
    if (merchantInstance && walletInfo) {
      const defaults = merchantInstance.getDefaultPaymentParams();
      setFormData((prev) => ({
        ...prev,
        webhookUrl: defaults.webhookUrl || undefined,
        redirectUrl: defaults.redirectUrl || undefined,
      }));

      const shouldShowPopup =
        walletInfo.address === defaults.merchantAddress &&
        !defaults.redirectUrl &&
        !defaults.webhookUrl;
      setShowConfigPopup(shouldShowPopup);
      setConfigData({
        merchantAddress: walletInfo.address as Address,
        webhookUrl: defaults.webhookUrl || undefined,
        redirectUrl: defaults.redirectUrl || undefined
      });
    }
  }, [merchantInstance, walletInfo]);

  const copyToClipboard = (text: string, field: string) => {
    if (!text || text === 'Not configured') return;

    navigator.clipboard.writeText(text);
    setCopiedFields({ ...copiedFields, [field]: true });
    setTimeout(() => {
      setCopiedFields((prev) => ({ ...prev, [field]: false }));
    }, 2000);
  };

  // Basic form validation (without token validation)
  const validateFormBasic = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0";
    }

    if (formData.tokenAddress && !isAddress(formData.tokenAddress)) {
      newErrors.tokenAddress = "Please enter a valid token address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate token address on-chain
  const validateTokenOnChain = async (): Promise<boolean> => {
    // If no token address or already has validation error, skip on-chain validation
    if (!formData.tokenAddress || errors.tokenAddress) {
      return !errors.tokenAddress;
    }

    setValidatingToken(true);
    try {
      const metadata = await extractTokenMetadata({
        chainId: formData.chain.id,
        tokenAddress: formData.tokenAddress,
      });

      if (!metadata) {
        setErrors(prev => ({
          ...prev,
          tokenAddress: "Token not found or not supported on this network"
        }));
        return false;
      }

      return true;
    } catch (error) {
      console.error("Token validation error:", error);
      setErrors(prev => ({
        ...prev,
        tokenAddress: "Failed to validate token on this network"
      }));
      return false;
    } finally {
      setValidatingToken(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // First, do basic validation
    if (!validateFormBasic()) {
      return;
    }

    // Then validate token on-chain if a token address is provided
    if (formData.tokenAddress) {
      const isTokenValid = await validateTokenOnChain();
      if (!isTokenValid) {
        return;
      }
    }

    const result = await createPayment(formData);
    if (result.success && result.payment) {
      navigate(`/channels/${result.payment.id}`);
    } else {
      setErrors((prev) => ({
        ...prev,
        submit: result.error || submitError || 'Failed to create payment.'
      }));
    }
  };

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAddress(configData.merchantAddress)) {
      setErrors((prev) => ({ ...prev, merchantAddress: 'Invalid address' }));
      return;
    }
    updateMerchantConfigs(configData);
    setShowConfigPopup(false);
  };

  const handleConfigSkip = () => {
    setShowConfigPopup(false);
  };

  const handleUpdateMerchantAddress = (newAddress: string) => {
    setConfigData((prev) => ({ ...prev, merchantAddress: newAddress as Address }));
    if (newAddress && !isAddress(newAddress)) {
      setErrors((prev) => ({ ...prev, merchantAddress: 'Invalid address' }));
    } else {
      setErrors((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { merchantAddress, ...rest } = prev;
        return rest;
      });
    }
  };

  const openConfigPopup = () => {
    setShowConfigPopup(true);
  };

  const filteredChains = availableChains.filter((chain) =>
    chain.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Component for copyable configuration fields
  const CopyableField = ({ value, fieldName, placeholder = 'Not configured' }: { value: string, fieldName: string, placeholder?: string }) => {
    const displayValue = value || placeholder;
    const isCopyable = value && value !== placeholder;

    return (
      <div
        className={`flex items-center justify-between w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-700 text-sm break-all group ${isCopyable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
        onClick={() => isCopyable && copyToClipboard(value, fieldName)}
        title={isCopyable ? "Click to copy" : ""}
      >
        <span className={value === placeholder ? 'text-gray-500 italic' : ''}>{displayValue}</span>
        {isCopyable && (
          <span className="ml-2 flex-shrink-0">
            {copiedFields[fieldName] ? (
              <CheckIcon className="h-4 w-4 text-green-500" />
            ) : (
              <ClipboardDocumentIcon className="h-4 w-4 text-gray-400 group-hover:text-indigo-500" />
            )}
          </span>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main content with conditional blur */}
        <div className={showConfigPopup ? 'blur-sm pointer-events-none' : ''}>
          <div className="mb-6 flex items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Create New Payment</h1>
              <p className="text-sm text-gray-500 mt-1">Generate a payment link to receive crypto</p>
            </div>
          </div>

          {/* Configuration Box */}
          <Card className="mb-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-lg font-medium text-gray-900">Merchant Configuration</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={openConfigPopup}
                className="flex items-center justify-center w-full sm:w-auto"
              >
                <Cog6ToothIcon className="h-4 w-4 mr-2" />
                Edit Configuration
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Address</label>
                <CopyableField
                  value={merchantInstance?.getDefaultPaymentParams().merchantAddress || ''}
                  fieldName="merchantAddress"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                <CopyableField
                  value={merchantInstance?.getDefaultPaymentParams().webhookUrl || ''}
                  fieldName="webhookUrl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Redirect URL</label>
                <CopyableField
                  value={merchantInstance?.getDefaultPaymentParams().redirectUrl || ''}
                  fieldName="redirectUrl"
                />
              </div>
            </div>
          </Card>

          {/* Payment Creation Form */}
          <Card className="border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chain Selection */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blockchain Network</label>
                  <div
                    className="w-full border border-gray-300 rounded-md px-3 py-2 cursor-pointer bg-white flex items-center justify-between"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <span>{formData.chain.name}</span>
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  {showDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                      <input
                        type="text"
                        placeholder="Search networks..."
                        className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none focus:ring-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      {filteredChains.map((chain) => (
                        <div
                          key={chain.id}
                          className="px-3 py-2 hover:bg-indigo-50 cursor-pointer"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, chain }));
                            setShowDropdown(false);
                            setSearchTerm('');
                          }}
                        >
                          {chain.name} (ID: {chain.id})
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="text"
                    value={formData.amount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                    className={`w-full border ${errors.amount ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="0.01"
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                      {errors.amount}
                    </p>
                  )}
                </div>

                {/* Token Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Token Address <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.tokenAddress || ''}
                    onChange={(e) => {
                      // Clear token address errors when the user edits the field
                      if (errors.tokenAddress) {
                        setErrors(prev => {
                          // eslint-disable-next-line @typescript-eslint/no-unused-vars
                          const { tokenAddress, ...rest } = prev;
                          return rest;
                        });
                      }
                      setFormData((prev) => ({ ...prev, tokenAddress: e.target.value as Address }))
                    }}
                    className={`w-full border ${errors.tokenAddress ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="0x..."
                  />
                  {errors.tokenAddress ? (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                      {errors.tokenAddress}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">
                      Leave empty for native token (ETH, MATIC, etc.)
                    </p>
                  )}
                </div>

                {/* Reference ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reference ID <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.metadata!.referenceId as string || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, metadata: { referenceId: e.target.value } }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., ORDER#123456"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Internal reference for tracking this payment (order ID, invoice number, etc.)
                  </p>
                </div>
              </div>

              {errors.submit && (
                <div className="p-4 bg-red-50 rounded-md border border-red-100 text-sm text-red-800 flex items-start">
                  <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{errors.submit}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => navigate('/')}
                  disabled={loading || validatingToken}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={loading || validatingToken}
                  className="w-full sm:w-auto"
                >
                  {validatingToken ? 'Validating Token...' : 'Create Payment'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Configuration Popup */}
        {showConfigPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Semi-transparent overlay */}
            <div
              className="absolute inset-0 bg-gray-800 bg-opacity-75"
              onClick={handleConfigSkip}
            ></div>
            {/* Popup content */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <Cog6ToothIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Merchant Configuration</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Set up your merchant details to streamline future payments.
                </p>
              </div>

              <form onSubmit={handleConfigSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Address</label>
                  <input
                    type="text"
                    value={configData.merchantAddress}
                    onChange={(e) => handleUpdateMerchantAddress(e.target.value)}
                    className={`w-full border ${errors.merchantAddress ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="0x..."
                  />
                  {errors.merchantAddress && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                      {errors.merchantAddress}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    The final recipient address where funds will be settled
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                  <input
                    type="text"
                    value={configData.webhookUrl || undefined}
                    onChange={(e) => setConfigData((prev) => ({ ...prev, webhookUrl: (e.target.value === '' ? undefined : e.target.value) }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://your-webhook-url.com"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Receive payment status updates via webhook
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Redirect URL</label>
                  <input
                    type="text"
                    value={configData.redirectUrl || undefined}
                    onChange={(e) => setConfigData((prev) => ({ ...prev, redirectUrl: (e.target.value === '' ? undefined : e.target.value) }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://your-redirect-url.com"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Where users will be redirected after payment
                  </p>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleConfigSkip}
                    className="w-24"
                  >
                    Skip
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-24"
                    disabled={!!errors.merchantAddress}
                  >
                    Save
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PaymentCreatePage;
