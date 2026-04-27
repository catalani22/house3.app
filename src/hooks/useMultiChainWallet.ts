import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther, parseUnits } from 'viem';
import { useWallet as useSolanaWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletKey } from '../constants';

export interface MultiChainWalletState {
  // Connection status per chain
  evm: {
    connected: boolean;
    address: string | undefined;
  };
  solana: {
    connected: boolean;
    address: string | undefined;
  };
  // Unified helpers
  isConnected: (chain: WalletKey) => boolean;
  getAddress: (chain: WalletKey) => string | undefined;
  sendPayment: (params: SendPaymentParams) => Promise<string | null>;
}

interface SendPaymentParams {
  chain: WalletKey;
  to: string;
  amount: number; // In native units (ETH, SOL, etc.)
  tokenSymbol: string;
}

/**
 * Unified multi-chain wallet hook.
 * Provides connection status and payment sending for EVM + Solana.
 * SUI and BTC are address-display only (no programmatic send).
 */
export function useMultiChainWallet(): MultiChainWalletState {
  // EVM (wagmi)
  const { address: evmAddress, isConnected: evmConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();

  // Solana
  const { publicKey: solanaPublicKey, connected: solanaConnected, sendTransaction: solanaSendTransaction } = useSolanaWallet();
  const { connection } = useConnection();

  const isConnected = (chain: WalletKey): boolean => {
    switch (chain) {
      case 'EVM': return evmConnected;
      case 'SOL': return solanaConnected;
      case 'SUI': return false; // Future: SUI wallet adapter
      case 'BTC': return false; // BTC is always manual (address display)
      default: return false;
    }
  };

  const getAddress = (chain: WalletKey): string | undefined => {
    switch (chain) {
      case 'EVM': return evmAddress;
      case 'SOL': return solanaPublicKey?.toBase58();
      default: return undefined;
    }
  };

  const sendPayment = async (params: SendPaymentParams): Promise<string | null> => {
    const { chain, to, amount, tokenSymbol } = params;

    try {
      if (chain === 'EVM' && evmConnected) {
        // Native ETH/BNB/MATIC/AVAX send
        const isNative = ['ETH', 'BNB', 'MATIC', 'AVAX', 'ARB'].includes(tokenSymbol);
        if (isNative) {
          const hash = await sendTransactionAsync({
            to: to as `0x${string}`,
            value: parseEther(amount.toString()),
          });
          return hash;
        }
        // For ERC-20 tokens (USDC, USDT, LINK, etc.) — would need contract interaction
        // For now, return null to fallback to manual address copy
        return null;
      }

      if (chain === 'SOL' && solanaConnected && solanaPublicKey) {
        // Native SOL send
        if (tokenSymbol === 'SOL') {
          const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: solanaPublicKey,
              toPubkey: new PublicKey(to),
              lamports: Math.round(amount * LAMPORTS_PER_SOL),
            })
          );
          const signature = await solanaSendTransaction(transaction, connection);
          return signature;
        }
        // SPL tokens (USDC-SOL, BONK, WIF, etc.) — would need SPL token program
        // Fallback to manual
        return null;
      }

      // SUI / BTC — always manual (address display)
      return null;
    } catch (error) {
      console.error(`[useMultiChainWallet] sendPayment error:`, error);
      return null;
    }
  };

  return {
    evm: {
      connected: evmConnected,
      address: evmAddress,
    },
    solana: {
      connected: solanaConnected,
      address: solanaPublicKey?.toBase58(),
    },
    isConnected,
    getAddress,
    sendPayment,
  };
}
