import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  avalanche,
  bsc,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import React, { useMemo } from 'react';

// Import Solana wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

// ─── EVM Config (RainbowKit + wagmi) ─────────────────────────────────────────
const evmConfig = getDefaultConfig({
  appName: 'house3.app',
  projectId: 'house3_walletconnect_v2',
  chains: [mainnet, polygon, optimism, arbitrum, base, avalanche, bsc],
});

const queryClient = new QueryClient();

// ─── Solana Config ───────────────────────────────────────────────────────────
const SOLANA_ENDPOINT = clusterApiUrl('mainnet-beta');

// ─── Unified Multi-Chain Provider ─────────────────────────────────────────────
export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  // Solana wallets
  const solanaWallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ], []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* EVM Layer */}
      <WagmiProvider config={evmConfig}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#D4AF37',
          accentColorForeground: 'black',
          borderRadius: 'large',
          fontStack: 'system',
          overlayBlur: 'small',
        })}>
          {/* Solana Layer */}
          <ConnectionProvider endpoint={SOLANA_ENDPOINT}>
            <SolanaWalletProvider wallets={solanaWallets} autoConnect>
              <WalletModalProvider>
                {children}
              </WalletModalProvider>
            </SolanaWalletProvider>
          </ConnectionProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};
