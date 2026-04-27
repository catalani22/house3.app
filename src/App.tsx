/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PropertyGrid from "./components/PropertyGrid";
import Footer from "./components/Footer";
import OwnerDashboard from "./components/OwnerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import FAQPage from "./pages/FAQPage";
import TokenPage from "./pages/TokenPage";
import DestinationsPage from "./pages/DestinationsPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import { useTranslation } from "react-i18next";
import { Badge } from "./components/ui/badge";
import { FirebaseProvider } from "./components/FirebaseProvider";
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  render() {
    const { hasError, error } = this.state;
    if (hasError) {
      let errorMessage = "An unexpected error occurred.";
      try {
        const parsed = JSON.parse(error.message);
        if (parsed.error) errorMessage = `Database Error: ${parsed.error}`;
      } catch (e) {
        errorMessage = error?.message || "Unknown error";
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Oops! Something went wrong</h2>
            <p className="text-gray-600">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function Home() {
  const { t } = useTranslation();
  
  return (
    <main>
      <Hero />
      
      {/* LED Marquee */}
      <div className="w-full overflow-hidden bg-black border-y border-primary/30 py-2.5">
        <div className="animate-marquee whitespace-nowrap flex">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-primary font-mono text-xs tracking-widest mx-8">
              $H3APP TOKEN · PRE SALE LIVE · LUXURY WEB3 HOSPITALITY · BOOK WITH CRYPTO · ZERO CUSTODY · 
            </span>
          ))}
        </div>
      </div>

      <PropertyGrid />
      
      {/* How it Works Section */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16 space-y-4">
            <Badge variant="outline" className="border-primary/30 text-primary">{t('how_it_works.badge')}</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif">
              {t('how_it_works.title').split(' ').slice(0, -1).join(' ')} <span className="gold-text">{t('how_it_works.title').split(' ').slice(-1)}</span>
            </h2>
            <p className="text-muted-foreground font-light">
              {t('how_it_works.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2" />
            
            {[
              {
                step: "01",
                title: t('how_it_works.step1_title'),
                desc: t('how_it_works.step1_desc')
              },
              {
                step: "02",
                title: t('how_it_works.step2_title'),
                desc: t('how_it_works.step2_desc')
              },
              {
                step: "03",
                title: t('how_it_works.step3_title'),
                desc: t('how_it_works.step3_desc')
              },
              {
                step: "04",
                title: t('how_it_works.step4_title'),
                desc: t('how_it_works.step4_desc')
              }
            ].map((item, i) => (
              <div key={i} className="relative bg-card p-8 rounded-3xl border border-border hover:border-primary/30 transition-all z-10 group">
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mb-6 text-primary font-serif text-xl border border-primary/20 group-hover:bg-primary group-hover:text-black transition-all">
                  {item.step}
                </div>
                <h3 className="text-lg font-serif mb-3">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* house3 Concierge Section */}
      <section className="py-16 sm:py-24 bg-card overflow-hidden border-y border-border">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 space-y-8">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 px-4 py-1 uppercase tracking-widest text-[10px] font-bold">{t('concierge_section.badge')}</Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif tracking-tight leading-tight">
                {t('concierge_section.title').split(',')[0]}, <br />
                <span className="gold-text">{t('concierge_section.title').split(',')[1]}</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed font-light">
                {t('concierge_section.subtitle')}
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-4 bg-background p-5 rounded-2xl border border-border w-full sm:w-auto hover:border-primary/50 transition-colors group">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-lg">{t('concierge_section.vip_access')}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('concierge_section.blockchain_security')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-background p-5 rounded-2xl border border-border w-full sm:w-auto hover:border-primary/50 transition-colors group">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-lg">{t('concierge_section.instant_payments')}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('concierge_section.crypto_networks')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />
              <div className="gold-border p-2 rounded-[3rem]">
                <img 
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800" 
                  alt="house3 App" 
                  className="rounded-[2.5rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why house3 Section */}
      <section className="py-20 sm:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-20 space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif">{t('why_house_bz.title').split(' ')[0]} <span className="gold-text">{t('why_house_bz.title').split(' ').slice(1).join(' ')}</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-light">
              {t('why_house_bz.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-12">
            <div className="bg-card p-8 sm:p-10 rounded-3xl border border-border hover:border-primary/30 transition-all group">
              <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mb-6 sm:mb-8 text-primary font-serif text-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">01</div>
              <h3 className="text-xl sm:text-2xl font-serif mb-4">{t('why_house_bz.feature1_title')}</h3>
              <p className="text-muted-foreground font-light leading-relaxed">{t('why_house_bz.feature1_desc')}</p>
            </div>
            <div className="bg-card p-8 sm:p-10 rounded-3xl border border-border hover:border-primary/30 transition-all group">
              <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mb-6 sm:mb-8 text-primary font-serif text-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">02</div>
              <h3 className="text-xl sm:text-2xl font-serif mb-4">{t('why_house_bz.feature2_title')}</h3>
              <p className="text-muted-foreground font-light leading-relaxed">{t('why_house_bz.feature2_desc')}</p>
            </div>
            <div className="bg-card p-8 sm:p-10 rounded-3xl border border-border hover:border-primary/30 transition-all group sm:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mb-6 sm:mb-8 text-primary font-serif text-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">03</div>
              <h3 className="text-xl sm:text-2xl font-serif mb-4">{t('why_house_bz.feature3_title')}</h3>
              <p className="text-muted-foreground font-light leading-relaxed">{t('why_house_bz.feature3_desc')}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/owner" element={<OwnerDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/token" element={<TokenPage />} />
              <Route path="/destinations" element={<DestinationsPage />} />
              <Route path="/property/:id" element={<PropertyDetailPage />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </FirebaseProvider>
    </ErrorBoundary>
  );
}

