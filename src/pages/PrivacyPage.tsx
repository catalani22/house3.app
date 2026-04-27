import { useTranslation } from 'react-i18next';

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen pt-32 pb-20 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif mb-4">
          Privacy <span className="gold-text">Policy</span>
        </h1>
        <p className="text-muted-foreground text-sm mb-12 uppercase tracking-widest">
          Last updated: April 2026
        </p>

        <div className="space-y-10 text-foreground/90 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif mb-4 gold-text">1. Introduction</h2>
            <p>
              house3.app ("we", "us", "our") operates the house3.app platform — a luxury
              hospitality marketplace powered by blockchain technology. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you
              use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 gold-text">2. Information We Collect</h2>
            <h3 className="text-lg font-serif mb-2">2.1 Wallet & Blockchain Data</h3>
            <p className="mb-4">
              When you connect your cryptocurrency wallet (via RainbowKit/WalletConnect), we access
              your public wallet address. All blockchain transactions are inherently public. We do
              not store private keys or seed phrases.
            </p>
            <h3 className="text-lg font-serif mb-2">2.2 Booking Information</h3>
            <p className="mb-4">
              To process reservations, we collect: preferred dates, guest count, destination
              preferences, and payment cryptocurrency selection. This data is stored securely
              in Firebase with encryption at rest.
            </p>
            <h3 className="text-lg font-serif mb-2">2.3 Authentication Data</h3>
            <p>
              If you sign in via Google OAuth, we receive your name, email, and profile photo.
              This enables personalized concierge services and booking history.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 gold-text">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Process and confirm property reservations</li>
              <li>Facilitate crypto payments (10% deposit to platform wallets)</li>
              <li>Provide AI-powered concierge recommendations</li>
              <li>Communicate booking confirmations and vouchers</li>
              <li>Improve platform security and prevent fraud</li>
              <li>Comply with applicable legal requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 gold-text">4. Blockchain Transparency</h2>
            <p>
              Cryptocurrency transactions on public blockchains (Ethereum, Solana, Bitcoin) are
              permanent and publicly visible. house3.app does not control or modify on-chain data.
              Your wallet address and transaction history on these networks are inherently public
              information. We recommend using dedicated wallets for privacy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 gold-text">5. Data Sharing</h2>
            <p className="mb-4">We may share information with:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Property Source Platforms</strong> — to validate availability and process bookings (e.g., JamesEdition, Luxury Retreats)</li>
              <li><strong>AI Services</strong> — Gemini and Groq for concierge functionality (anonymized queries)</li>
              <li><strong>Price Oracles</strong> — CoinGecko, Binance, Chainlink for real-time crypto conversion</li>
              <li><strong>Legal Authorities</strong> — when required by law or to protect our rights</li>
            </ul>
            <p className="mt-4">We never sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 gold-text">6. Data Security</h2>
            <p>
              We employ industry-standard security measures including Firebase Security Rules,
              HTTPS encryption, and access controls. However, no method of electronic transmission
              or storage is 100% secure. We cannot guarantee absolute security of data transmitted
              to our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 gold-text">7. Your Rights</h2>
            <p className="mb-4">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access the personal data we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Withdraw consent for data processing</li>
              <li>Export your data in a portable format</li>
              <li>Object to automated decision-making</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, contact us at{' '}
              <a href="mailto:privacy@house3.app" className="gold-text hover:underline">
                privacy@house3.app
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 gold-text">8. Cookies & Analytics</h2>
            <p>
              We use essential cookies for authentication and language preferences. We use
              Firebase Analytics to understand platform usage patterns. You may disable
              non-essential cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 gold-text">9. International Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your
              own. We ensure appropriate safeguards are in place for such transfers in compliance
              with applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4 gold-text">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this
              page with an updated revision date. Continued use of the platform after changes
              constitutes acceptance of the revised policy.
            </p>
          </section>

          <section className="border-t border-border pt-8">
            <p className="text-muted-foreground text-sm">
              For questions about this Privacy Policy, contact:{' '}
              <a href="mailto:privacy@house3.app" className="gold-text hover:underline">
                privacy@house3.app
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
