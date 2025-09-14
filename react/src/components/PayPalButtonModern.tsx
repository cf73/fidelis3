/**
 * Modern PayPal Button Component using Official PayPal SDK
 * Fixes the "Things don't appear to be working" error from the legacy integration
 */

import React, { useState } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Link } from 'react-router-dom';

interface PayPalButtonModernProps {
  itemName: string;
  amount: number;
  shipping?: number;
  localOnly?: boolean;
  className?: string;
}

export const PayPalButtonModern: React.FC<PayPalButtonModernProps> = ({
  itemName,
  amount,
  shipping = 0,
  localOnly = false,
  className = ""
}) => {
  const [paypalError, setPaypalError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // PayPal configuration
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test';
  const environment = import.meta.env.VITE_PAYPAL_ENVIRONMENT || 'sandbox';
  
  // Calculate total amount including shipping
  const totalAmount = (amount + shipping).toFixed(2);

  // PayPal SDK options
  const initialOptions = {
    clientId: clientId,
    currency: 'USD',
    intent: 'capture',
    // Use sandbox for testing, production for live
    ...(environment === 'sandbox' && { 
      'data-client-token': 'sandbox_token',
      'enable-funding': 'venmo,paylater'
    })
  };

  // Handle order creation
  const createOrder = (data: any, actions: any) => {
    setIsProcessing(true);
    return actions.order.create({
      purchase_units: [
        {
          description: itemName,
          amount: {
            currency_code: 'USD',
            value: totalAmount,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: amount.toFixed(2)
              },
              ...(shipping > 0 && {
                shipping: {
                  currency_code: 'USD',
                  value: shipping.toFixed(2)
                }
              })
            }
          },
          items: [
            {
              name: itemName,
              unit_amount: {
                currency_code: 'USD',
                value: amount.toFixed(2)
              },
              quantity: '1',
              category: 'PHYSICAL_GOODS'
            }
          ]
        }
      ],
      application_context: {
        shipping_preference: localOnly ? 'NO_SHIPPING' : 'SET_PROVIDED_ADDRESS'
      }
    });
  };

  // Handle successful payment
  const onApprove = (data: any, actions: any) => {
    return actions.order.capture().then((details: any) => {
      setIsProcessing(false);
      console.log('✅ PayPal Transaction completed:', details);
      
      // Show success message
      alert(`Thank you ${details.payer.name.given_name}! Your payment for "${itemName}" has been processed successfully. You will receive a confirmation email shortly.`);
      
      // Here you could redirect to a success page or trigger additional actions
      // window.location.href = '/purchase-success';
    });
  };

  // Handle payment errors
  const onError = (err: any) => {
    setIsProcessing(false);
    console.error('❌ PayPal Error:', err);
    setPaypalError('Payment processing failed. Please try again or contact us directly.');
  };

  // Handle payment cancellation
  const onCancel = (data: any) => {
    setIsProcessing(false);
    console.log('Payment cancelled by user');
  };

  // Fallback if PayPal SDK fails to load or client ID is missing
  if (!clientId || clientId === 'test' || clientId === 'sandbox_client_id_here') {
    return (
      <div className={`paypal-fallback ${className}`}>
        {localOnly && (
          <p className="text-sm text-stone-600 mb-3">
            Available for local purchase only. No shipping charge is applied when you order.
          </p>
        )}
        
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-center">
          <p className="text-stone-700 mb-3">
            <strong>PayPal checkout is temporarily unavailable.</strong>
          </p>
          <p className="text-sm text-stone-600 mb-4">
            Please contact us directly to complete your purchase of "{itemName}" for ${totalAmount}.
          </p>
          <Link
            to={`/contact?subject=Purchase Inquiry: ${encodeURIComponent(itemName)}&message=I would like to purchase "${encodeURIComponent(itemName)}" for $${totalAmount}. Please let me know how to proceed with payment.`}
            className="inline-flex items-center justify-center px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-lg transition-colors duration-200 text-sm tracking-wide"
          >
            Contact for Purchase
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`paypal-modern ${className}`}>
      {localOnly && (
        <p className="text-sm text-stone-600 mb-3">
          Available for local purchase only. No shipping charge is applied when you order.
        </p>
      )}

      {paypalError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-700 text-sm">{paypalError}</p>
          <Link
            to={`/contact?subject=Payment Issue: ${encodeURIComponent(itemName)}&message=I encountered an error while trying to purchase "${encodeURIComponent(itemName)}" for $${totalAmount}. Please help me complete this purchase.`}
            className="text-red-600 hover:text-red-800 underline text-sm mt-2 inline-block"
          >
            Contact us for assistance
          </Link>
        </div>
      )}

      <PayPalScriptProvider options={initialOptions}>
        <div className="paypal-buttons-container">
          {isProcessing && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-stone-600 mt-2">Processing payment...</p>
            </div>
          )}
          
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            onCancel={onCancel}
            style={{
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'pay',
              height: 45
            }}
            disabled={isProcessing}
          />
        </div>
      </PayPalScriptProvider>

      {/* Fallback contact option */}
      <div className="mt-4 text-center">
        <p className="text-xs text-stone-500 mb-2">Having trouble with PayPal?</p>
        <Link
          to={`/contact?subject=Purchase Inquiry: ${encodeURIComponent(itemName)}&message=I would like to purchase "${encodeURIComponent(itemName)}" for $${totalAmount}. Please let me know alternative payment options.`}
          className="text-stone-600 hover:text-stone-800 underline text-sm"
        >
          Contact us directly
        </Link>
      </div>
    </div>
  );
};
