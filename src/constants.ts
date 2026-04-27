// ─── Multi-Wallet Balancing (Same wallets as Whale-Signals & Airdrop-Pulse) ───
// Tokens are routed to specific wallets (A, B, C) to distribute load.

export type WalletKey = 'SOL' | 'EVM' | 'SUI' | 'BTC';

// Solana wallets
const SOL_A = 'AsKFa7SrCXgeExV6wTwPD1waX6W1sKCrfveaWQjWRe7T';
const SOL_B = 'AH9aZN3QyCfNeyxDQZwvk9KeiKSBGx6ZShMZpEmXxWH1';
const SOL_C = 'DZSowZNgwgExUsdJyG6fhNN2J4A4uiLVc8tvo8M6EoLe';

// EVM wallets (same address works on ETH, BNB, Polygon, Arbitrum, Avalanche, Base, Optimism)
const EVM_A = '0xB86065255D3e94aCAD3cF627092EaC745b6aB81D';
const EVM_B = '0xEb85043b4b3f08964C0fDF00d76Ca354Aed467C8';
const EVM_C = '0x6C9cA01cdC692fE92f2F6b3ad33d2C4034c9B32c';

// SUI wallets
const SUI_A = '0xe1adce87dd8dee1d6755187a7e4f9efe52c16785c0c063cadecb45770283412a';
const SUI_B = '0x4b9a9e387cde9edcee4e47ed4a42190f90a0853572bb0f1a1921805851e2272e';

// Bitcoin wallet
const BTC_1 = 'bc1qhq3vkydx43rtjlkuxk2ag53gac4lhnugweu870';

// Token → Wallet routing map (blue-chips, stablecoins & memes — balanced across wallets)
export const TOKEN_WALLET_MAP: Record<string, string> = {
  // Solana → SOL_A (native + memes)
  SOL: SOL_A,
  BONK: SOL_A,
  WIF: SOL_A,
  // Solana stablecoins → SOL_B
  'USDC-SOL': SOL_B,
  'USDT-SOL': SOL_B,
  // EVM blue-chips → EVM_A
  ETH: EVM_A,
  BNB: EVM_A,
  MATIC: EVM_A,
  AVAX: EVM_A,
  ARB: EVM_A,
  // EVM stablecoins & DeFi → EVM_B
  'USDC-EVM': EVM_B,
  'USDT-EVM': EVM_B,
  USDC: EVM_B,
  USDT: EVM_B,
  LINK: EVM_B,
  // EVM memes & stable → EVM_C
  DAI: EVM_C,
  PEPE: EVM_C,
  SHIB: EVM_C,
  // SUI
  SUI: SUI_A,
  'USDC-SUI': SUI_B,
  // Bitcoin
  BTC: BTC_1,
};

// Fallback: get wallet by chain (for generic lookups)
export const CHAIN_WALLETS: Record<WalletKey, string[]> = {
  SOL: [SOL_A, SOL_B, SOL_C],
  EVM: [EVM_A, EVM_B, EVM_C],
  SUI: [SUI_A, SUI_B],
  BTC: [BTC_1],
};

/**
 * Get the correct wallet address for a given token symbol.
 * Falls back to first wallet of the chain if token not in map.
 */
export function getWalletForToken(symbol: string, chain: WalletKey): string {
  // Try exact match first (e.g., 'USDC-SOL')
  if (TOKEN_WALLET_MAP[symbol]) return TOKEN_WALLET_MAP[symbol];
  // Try with chain suffix for stablecoins
  const withChain = `${symbol}-${chain}`;
  if (TOKEN_WALLET_MAP[withChain]) return TOKEN_WALLET_MAP[withChain];
  // Fallback to first wallet of the chain
  return CHAIN_WALLETS[chain][0];
}

// Legacy export for backward compatibility with BookingModal
export const PLATFORM_WALLETS = {
  DEPOSIT: {
    EVM: EVM_A,
    BTC: BTC_1,
    SOL: SOL_A,
    SUI: SUI_A,
  },
  FULL_PAYMENT: {
    EVM: EVM_B,
    BTC: BTC_1,
    SOL: SOL_B,
    SUI: SUI_B,
  }
};
