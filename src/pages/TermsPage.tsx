import { useTranslation } from 'react-i18next';

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen pt-32 pb-20 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif mb-4">
          Terms & <span className="gold-text">Conditions</span>
        </h1>
        <p className="text-muted-foreground text-sm mb-12 uppercase tracking-widest">
          Last updated: April 2026
        </p>

        <div className="space-y-10 text-foreground/90 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif mb-4 gold-text">1. Platform Overview</h2>
            <p>
              house3.app is a Web3-native luxury hospitality marketplace that connects guests
              with ultra-premium properties worldwide. We act exclusively as a technological
              intermediary — facilitating discovery, crypto payment processing, and concierge
              coordination between guests and property source platforms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 gold-text">2. Service Model</h2>
            <h3 className="text-lg font-serif mb-2">2.1 Zero Custody</h3>
            <p className="mb-4">
              house3.app operates under a "Zero Custody" model. We do not hold, store, or manage
              cryptocurrency funds beyond the 10% markup deposit. The remaining 90% of the booking
              value is settled directly between the guest and the property platform via P2P.
            </p>
            <h3 className="text-lg font-serif mb-2">2.2 Markup Fee</h3>
            <p className="mb-4">
              Our business model is based on a 10% markup on the total property value. This markup
              covers: property curation, availability verification, concierge services, blockchain
              payment infrastructure, and booking coordination.
            </p>
            <h3 className="text-lg font-serif mb-2">2.3 Source Platforms</h3>
            <p>
              Properties listed on house3.app are sourced from premium third-party platforms
              (JamesEdition, Luxury Retreats, and others). Availability, pricing, and cancellation
              policies are ultimately governed by the source platform's terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 gold-text">3. Cryptocurrency Payments</h2>
            <h3 className="text-lg font-serif mb-2">3.1 Accepted Cryptocurrencies</h3>
            <p className="mb-4">
              We accept payments in BTC, ETH, SOL, and USDC (plus additional tokens as listed
              on the platform). Conversion rates are determined at the time of transaction using
              real-time price feeds from CoinGecko, Binance, and Chainlink oracles.
            </p>
            <h3 className="text-lg font-serif mb-2">3.2 Transaction Finality</h3>
            <p className="mb-4">
              Blockchain transactions are irreversible once confirmed on-chain. house3.app is not
              responsible for incorrect wallet addresses, insufficient gas fees, or network
              congestion delays. Please verify all transaction details before confirming.
            </p>
            <h3 className="text-lg font-serif mb-2">3.3 Price Volatility</h3>
            <p>
              Cryptocurrency values fluctuate. The USD equivalent displayed at booking time is
              indicative. The actual amount of cryptocurrency required is locked at the moment
              of payment initiation and valid for 15 minutes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 gold-text">4. Booking Process</h2>
            <ol className="list-decimal list-inside space-y-3 ml-4">
              <li><strong>Selection:</strong> Choose your luxury property and dates</li>
              <li><strong>Deposit:</strong> Pay 10% markup in your chosen cryptocurrency to house3.app wallet</li>
              <li><strong>Verification:</strong> Our concierge confirms availability on the source platform</li>
              <li><strong>Full Payment:</strong> Send remaining 90% directly to the property platform (P2P)</li>
              <li><strong>Confirmation:</strong> Receive official voucher and check-in instructions</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 gold-text">5. Cancellation & Refunds</h2>
            <p className="mb-4">
              Cancellation policies are determined by the source property platform. house3.app's
              10% markup deposit follows these rules:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Before verification:</strong> Full refund of deposit (minus network gas fees)</li>
              <li><strong>After verification, before payment:</strong> 50% refund of deposit</li>
              <li><strong>After full payment:</strong> Subject to source platform's cancellation policy</li>
            </ul>
            <p className="mt-4">
              Refunds are processed in the same cryptocurrency used for the original deposit,
              to the same wallet address.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 gold-text">6. $H3APP Token</h2>
            <p className="mb-4">
              The $H3APP token is a utility token within the house3.app ecosystem. Token holders
              may receive benefits including priority booking access, reduced markup fees, and
              governance participation.
            </p>
            <p>
              Token purchase is not an investment contract. $H3APP does not represent equity,
              debt, or any claim on house3.app revenue. Token value may fluctuate and could
              decrease to zero. Purchase only what you can afford to lose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 gold-text">7. User Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Ensure wallet security (private keys, seed phrases)</li>
              <li>Verify all transaction details before confirming</li>
              <li>Comply with local regulations regarding cryptocurrency usage</li>
              <li>Provide accurate booking information</li>
              <li>Respect property rules set by owners/platforms</li>
              <li>Report any suspicious activity or security concerns</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 gold-text">8. Limitation of Liability</h2>
            <p>
              house3.app is provided "as is" without warranties of any kind. We are not liable for:
              losses due to cryptocurrency price fluctuation, blockchain network failures,
              smart contract vulnerabilities, property condition or availability discrepancies,
              or actions of third-party platforms. Our maximum liability is limited to the
              10% markup deposit amount.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 gold-text">9. Intellectual Property</h2>
            <p>
              All content, branding, code, and design elements of house3.app are proprietary.
              Property images and descriptions may be sourced from partner platforms and remain
              their respective owners' intellectual property.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 gold-text">10. Governing Law</h2>
            <p>
              These Terms are governed by international commercial law principles. Any disputes
              shall be resolved through binding arbitration. By using house3.app, you waive
              the right to participate in class action lawsuits.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 gold-text">11. Modifications</h2>
            <p>
              We reserve the right to modify these Terms at any time. Material changes will be
              communicated via the platform. Continued use after modifications constitutes
              acceptance.
            </p>
          </section>

          <section className="border-t border-border pt-8">
            <p className="text-muted-foreground text-sm">
              Questions about these Terms? Contact:{' '}
              <a href="mailto:legal@house3.app" className="gold-text hover:underline">
                legal@house3.app
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
