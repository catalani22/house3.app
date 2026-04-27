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

// ─── Source Platform Token Acceptance ──────────────────────────────────────────
// CRITICAL: For property reservations, we can ONLY accept tokens that the source
// platform accepts. Otherwise we cannot immediately forward-book on their platform.
// This map defines which tokens each source platform supports for payment.

export type SourcePlatform =
  | 'Travala'
  | 'LuxuryEstates'
  | 'CryptoLuxe'
  | 'JamesEdition'
  | 'Propy'
  | 'CryptoCribs'
  | 'OwnerDirect';

export interface SourcePlatformConfig {
  name: string;
  acceptedTokens: string[];
  chains: WalletKey[];
  description: string;
}

// Each source platform's accepted tokens — ONLY these are offered to the guest
export const SOURCE_PLATFORM_TOKENS: Record<SourcePlatform, SourcePlatformConfig> = {
  Travala: {
    name: 'Travala',
    acceptedTokens: ['BTC', 'ETH', 'SOL', 'USDC', 'USDT', 'BNB', 'AVAX', 'MATIC', 'DAI', 'LINK', 'SUI'],
    chains: ['BTC', 'EVM', 'SOL', 'SUI'],
    description: 'Major crypto travel platform — broad token acceptance',
  },
  LuxuryEstates: {
    name: 'LuxuryEstates',
    acceptedTokens: ['BTC', 'ETH', 'USDC', 'USDT'],
    chains: ['BTC', 'EVM'],
    description: 'Ultra-premium real estate — conservative token set',
  },
  CryptoLuxe: {
    name: 'CryptoLuxe',
    acceptedTokens: ['ETH', 'BTC', 'USDC', 'USDT', 'SOL', 'DAI'],
    chains: ['BTC', 'EVM', 'SOL'],
    description: 'Luxury crypto-native vacation rentals',
  },
  JamesEdition: {
    name: 'JamesEdition',
    acceptedTokens: ['BTC', 'ETH', 'USDC', 'USDT'],
    chains: ['BTC', 'EVM'],
    description: 'Ultra-luxury marketplace — blue-chips & stablecoins only',
  },
  Propy: {
    name: 'Propy',
    acceptedTokens: ['ETH', 'USDC', 'USDT', 'BTC'],
    chains: ['BTC', 'EVM'],
    description: 'Blockchain real estate platform',
  },
  CryptoCribs: {
    name: 'CryptoCribs',
    acceptedTokens: ['BTC', 'ETH', 'SOL', 'USDC', 'USDT', 'AVAX', 'BNB', 'MATIC', 'SUI', 'ARB'],
    chains: ['BTC', 'EVM', 'SOL', 'SUI'],
    description: 'Web3-native short-term rental platform — wide acceptance',
  },
  OwnerDirect: {
    name: 'Owner Direct',
    acceptedTokens: ['BTC', 'ETH', 'SOL', 'USDC', 'USDT', 'SUI', 'BNB', 'AVAX', 'MATIC', 'DAI', 'LINK', 'ARB'],
    chains: ['BTC', 'EVM', 'SOL', 'SUI'],
    description: 'Owner-listed properties — house3 admin manages, accepts broad tokens',
  },
};

// SAFE FALLBACK: If source platform is unknown, only stablecoins (zero volatility risk)
const SAFE_FALLBACK_TOKENS = ['USDC', 'USDT', 'DAI'];
const SAFE_FALLBACK_CHAINS: WalletKey[] = ['EVM'];

/**
 * Get the list of accepted payment tokens for a property based on its source platform.
 * NEVER offers tokens that the source platform won't accept.
 */
export function getAcceptedTokensForProperty(sourcePlatform?: string): {
  tokens: string[];
  chains: WalletKey[];
} {
  if (!sourcePlatform) {
    return { tokens: SAFE_FALLBACK_TOKENS, chains: SAFE_FALLBACK_CHAINS };
  }

  const config = SOURCE_PLATFORM_TOKENS[sourcePlatform as SourcePlatform];
  if (!config) {
    return { tokens: SAFE_FALLBACK_TOKENS, chains: SAFE_FALLBACK_CHAINS };
  }

  return { tokens: config.acceptedTokens, chains: config.chains };
}
