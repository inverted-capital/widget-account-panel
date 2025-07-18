import React, { useState } from 'react'
import { Wallet, CreditCard, Landmark, Plus } from 'lucide-react'
import AddPaymentModal from './modals/AddPaymentModal.tsx'

import type { PaymentMethod } from '../types/account.ts'

interface PaymentSectionProps {
  paymentMethods: PaymentMethod[]
  setPaymentMethods: React.Dispatch<React.SetStateAction<PaymentMethod[]>>
  skeleton?: boolean
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  paymentMethods,
  setPaymentMethods,
  skeleton
}) => {
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false)
  if (skeleton) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }
  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'ethereum':
        return <Wallet className="text-purple-600" size={24} />
      case 'wise':
        return <CreditCard className="text-green-600" size={24} />
      case 'bank':
        return <Landmark className="text-blue-600" size={24} />
      default:
        return <CreditCard className="text-gray-600" size={24} />
    }
  }

  const togglePaymentConnection = (id: string) => {
    setPaymentMethods((methods) =>
      methods.map((method) =>
        method.id === id
          ? { ...method, isConnected: !method.isConnected }
          : method
      )
    )
  }

  const handleAddPayment = (type: string, value: string) => {
    const newPayment = {
      id: `${type}${Date.now()}`,
      type,
      name:
        type === 'ethereum'
          ? 'Ethereum Wallet'
          : type === 'wise'
            ? 'Wise Account'
            : 'Bank Account',
      value,
      isConnected: true
    }

    setPaymentMethods([...paymentMethods, newPayment])
    setShowAddPaymentModal(false)
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 transition-all duration-300 hover:shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Payment Methods</h2>
          <button
            onClick={() => setShowAddPaymentModal(true)}
            className="px-3 py-1.5 bg-blue-500 text-white rounded flex items-center text-sm hover:bg-blue-600 transition-colors"
          >
            <Plus size={14} className="mr-1" />
            Add Payment Method
          </button>
        </div>

        {paymentMethods && paymentMethods.length > 0 ? (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center">
                    {getPaymentIcon(method.type)}
                    <div className="ml-4">
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-gray-600 font-mono">
                        {method.value}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => togglePaymentConnection(method.id)}
                      className={`px-3 py-1.5 rounded text-sm transition-colors ${
                        method.isConnected
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {method.isConnected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Wallet size={32} className="mx-auto mb-2 text-gray-300" />
            <p>No payment methods connected yet.</p>
            <p className="text-sm">Add a payment method to get started.</p>
          </div>
        )}
      </div>
      <AddPaymentModal
        show={showAddPaymentModal}
        onAdd={handleAddPayment}
        onClose={() => setShowAddPaymentModal(false)}
      />
    </>
  )
}

export default PaymentSection
