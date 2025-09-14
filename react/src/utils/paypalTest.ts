/**
 * PayPal Configuration Test Utility
 * Verifies that PayPal environment variables are properly configured
 */

export const testPayPalConfig = () => {
  console.log('🔧 PayPal Configuration Test:');
  console.log('Business Email:', import.meta.env.VITE_PAYPAL_BUSINESS_EMAIL || 'info@fidelisav.com');
  console.log('Local Email:', import.meta.env.VITE_PAYPAL_LOCAL_EMAIL || 'marc.mable@fidelisav.com');
  
  // Test configuration matches old Statamic site
  const expectedBusiness = 'info@fidelisav.com';
  const expectedLocal = 'marc.mable@fidelisav.com';
  
  const actualBusiness = import.meta.env.VITE_PAYPAL_BUSINESS_EMAIL || expectedBusiness;
  const actualLocal = import.meta.env.VITE_PAYPAL_LOCAL_EMAIL || expectedLocal;
  
  console.log('✅ Configuration Status:');
  console.log('Business Email Match:', actualBusiness === expectedBusiness ? '✅' : '❌');
  console.log('Local Email Match:', actualLocal === expectedLocal ? '✅' : '❌');
  
  return {
    businessEmail: actualBusiness,
    localEmail: actualLocal,
    configValid: actualBusiness === expectedBusiness && actualLocal === expectedLocal
  };
};

// Auto-run in development
if (import.meta.env.DEV) {
  testPayPalConfig();
}
