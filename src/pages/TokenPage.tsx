import { useState, useEffect, useCallback } from 'react';
import { Copy, Check, ArrowRight, ArrowLeft, Coins } from 'lucide-react';
import { cn } from '../lib/utils';
import { PLATFORM_WALLETS } from '../constants';

// ─── Token Config ────────────────────────────────────────────────
const TOKEN_NAME = '$H3APP';
const PRESALE_STAGES = [
  { name: 'Stage 1 — Early Backers', price: 0.008, supply: 50_000_000 },
  { name: 'Stage 2 — Growth', price: 0.012, supply: 30_000_000 },
  { name: 'Stage 3 — Final', price: 0.018, supply: 20_000_000 },
];
const LISTING_PRICE = 0.05;
const CURRENT_STAGE = 0;
const TOTAL_SUPPLY = 500_000_000;

// ─── Supported payment tokens ────────────────────────────────────
interface PaymentToken {
  symbol: string;
  name: string;
  chain: string;
  coingeckoId: string;
  walletKey: 'EVM' | 'BTC' | 'SOL';
}

const PAYMENT_TOKENS: PaymentToken[] = [
  { symbol: 'SOL', name: 'Solana', chain: 'Solana', coingeckoId: 'solana', walletKey: 'SOL' },
  { symbol: 'ETH', name: 'Ethereum', chain: 'EVM', coingeckoId: 'ethereum', walletKey: 'EVM' },
  { symbol: 'BNB', name: 'BNB', chain: 'EVM', coingeckoId: 'binancecoin', walletKey: 'EVM' },
  { symbol: 'BTC', name: 'Bitcoin', chain: 'Bitcoin', coingeckoId: 'bitcoin', walletKey: 'BTC' },
  { symbol: 'USDT', name: 'Tether', chain: 'EVM', coingeckoId: 'tether', walletKey: 'EVM' },
  { symbol: 'USDC', name: 'USD Coin', chain: 'EVM', coingeckoId: 'usd-coin', walletKey: 'EVM' },
  { symbol: 'MATIC', name: 'Polygon', chain: 'EVM', coingeckoId: 'matic-network', walletKey: 'EVM' },
  { symbol: 'AVAX', name: 'Avalanche', chain: 'EVM', coingeckoId: 'avalanche-2', walletKey: 'EVM' },
];

// ─── Price Fetching (Multi-Provider Cascade) ─────────────────────
async function fetchTokenPrice(coingeckoId: string): Promise<number> {
  // CoinGecko
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`);
    const data = await res.json();
    if (data[coingeckoId]?.usd) return data[coingeckoId].usd;
  } catch {}

  // Binance
  try {
    const symbol = coingeckoId === 'ethereum' ? 'ETHUSDT' :
                   coingeckoId === 'bitcoin' ? 'BTCUSDT' :
                   coingeckoId === 'solana' ? 'SOLUSDT' :
                   coingeckoId === 'binancecoin' ? 'BNBUSDT' :
                   coingeckoId === 'matic-network' ? 'MATICUSDT' :
                   coingeckoId === 'avalanche-2' ? 'AVAXUSDT' : null;
    if (symbol) {
      const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
      const data = await res.json();
      if (data.price) return parseFloat(data.price);
    }
  } catch {}

  // Stablecoins fallback
  if (['tether', 'usd-coin'].includes(coingeckoId)) return 1.0;

  return 0;
}

// ─── LED Marquee Component ───────────────────────────────────────
function LEDMarquee() {
  const text = `$H3APP TOKEN · PRE SALE LIVE · STAGE 1 · $${PRESALE_STAGES[CURRENT_STAGE].price} · LUXURY WEB3 HOSPITALITY · `;
  return (
    <div className="w-full overflow-hidden bg-black border-y border-primary/30 py-2">
      <div className="animate-marquee whitespace-nowrap flex">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-primary font-mono text-xs tracking-widest mx-8">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Buy Widget ──────────────────────────────────────────────────
function BuyWidget() {
  const [selectedToken, setSelectedToken] = useState<PaymentToken>(PAYMENT_TOKENS[0]);
  const [inputMode, setInputMode] = useState<'usd' | 'token'>('usd');
  const [usdAmount, setUsdAmount] = useState('');
  const [tokenInputAmount, setTokenInputAmount] = useState('');
  const [tokenPrice, setTokenPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [copied, setCopied] = useState(false);

  const stage = PRESALE_STAGES[CURRENT_STAGE];
  const effectiveUsd = inputMode === 'usd'
    ? parseFloat(usdAmount) || 0
    : (parseFloat(tokenInputAmount) || 0) * tokenPrice;
  const h3appTokens = effectiveUsd / stage.price;

  const loadPrice = useCallback(async () => {
    setLoading(true);
    const price = await fetchTokenPrice(selectedToken.coingeckoId);
    setTokenPrice(price);
    setLoading(false);
  }, [selectedToken.coingeckoId]);

  useEffect(() => { loadPrice(); }, [loadPrice]);

  const walletAddress = PLATFORM_WALLETS.DEPOSIT[selectedToken.walletKey];
  const cryptoAmount = effectiveUsd > 0 && tokenPrice > 0 ? effectiveUsd / tokenPrice : 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canProceed = effectiveUsd >= 10;

  if (step === 'payment') {
    return (
      <div className="bg-card border border-border rounded-3xl p-8 space-y-6">
        <button onClick={() => setStep('form')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground uppercase tracking-widest">Send exactly</p>
          <p className="text-3xl font-serif gold-text">{cryptoAmount.toFixed(6)} {selectedToken.symbol}</p>
          <p className="text-sm text-muted-foreground">≈ ${effectiveUsd.toFixed(2)} USD → {h3appTokens.toLocaleString(undefined, { maximumFractionDigits: 0 })} {TOKEN_NAME}</p>
        </div>

        <div className="bg-background rounded-2xl p-5 space-y-3">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            {selectedToken.chain} Wallet Address
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs text-foreground/80 break-all font-mono">{walletAddress}</code>
            <button onClick={handleCopy} className="shrink-0 p-2 rounded-lg hover:bg-muted transition-colors">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-primary" />}
            </button>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            After sending, your {TOKEN_NAME} tokens will be allocated to your connected wallet within 24 hours.
            Ensure you send the exact amount on the <strong>{selectedToken.chain}</strong> network.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-8 space-y-6">
      <div className="text-center space-y-1">
        <h3 className="text-xl font-serif">Buy {TOKEN_NAME}</h3>
        <p className="text-sm text-muted-foreground">
          {stage.name} — <span className="gold-text font-semibold">${stage.price}</span> per token
        </p>
      </div>

      {/* Token Selector */}
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">Pay with</label>
        <div className="grid grid-cols-4 gap-2">
          {PAYMENT_TOKENS.map(t => (
            <button
              key={t.symbol}
              onClick={() => setSelectedToken(t)}
              className={cn(
                'px-3 py-2 rounded-xl text-xs font-medium border transition-all',
                selectedToken.symbol === t.symbol
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/50'
              )}
            >
              {t.symbol}
            </button>
          ))}
        </div>
      </div>

      {/* Input Mode Toggle */}
      <div className="flex items-center justify-between">
        <label className="text-xs text-muted-foreground uppercase tracking-widest">Amount</label>
        <button
          onClick={() => setInputMode(prev => prev === 'usd' ? 'token' : 'usd')}
          className="text-xs text-primary hover:underline"
        >
          Switch to {inputMode === 'usd' ? selectedToken.symbol : 'USD'}
        </button>
      </div>

      {inputMode === 'usd' ? (
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
          <input
            type="number"
            placeholder="100.00"
            value={usdAmount}
            onChange={e => setUsdAmount(e.target.value)}
            className="w-full bg-background border border-border rounded-xl px-8 py-4 text-lg font-mono focus:border-primary focus:outline-none transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">USD</span>
        </div>
      ) : (
        <div className="relative">
          <input
            type="number"
            placeholder="0.5"
            value={tokenInputAmount}
            onChange={e => setTokenInputAmount(e.target.value)}
            className="w-full bg-background border border-border rounded-xl px-4 py-4 text-lg font-mono focus:border-primary focus:outline-none transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{selectedToken.symbol}</span>
        </div>
      )}

      {/* Summary */}
      {effectiveUsd > 0 && (
        <div className="bg-background rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">You pay</span>
            <span>{cryptoAmount.toFixed(6)} {selectedToken.symbol}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">You receive</span>
            <span className="gold-text font-semibold">{h3appTokens.toLocaleString(undefined, { maximumFractionDigits: 0 })} {TOKEN_NAME}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Rate</span>
            <span className="text-xs">1 {selectedToken.symbol} = ${loading ? '...' : tokenPrice.toFixed(2)}</span>
          </div>
        </div>
      )}

      <button
        onClick={() => setStep('payment')}
        disabled={!canProceed}
        className={cn(
          'w-full py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 transition-all',
          canProceed
            ? 'bg-primary text-black hover:bg-primary/90'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        )}
      >
        Proceed to Payment <ArrowRight className="w-5 h-5" />
      </button>

      <p className="text-[10px] text-muted-foreground text-center">
        Minimum purchase: $10 USD
      </p>
    </div>
  );
}

// ─── Token Page ──────────────────────────────────────────────────
export default function TokenPage() {
  const stage = PRESALE_STAGES[CURRENT_STAGE];

  return (
    <main className="min-h-screen pt-24 pb-20 bg-background">
      <LEDMarquee />

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — Info */}
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 gold-border rounded-2xl flex items-center justify-center bg-card">
                  <Coins className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-serif">{TOKEN_NAME}</h1>
                  <p className="text-muted-foreground text-sm">house3.app Utility Token</p>
                </div>
              </div>
              <p className="text-muted-foreground font-light leading-relaxed text-lg">
                The native token powering the world's first crypto-native luxury hospitality 
                marketplace. Hold {TOKEN_NAME} for reduced fees, priority bookings, and governance.
              </p>
            </div>

            {/* Tokenomics */}
            <div className="space-y-4">
              <h2 className="text-2xl font-serif">Tokenomics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-2xl p-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Total Supply</p>
                  <p className="text-xl font-serif">{(TOTAL_SUPPLY / 1_000_000).toFixed(0)}M</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Presale Price</p>
                  <p className="text-xl font-serif gold-text">${stage.price}</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Listing Price</p>
                  <p className="text-xl font-serif">${LISTING_PRICE}</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">ROI at Listing</p>
                  <p className="text-xl font-serif text-green-500">+{((LISTING_PRICE / stage.price - 1) * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>

            {/* Presale Stages */}
            <div className="space-y-4">
              <h2 className="text-2xl font-serif">Presale Stages</h2>
              <div className="space-y-3">
                {PRESALE_STAGES.map((s, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex items-center justify-between p-4 rounded-xl border',
                      i === CURRENT_STAGE
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card opacity-60'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {i === CURRENT_STAGE && <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
                      <span className="font-serif">{s.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm">${s.price}</p>
                      <p className="text-[10px] text-muted-foreground">{(s.supply / 1_000_000).toFixed(0)}M tokens</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Utility */}
            <div className="space-y-4">
              <h2 className="text-2xl font-serif">Token Utility</h2>
              <ul className="space-y-3">
                {[
                  'Reduced markup fees (10% → 7% for holders)',
                  'Priority booking access for high-demand properties',
                  'Governance voting on platform features',
                  'Exclusive early access to new destinations',
                  'Concierge tier upgrades',
                  'Revenue sharing via staking',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground font-light">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — Buy Widget */}
          <div className="lg:sticky lg:top-32">
            <BuyWidget />
          </div>
        </div>
      </div>
    </main>
  );
}
