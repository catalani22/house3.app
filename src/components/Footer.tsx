import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-card text-foreground pt-20 pb-10 px-6 border-t border-border">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 gold-border rounded-lg flex items-center justify-center bg-background">
                <span className="gold-text font-serif text-xl font-bold">H3</span>
              </div>
              <span className="font-serif text-2xl tracking-tight">
                house<span className="gold-text">3</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed font-light">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 bg-muted rounded-full hover:bg-primary transition-colors border border-border">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-muted rounded-full hover:bg-primary transition-colors border border-border">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-muted rounded-full hover:bg-primary transition-colors border border-border">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6 gold-text">{t('footer.collections')}</h4>
            <ul className="space-y-4 text-muted-foreground text-sm font-light">
              <li><a href="#" className="hover:text-primary transition-colors">Villas Exclusivas</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Mansões Históricas</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Coberturas Premium</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Beach Houses</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6 gold-text">{t('footer.ecosystem')}</h4>
            <ul className="space-y-4 text-muted-foreground text-sm font-light">
              <li><a href="#" className="hover:text-primary transition-colors">Crypto Investment</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Concierge Service</a></li>
              <li><a href="/token" className="hover:text-primary transition-colors">$H3APP Token</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">List Your Property</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6 gold-text">Legal</h4>
            <ul className="space-y-4 text-muted-foreground text-sm font-light">
              <li><a href="/terms" className="hover:text-primary transition-colors">{t('footer.terms')}</a></li>
              <li><a href="/privacy" className="hover:text-primary transition-colors">{t('footer.policy')}</a></li>
              <li><a href="/faq" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('footer.contact')}</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
            © 2026 HOUSE3.APP — LUXURY WEB3 HOSPITALITY
          </p>
          <div className="flex items-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all">
            <span className="text-[10px] font-bold tracking-tighter">BTC ACCEPTED</span>
            <span className="text-[10px] font-bold tracking-tighter">ETH ACCEPTED</span>
            <span className="text-[10px] font-bold tracking-tighter">SOL ACCEPTED</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
