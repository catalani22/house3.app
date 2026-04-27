export const PLATFORM_WALLETS = {
  // Pre-reservation (10%)
  DEPOSIT: {
    EVM: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', // Replace with real admin wallet
    BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', // Replace with real admin wallet
    SOL: '7xKXv2bdRQ5Sht9zS5Vq969U5Z9zS5Vq969U5Z9zS5Vq', // Replace with real admin wallet
  },
  // Full Reservation (90%) - Used if owner doesn't have a wallet
  FULL_PAYMENT: {
    EVM: '0x1234567890123456789012345678901234567890', // Replace with real admin wallet
    BTC: 'bc1q...full', // Replace with real admin wallet
    SOL: 'Sol...full', // Replace with real admin wallet
  }
};
