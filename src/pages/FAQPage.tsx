import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: 'Platform',
    question: 'What is house3.app?',
    answer: 'house3.app is the world\'s first fully crypto-native luxury hospitality marketplace. We curate ultra-premium properties globally and enable seamless booking using cryptocurrency — BTC, ETH, SOL, and USDC. Our platform combines blockchain payment rails with white-glove concierge service for an unmatched luxury experience.'
  },
  {
    category: 'Platform',
    question: 'How does house3.app differ from traditional rental platforms?',
    answer: 'Unlike traditional platforms, house3.app operates entirely on Web3 principles: payments in cryptocurrency, enhanced privacy through wallet-based authentication, real-time price conversion via on-chain oracles, and a transparent 10% markup model with no hidden fees. We also offer AI-powered concierge and priority access for $H3APP token holders.'
  },
  {
    category: 'Platform',
    question: 'What types of properties are available?',
    answer: 'We exclusively curate ultra-premium properties: luxury villas, beachfront estates, private mansions, designer penthouses, and exclusive apartments in the world\'s most sought-after destinations. Every listing is verified for quality and sourced from premium partner platforms like JamesEdition and Luxury Retreats.'
  },
  {
    category: 'Platform',
    question: 'Is house3.app available worldwide?',
    answer: 'Yes. Our platform features luxury properties across all continents — from Mediterranean villas to Caribbean beachfronts, Swiss chalets to Bali retreats. Our AI concierge and booking system operate 24/7 with support in 11 languages.'
  },
  {
    category: 'Payments',
    question: 'What cryptocurrencies are accepted?',
    answer: 'We currently accept Bitcoin (BTC), Ethereum (ETH), Solana (SOL), and USDC stablecoin. Additional tokens may be added based on community demand and liquidity requirements. All prices are displayed in both crypto and USD equivalent using real-time oracle feeds.'
  },
  {
    category: 'Payments',
    question: 'How does the payment process work?',
    answer: 'Booking follows a 4-step process: (1) Select property and dates, (2) Pay 10% deposit to house3.app wallet in your chosen crypto, (3) Our concierge confirms availability and blocks the property, (4) You send the remaining 90% directly to the source platform (P2P). You receive an official voucher upon completion.'
  },
  {
    category: 'Payments',
    question: 'What is the 10% markup?',
    answer: 'The 10% markup is our service fee covering: property curation and verification, real-time availability checking, blockchain payment infrastructure, AI concierge assistance, booking coordination with source platforms, and 24/7 guest support. There are no additional hidden fees or subscriptions.'
  },
  {
    category: 'Payments',
    question: 'Are transactions reversible?',
    answer: 'Blockchain transactions are irreversible once confirmed on-chain. Please verify all details (wallet address, amount, network) before confirming any transaction. house3.app cannot reverse or modify completed on-chain transactions. Refunds, when applicable, are processed as new transactions.'
  },
  {
    category: 'Payments',
    question: 'How are crypto prices determined?',
    answer: 'We use a multi-source price cascade: CoinGecko, Binance, and Chainlink on-chain oracles provide real-time pricing. The system automatically selects the most reliable source. Prices are locked for 15 minutes once you initiate payment to protect against volatility.'
  },
  {
    category: 'Booking',
    question: 'How do I make a reservation?',
    answer: 'Connect your wallet (via RainbowKit), browse properties, select your dates and guest count, then proceed to payment. Choose your preferred cryptocurrency, send the 10% deposit to our displayed wallet address, and our concierge handles the rest — from availability confirmation to check-in details.'
  },
  {
    category: 'Booking',
    question: 'What is the "Zero Custody" model?',
    answer: 'house3.app never holds or manages the full booking amount. We only receive the 10% markup deposit. The remaining 90% is settled directly between you and the property platform. This eliminates custodial risk and ensures your funds are never pooled or locked in our systems.'
  },
  {
    category: 'Booking',
    question: 'What if a property is unavailable after my deposit?',
    answer: 'If our concierge cannot confirm availability after your deposit, you receive a full refund (minus network gas fees) to your original wallet. We verify availability within 24 hours of deposit receipt in most cases.'
  },
  {
    category: 'Booking',
    question: 'What is the cancellation policy?',
    answer: 'Cancellation terms depend on timing: Before verification — full deposit refund (minus gas). After verification but before full payment — 50% deposit refund. After full payment — subject to the source platform\'s cancellation policy. All refunds are in the original cryptocurrency.'
  },
  {
    category: '$H3APP Token',
    question: 'What is the $H3APP token?',
    answer: '$H3APP is the utility token of the house3.app ecosystem. It provides holders with benefits including: priority booking access for high-demand properties, reduced markup fees (down to 7% for large holders), governance voting on platform features, exclusive property previews, and staking rewards.'
  },
  {
    category: '$H3APP Token',
    question: 'How can I purchase $H3APP tokens?',
    answer: 'During the presale phase, you can purchase $H3APP directly on our Token page using any supported cryptocurrency (BTC, ETH, SOL, USDC, and more). After presale, $H3APP will be available on decentralized exchanges. Visit the /token page for current pricing and availability.'
  },
  {
    category: '$H3APP Token',
    question: 'What are the token holder benefits?',
    answer: 'Token holders enjoy: reduced markup fees (tiered by holdings), priority access to new luxury listings, early booking windows for peak seasons, governance voting rights, exclusive concierge tier upgrades, and potential staking yields from platform revenue sharing.'
  },
  {
    category: 'Security',
    question: 'How secure is the platform?',
    answer: 'house3.app employs multiple security layers: Firebase Security Rules for data access, HTTPS encryption for all communications, wallet-based authentication (no passwords to steal), real-time transaction monitoring, and AI-powered fraud detection. Smart contract interactions use audited libraries.'
  },
  {
    category: 'Security',
    question: 'Do you store my private keys?',
    answer: 'Absolutely not. house3.app never accesses, stores, or transmits your private keys or seed phrases. Wallet connections are handled entirely by RainbowKit/WalletConnect — we only see your public address. Always ensure you\'re on house3.app before connecting your wallet.'
  },
  {
    category: 'Security',
    question: 'What about privacy?',
    answer: 'We collect minimal personal data. Wallet-based authentication means you can browse and book without email registration. Google OAuth is optional for enhanced concierge features. Blockchain transactions are public by nature, but we never link on-chain activity to personal identities in our systems.'
  },
];

const categories = [...new Set(faqData.map(item => item.category))];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('Platform');
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const filteredFAQ = faqData.filter(item => item.category === activeCategory);

  return (
    <main className="min-h-screen pt-32 pb-20 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif mb-4">
            Frequently Asked <span className="gold-text">Questions</span>
          </h1>
          <p className="text-muted-foreground font-light max-w-2xl mx-auto">
            Everything you need to know about luxury crypto hospitality on house3.app
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenItems(new Set()); }}
              className={cn(
                'px-5 py-2.5 rounded-full text-sm font-medium transition-all border',
                activeCategory === cat
                  ? 'bg-primary text-black border-primary'
                  : 'bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQ.map((item, index) => {
            const globalIndex = faqData.indexOf(item);
            const isOpen = openItems.has(globalIndex);
            return (
              <div
                key={globalIndex}
                className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors"
              >
                <button
                  onClick={() => toggleItem(globalIndex)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-serif text-lg pr-4">{item.question}</span>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 text-primary shrink-0 transition-transform duration-300',
                      isOpen && 'rotate-180'
                    )}
                  />
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300',
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <p className="px-6 pb-6 text-muted-foreground font-light leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center bg-card border border-border rounded-3xl p-10">
          <h3 className="text-2xl font-serif mb-3">Still have questions?</h3>
          <p className="text-muted-foreground font-light mb-6">
            Our concierge team is available 24/7 to assist you.
          </p>
          <a
            href="mailto:concierge@house3.app"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-black font-semibold rounded-full hover:bg-primary/90 transition-colors"
          >
            Contact Concierge
          </a>
        </div>
      </div>
    </main>
  );
}
