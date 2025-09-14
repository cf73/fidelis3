/**
 * PayPal Buy Now Button Component
 * Integrates with PayPal's standard checkout using the same configuration as the old Statamic site
 */

import React from 'react';
import { testPayPalConfig } from '../utils/paypalTest';

interface PayPalButtonProps {
  itemName: string;
  amount: number;
  shipping?: number;
  localOnly?: boolean;
  className?: string;
}

export const PayPalButton: React.FC<PayPalButtonProps> = ({
  itemName,
  amount,
  shipping = 0,
  localOnly = false,
  className = ""
}) => {
  // Use the same recipient emails as the old Statamic site
  const businessEmail = localOnly 
    ? import.meta.env.VITE_PAYPAL_LOCAL_EMAIL || 'marc.mable@fidelisav.com'
    : import.meta.env.VITE_PAYPAL_BUSINESS_EMAIL || 'info@fidelisav.com';

  const handleSubmit = (e: React.FormEvent) => {
    // Form will submit to PayPal - no need to prevent default
    const config = testPayPalConfig();
    console.log('PayPal purchase initiated:', {
      item: itemName,
      amount,
      shipping,
      recipient: businessEmail,
      configValid: config.configValid
    });
  };

  return (
    <div className={`paypal-button ${className}`}>
      {localOnly && (
        <p className="text-sm text-stone-600 mb-3">
          Available for local purchase only. No shipping charge is applied when you order.
        </p>
      )}
      
      <form 
        action="https://www.paypal.com/cgi-bin/webscr" 
        method="post" 
        target="_top"
        onSubmit={handleSubmit}
        className="inline-block"
      >
        {/* PayPal Standard Checkout Configuration */}
        <input type="hidden" name="cmd" value="_xclick" />
        <input type="hidden" name="business" value={businessEmail} />
        <input type="hidden" name="lc" value="US" />
        <input type="hidden" name="item_name" value={itemName} />
        <input type="hidden" name="amount" value={amount.toString()} />
        <input type="hidden" name="currency_code" value="USD" />
        <input type="hidden" name="button_subtype" value="services" />
        <input type="hidden" name="no_note" value="0" />
        <input type="hidden" name="shipping" value={shipping.toString()} />
        <input type="hidden" name="bn" value="PP-BuyNowBF:btn_buynowCC_LG.gif:NonHostedGuest" />
        
        {/* Custom styled button instead of PayPal's default image */}
        <button
          type="submit"
          className="inline-flex items-center justify-center px-8 py-3 bg-[#0070ba] hover:bg-[#005ea6] text-white font-medium rounded-lg transition-colors duration-200 text-sm tracking-wide"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a9.124 9.124 0 0 1-.414 2.68c-.626 2.042-1.86 3.131-3.708 3.131H14.27c-.524 0-.968.382-1.05.9L12.583 18.4c-.082.518-.526.9-1.05.9H9.317c-.524 0-.968-.382-1.05-.9L6.75 10.797c-.082-.518.344-.9.868-.9h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437.292-1.867-.002-3.137-1.012-4.287C16.408.543 14.4 0 11.83 0H4.37c-.524 0-.972.382-1.054.9L.209 20.437a.641.641 0 0 0 .633.74h4.606c.524 0 .968-.382 1.05-.9l1.12-7.106c.082-.518.526-.9 1.05-.9h2.19c4.298 0 7.664-1.747 8.647-6.797z"/>
          </svg>
          Buy Now with PayPal
        </button>
        
        {/* PayPal tracking pixel */}
        <img 
          alt="" 
          border={0} 
          src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" 
          width="1" 
          height="1"
          className="hidden"
        />
      </form>
    </div>
  );
};
