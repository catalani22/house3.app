import { Button } from "@/components/ui/button";
import { Search, User, Menu, Globe, LogOut, Check, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useFirebase } from "./FirebaseProvider";
import { loginWithGoogle, logout } from "../firebase";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, AnimatePresence } from "motion/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, loading } = useFirebase();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  const navLinks = [
    { name: t('nav.properties'), href: '/' },
    { name: 'Destinations', href: '/destinations' },
    { name: t('nav.concierge'), href: '#' },
    { name: '$H3APP', href: '/token' },
  ];

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 flex items-center justify-between",
          isScrolled || isMobileMenuOpen ? "bg-background/80 backdrop-blur-xl border-b border-border py-3" : "bg-transparent"
        )}
      >
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 gold-border rounded-lg flex items-center justify-center bg-card">
              <span className="gold-text font-serif text-xl font-bold">H3</span>
            </div>
            <span className={cn("font-serif text-2xl tracking-tight transition-colors", isScrolled || isMobileMenuOpen ? "text-foreground" : "text-white")}>
              house<span className="gold-text">3</span>
            </span>
          </Link>

          <div className={cn("hidden lg:flex items-center gap-8 text-[10px] uppercase font-bold tracking-[0.2em]", isScrolled ? "text-muted-foreground" : "text-white/80")}>
            {navLinks.map((link) => (
              <Link key={link.name} to={link.href} className="hover:text-primary transition-colors">{link.name}</Link>
            ))}
            {user && (
              <Link to="/owner" className="hover:text-primary transition-colors flex items-center gap-2">
                <LayoutDashboard className="w-3 h-3" />
                Dashboard
              </Link>
            )}
            {profile?.role === 'admin' && (
              <Link to="/admin" className="hover:text-primary transition-colors flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" />
                Admin
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <ConnectButton showBalance={false} accountStatus="address" chainStatus="icon" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className={cn("hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all cursor-pointer hover:bg-white/10", 
                isScrolled ? "border-border text-foreground bg-muted/50" : "border-white/20 text-white bg-white/5")}>
                <Globe className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {LANGUAGES.find(l => i18n.language.startsWith(l.code))?.name || 'English'} / USD
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-card border-border max-h-[400px] overflow-y-auto z-[60]" align="end">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {i18n.language.startsWith('pt') ? "Selecionar Idioma" : "Select Language"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem 
                  key={lang.code} 
                  className="cursor-pointer flex items-center justify-between"
                  onClick={() => changeLanguage(lang.code)}
                >
                  <div className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span className="text-xs">{lang.name}</span>
                  </div>
                  {i18n.language.startsWith(lang.code) && <Check className="w-3 h-3 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" size="icon" className={cn("rounded-full", isScrolled ? "text-foreground" : "text-white hover:bg-white/10")}>
            <Search className="w-5 h-5" />
          </Button>

          {loading ? (
            <div className="w-24 h-10 bg-muted animate-pulse rounded-full" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <div className="relative h-10 w-10 rounded-full p-0 ring-offset-background focus-visible:ring-2 focus-visible:ring-primary cursor-pointer">
                  <img 
                    src={user.photoURL || "https://picsum.photos/seed/user/100/100"} 
                    alt="User" 
                    className="h-10 w-10 rounded-full object-cover border border-primary/50"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-card border-border z-[60]" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="cursor-pointer focus:bg-primary/10 focus:text-primary" onClick={() => navigate('/owner')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard do Proprietário</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer focus:bg-primary/10 focus:text-primary">
                  <User className="mr-2 h-4 w-4" />
                  <span>Minhas Reservas</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer focus:bg-primary/10 focus:text-primary" onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('nav.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 hidden sm:flex font-bold uppercase text-[10px] tracking-widest h-11"
              onClick={() => loginWithGoogle()}
            >
              {t('nav.login')}
            </Button>
          )}

          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("lg:hidden rounded-full", isScrolled || isMobileMenuOpen ? "text-foreground" : "text-white hover:bg-white/10")}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background pt-24 px-6 lg:hidden"
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className="text-2xl font-serif hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-8 border-t border-border space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground uppercase tracking-widest">Language</span>
                  <div className="flex gap-2 flex-wrap justify-end max-w-[200px]">
                    {LANGUAGES.slice(0, 6).map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setIsMobileMenuOpen(false);
                        }}
                        className={cn(
                          "px-3 py-1 rounded-full border text-xs transition-all",
                          i18n.language.startsWith(lang.code) ? "bg-primary text-black border-primary" : "border-border text-muted-foreground"
                        )}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center pt-4">
                  <ConnectButton />
                </div>
                {!user && (
                  <Button 
                    className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest h-14"
                    onClick={() => {
                      loginWithGoogle();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {t('nav.login')}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
