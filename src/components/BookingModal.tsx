import React, { useState, useEffect } from "react";
import { Property } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format, differenceInDays, addDays } from "date-fns";
import { Wallet, ArrowRight, ArrowLeft, CheckCircle2, Loader2, Sparkles, ShieldCheck, AlertTriangle, Info, Copy, Check, Users, User, Mail, Phone, Globe, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFirebase } from "./FirebaseProvider";
import { loginWithGoogle } from "../firebase";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { getCryptoPrice } from "@/services/priceService";
import { orchestrateAI } from "@/services/aiService";
import { getWalletForToken, getAcceptedTokensForProperty, WalletKey } from "../constants";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface BookingModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

// All possible payment tokens with chain/label info
const ALL_CRYPTO_OPTIONS: { symbol: string; chain: WalletKey; label: string; icon: string }[] = [
  { symbol: 'BTC', chain: 'BTC', label: 'Bitcoin', icon: '₿' },
  { symbol: 'ETH', chain: 'EVM', label: 'Ethereum', icon: '⟠' },
  { symbol: 'SOL', chain: 'SOL', label: 'Solana', icon: '◎' },
  { symbol: 'USDC', chain: 'EVM', label: 'USD Coin', icon: '💵' },
  { symbol: 'USDT', chain: 'EVM', label: 'Tether', icon: '💵' },
  { symbol: 'BNB', chain: 'EVM', label: 'BNB', icon: '🟡' },
  { symbol: 'AVAX', chain: 'EVM', label: 'Avalanche', icon: '🔺' },
  { symbol: 'MATIC', chain: 'EVM', label: 'Polygon', icon: '🟣' },
  { symbol: 'DAI', chain: 'EVM', label: 'Dai', icon: '◆' },
  { symbol: 'LINK', chain: 'EVM', label: 'Chainlink', icon: '🔗' },
  { symbol: 'SUI', chain: 'SUI', label: 'Sui', icon: '💧' },
  { symbol: 'ARB', chain: 'EVM', label: 'Arbitrum', icon: '🔵' },
];

type Step = 1 | 2 | 3 | 4 | 5;
// 1: Dates & Guests, 2: Guest Details, 3: Fee Breakdown + Availability, 4: Payment, 5: Confirmation

interface GuestDetails {
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  documentType: 'passport' | 'id_card' | 'drivers_license';
  documentNumber: string;
  specialRequests: string;
}

export default function BookingModal({ property, isOpen, onClose }: BookingModalProps) {
  const { user } = useFirebase();
  const { t, i18n } = useTranslation();
  const isEn = !i18n.language.startsWith('pt');

  // Source platform rules (from scraping/API/sync — the single source of truth)
  const rules = property.sourceRules;
  const minNights = rules?.minNights || 3;
  const maxGuests = rules?.maxGuests || 20;
  const checkInTime = rules?.checkInTime || '15:00';
  const checkOutTime = rules?.checkOutTime || '11:00';
  const requiredFields = rules?.requiredFields || ['fullName', 'email', 'phone', 'passport'];
  const houseRules = rules?.houseRules || [];
  const cancellationPolicy = rules?.cancellationPolicy || 'moderate';
  const cancellationDetails = rules?.cancellationDetails || (isEn ? 'Free cancellation up to 7 days before check-in.' : 'Cancelamento gratuito até 7 dias antes do check-in.');

  const [step, setStep] = useState<Step>(1);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: addDays(new Date(), rules?.advanceBookingDays || 2),
    to: addDays(new Date(), (rules?.advanceBookingDays || 2) + 3),
  });
  const [guests, setGuests] = useState(2);
  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    fullName: '',
    email: user?.email || '',
    phone: '',
    nationality: '',
    documentType: 'passport',
    documentNumber: '',
    specialRequests: '',
  });

  // Token filtering: use sourceRules.acceptedTokens if available, else fallback to platform config
  const acceptedSymbols = rules?.acceptedTokens || getAcceptedTokensForProperty(property.sourcePlatform).tokens;
  const availableCryptos = ALL_CRYPTO_OPTIONS.filter(c => acceptedSymbols.includes(c.symbol));

  const [selectedCrypto, setSelectedCrypto] = useState(availableCryptos[0]?.symbol || 'USDC');
  const [cryptoPrices, setCryptoPrices] = useState<Record<string, number>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [conciergeTip, setConciergeTip] = useState<string>("");
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [copied, setCopied] = useState(false);

  // Pricing: use real fees from sourceRules when available
  const nights = dateRange.from && dateRange.to ? differenceInDays(dateRange.to, dateRange.from) : 0;
  const nightlyRate = property.price;
  const subtotal = nights * nightlyRate;
  const cleaningFee = rules?.cleaningFee ?? Math.round(nightlyRate * 0.15);
  const serviceFee = Math.round(subtotal * (rules?.serviceFeePercent ?? 5) / 100);
  const taxes = Math.round(subtotal * (rules?.taxPercent ?? 8) / 100);
  const totalAmount = subtotal + cleaningFee + serviceFee + taxes;
  const depositAmount = Math.round(totalAmount * 0.1); // 10% pre-reservation
  const cryptoAmount = cryptoPrices[selectedCrypto] ? depositAmount / cryptoPrices[selectedCrypto] : 0;

  useEffect(() => {
    const fetchPrices = async () => {
      const newPrices: Record<string, number> = {};
      for (const crypto of availableCryptos) {
        newPrices[crypto.symbol] = await getCryptoPrice(crypto.symbol);
      }
      setCryptoPrices(newPrices);
    };
    if (isOpen) {
      fetchPrices();
      const interval = setInterval(fetchPrices, 30000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchTip = async () => {
      if (isOpen && step === 1) {
        const tip = await orchestrateAI(
          `Give a short, 1-sentence luxury concierge tip for someone staying at a ${property.category} in ${property.location}.`,
          "You are a world-class luxury concierge for house3.app."
        );
        setConciergeTip(tip);
      }
    };
    fetchTip();
  }, [isOpen, step, property]);

  useEffect(() => {
    if (user?.email && !guestDetails.email) {
      setGuestDetails(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getWalletAddress());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getWalletAddress = () => {
    const cryptoOption = availableCryptos.find(c => c.symbol === selectedCrypto);
    const chain: WalletKey = cryptoOption?.chain || 'EVM';
    return getWalletForToken(selectedCrypto, chain);
  };

  const isGuestDetailsValid = () => {
    return guestDetails.fullName.length >= 3
      && guestDetails.email.includes('@')
      && guestDetails.phone.length >= 8
      && guestDetails.nationality.length >= 2
      && guestDetails.documentNumber.length >= 5;
  };

  const handleConfirmReservation = async () => {
    if (!user) return;
    setIsProcessing(true);
    try {
      const bookingData = {
        userId: user.uid,
        propertyId: property.id,
        checkIn: dateRange.from,
        checkOut: dateRange.to,
        nights,
        guests,
        guestDetails: {
          fullName: guestDetails.fullName,
          email: guestDetails.email,
          phone: guestDetails.phone,
          nationality: guestDetails.nationality,
          documentType: guestDetails.documentType,
          documentNumber: guestDetails.documentNumber,
          specialRequests: guestDetails.specialRequests,
        },
        pricing: {
          nightlyRate,
          subtotal,
          cleaningFee,
          serviceFee,
          taxes,
          totalAmount,
          depositAmount,
          currency: 'USD',
        },
        payment: {
          cryptoCurrency: selectedCrypto,
          cryptoAmount,
          walletAddress: getWalletAddress(),
          chain: availableCryptos.find(c => c.symbol === selectedCrypto)?.chain,
        },
        sourcePlatform: property.sourcePlatform || 'JamesEdition',
        paymentStatus: 'pending_deposit',
        arbitrageStatus: 'pending',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'bookings'), bookingData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsProcessing(false);
      setIsSuccess(true);
      setStep(5);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'bookings');
      setIsProcessing(false);
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!user) { loginWithGoogle(); return; }
      if (nights < 3) return;
      setStep(2);
    } else if (step === 2) {
      if (!isGuestDetailsValid()) return;
      setStep(3);
      setIsCheckingAvailability(true);
      await new Promise(resolve => setTimeout(resolve, 2500));
      setIsCheckingAvailability(false);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleBack = () => {
    if (step > 1 && step < 5) setStep((step - 1) as Step);
  };

  const stepTitles = isEn
    ? ['Dates & Guests', 'Guest Information', 'Fee Breakdown', 'Payment', 'Confirmed']
    : ['Datas e Hóspedes', 'Dados do Hóspede', 'Detalhamento', 'Pagamento', 'Confirmado'];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-5 py-4">
            {/* Dates */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                {isEn ? 'Stay Period' : 'Período'} (Min. 3 {isEn ? 'nights' : 'noites'})
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border border-border rounded-xl bg-muted/50">
                  <span className="text-[10px] text-muted-foreground block uppercase">Check-in</span>
                  <span className="font-medium text-sm">{dateRange.from ? format(dateRange.from, "MMM dd, yyyy") : "---"}</span>
                </div>
                <div className="p-3 border border-border rounded-xl bg-muted/50">
                  <span className="text-[10px] text-muted-foreground block uppercase">Check-out</span>
                  <span className="font-medium text-sm">{dateRange.to ? format(dateRange.to, "MMM dd, yyyy") : "---"}</span>
                </div>
              </div>
              {nights > 0 && nights < 3 && (
                <p className="text-xs text-red-500 font-medium">{isEn ? 'Minimum stay is 3 nights.' : 'Estadia mínima: 3 noites.'}</p>
              )}
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> {isEn ? 'Number of Guests' : 'Nº de Hóspedes'}
              </label>
              <div className="flex items-center gap-3">
                <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-10 h-10 rounded-xl border border-border bg-muted/50 hover:border-primary/40 transition-all font-bold text-lg">−</button>
                <span className="text-2xl font-serif w-10 text-center">{guests}</span>
                <button onClick={() => setGuests(Math.min(20, guests + 1))} className="w-10 h-10 rounded-xl border border-border bg-muted/50 hover:border-primary/40 transition-all font-bold text-lg">+</button>
                <span className="text-xs text-muted-foreground ml-2">{isEn ? 'guests' : 'hóspedes'}</span>
              </div>
            </div>

            {/* Concierge tip */}
            {conciergeTip && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="flex gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl italic text-xs text-primary/80">
                <Sparkles className="w-4 h-4 shrink-0" />
                <p>"{conciergeTip}"</p>
              </motion.div>
            )}

            {/* Quick pricing summary */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">${nightlyRate.toLocaleString()} × {nights} {isEn ? 'nights' : 'noites'}</span>
                <span className="font-medium">${subtotal.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-primary/10 flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-primary">{isEn ? 'Est. Total' : 'Total Est.'}</span>
                <span className="text-xl font-serif">${totalAmount.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">{isEn ? '10% pre-reservation deposit required' : 'Depósito de 10% para pré-reserva'}: <span className="text-primary font-bold">${depositAmount.toLocaleString()}</span></p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 py-4">
            <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl flex gap-2">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {isEn
                  ? `These details are required to process your reservation. Please ensure all information is accurate.`
                  : `Estes dados são necessários para processar sua reserva. Preencha com precisão.`}
              </p>
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                <User className="w-3 h-3" /> {isEn ? 'Full Name (as on document)' : 'Nome Completo (conforme documento)'}
              </label>
              <input
                type="text"
                value={guestDetails.fullName}
                onChange={(e) => setGuestDetails({ ...guestDetails, fullName: e.target.value })}
                placeholder={isEn ? "John William Smith" : "Nome conforme passaporte"}
                className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:border-primary/60 focus:outline-none transition-colors"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                <Mail className="w-3 h-3" /> {isEn ? 'Email' : 'E-mail'}
              </label>
              <input
                type="email"
                value={guestDetails.email}
                onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })}
                placeholder="guest@example.com"
                className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:border-primary/60 focus:outline-none transition-colors"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                <Phone className="w-3 h-3" /> {isEn ? 'Phone (with country code)' : 'Telefone (com DDI)'}
              </label>
              <input
                type="tel"
                value={guestDetails.phone}
                onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })}
                placeholder="+1 555 123 4567"
                className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:border-primary/60 focus:outline-none transition-colors"
              />
            </div>

            {/* Nationality */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                <Globe className="w-3 h-3" /> {isEn ? 'Nationality / Country' : 'Nacionalidade / País'}
              </label>
              <input
                type="text"
                value={guestDetails.nationality}
                onChange={(e) => setGuestDetails({ ...guestDetails, nationality: e.target.value })}
                placeholder={isEn ? "United States" : "Brasil"}
                className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:border-primary/60 focus:outline-none transition-colors"
              />
            </div>

            {/* Document Type & Number */}
            <div className="grid grid-cols-5 gap-3">
              <div className="col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                  <FileText className="w-3 h-3" /> {isEn ? 'Document' : 'Documento'}
                </label>
                <select
                  value={guestDetails.documentType}
                  onChange={(e) => setGuestDetails({ ...guestDetails, documentType: e.target.value as any })}
                  className="w-full px-2 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:border-primary/60 focus:outline-none transition-colors"
                >
                  <option value="passport">{isEn ? 'Passport' : 'Passaporte'}</option>
                  <option value="id_card">{isEn ? 'ID Card' : 'RG / ID'}</option>
                  <option value="drivers_license">{isEn ? "Driver's License" : 'CNH'}</option>
                </select>
              </div>
              <div className="col-span-3 space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">
                  {isEn ? 'Document Number' : 'Nº Documento'}
                </label>
                <input
                  type="text"
                  value={guestDetails.documentNumber}
                  onChange={(e) => setGuestDetails({ ...guestDetails, documentNumber: e.target.value })}
                  placeholder="AB1234567"
                  className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:border-primary/60 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Special Requests */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">
                {isEn ? 'Special Requests (optional)' : 'Solicitações Especiais (opcional)'}
              </label>
              <textarea
                value={guestDetails.specialRequests}
                onChange={(e) => setGuestDetails({ ...guestDetails, specialRequests: e.target.value })}
                placeholder={isEn ? "Early check-in, airport transfer, dietary needs..." : "Check-in antecipado, transfer aeroporto..."}
                rows={2}
                className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:border-primary/60 focus:outline-none transition-colors resize-none"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5 py-4">
            {isCheckingAvailability ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative">
                  <Loader2 className="w-14 h-14 text-primary animate-spin" />
                  <ShieldCheck className="w-5 h-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-serif">{isEn ? 'Checking Availability' : 'Verificando Disponibilidade'}</h3>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    {isEn
                      ? `Verifying availability for ${format(dateRange.from!, 'MMM dd')} – ${format(dateRange.to!, 'MMM dd, yyyy')}...`
                      : `Verificando disponibilidade para ${format(dateRange.from!, 'dd/MM')} – ${format(dateRange.to!, 'dd/MM/yyyy')}...`}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Availability confirmed badge */}
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-medium text-green-400">
                    {isEn ? 'Available for your dates!' : 'Disponível para suas datas!'}
                  </span>
                </div>

                {/* Booking Summary */}
                <div className="p-4 bg-muted/30 border border-border rounded-xl space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isEn ? 'Guest' : 'Hóspede'}</span>
                    <span className="font-medium">{guestDetails.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isEn ? 'Period' : 'Período'}</span>
                    <span className="font-medium">{format(dateRange.from!, 'MMM dd')} – {format(dateRange.to!, 'MMM dd')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isEn ? 'Guests' : 'Hóspedes'}</span>
                    <span className="font-medium">{guests}</span>
                  </div>
                </div>

                {/* Fee Breakdown */}
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                    {isEn ? 'Fee Breakdown' : 'Detalhamento de Valores'}
                  </h4>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">${nightlyRate.toLocaleString()} × {nights} {isEn ? 'nights' : 'noites'}</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isEn ? 'Cleaning fee' : 'Taxa de limpeza'}</span>
                      <span>${cleaningFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isEn ? 'Service fee' : 'Taxa de serviço'}</span>
                      <span>${serviceFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isEn ? 'Taxes & levies' : 'Impostos e taxas'}</span>
                      <span>${taxes.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-primary/20 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-lg">${totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-primary/20">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold uppercase text-primary tracking-wider">
                          {isEn ? '10% Pre-Reservation Deposit' : 'Depósito 10% Pré-Reserva'}
                        </span>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {isEn ? 'Secures your booking instantly' : 'Garante sua reserva imediatamente'}
                        </p>
                      </div>
                      <span className="text-2xl font-serif gold-text">${depositAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Remaining payment info */}
                <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl flex gap-2">
                  <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    {isEn
                      ? `After deposit confirmation, you'll receive instructions for the remaining 90% ($${(totalAmount - depositAmount).toLocaleString()}) via email.`
                      : `Após confirmação do depósito, você receberá por email as instruções para o pagamento dos 90% restantes ($${(totalAmount - depositAmount).toLocaleString()}).`}
                  </p>
                </div>
              </>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-5 py-4">
            {/* Token selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                {isEn ? 'Select Payment Token' : 'Token de Pagamento'}
              </label>
              <p className="text-[10px] text-muted-foreground mb-2">
                {isEn
                  ? `Supported tokens for this property.`
                  : `Tokens suportados para este imóvel.`}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto no-scrollbar">
                {availableCryptos.map((crypto) => (
                  <button
                    key={crypto.symbol}
                    onClick={() => setSelectedCrypto(crypto.symbol)}
                    className={cn(
                      "p-3 border rounded-xl flex flex-col items-center gap-1 transition-all text-center",
                      selectedCrypto === crypto.symbol
                        ? "border-primary bg-primary/10 shadow-[0_0_12px_rgba(212,175,55,0.15)]"
                        : "border-border bg-muted/30 hover:border-primary/30"
                    )}
                  >
                    <span className="text-lg">{crypto.icon}</span>
                    <span className="font-bold text-xs">{crypto.symbol}</span>
                    {cryptoPrices[crypto.symbol] && (
                      <span className="text-[9px] text-muted-foreground">${cryptoPrices[crypto.symbol]?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Deposit amount in selected crypto */}
            <div className="p-5 gold-border rounded-xl bg-card space-y-3">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-bold uppercase text-primary tracking-widest">
                  {isEn ? 'Send Exactly' : 'Envie Exatamente'}
                </span>
                <p className="text-3xl font-serif gold-text">
                  {cryptoAmount > 0 ? cryptoAmount.toFixed(selectedCrypto === 'BTC' ? 6 : 4) : '—'} {selectedCrypto}
                </p>
                <p className="text-xs text-muted-foreground">{isEn ? 'Equivalent to' : 'Equivalente a'} ${depositAmount.toLocaleString()} USD</p>
              </div>

              {/* Wallet address */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                  {isEn ? `Send ${selectedCrypto} to:` : `Envie ${selectedCrypto} para:`}
                </label>
                <div className="p-3 bg-muted/50 rounded-lg border border-border flex items-center gap-2">
                  <code className="text-[10px] truncate font-mono flex-1 select-all">{getWalletAddress()}</code>
                  <button
                    onClick={handleCopy}
                    className={cn("shrink-0 p-1.5 rounded-lg border transition-all", copied ? "border-green-500 text-green-400" : "border-border hover:border-primary/40 text-muted-foreground hover:text-primary")}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[9px] text-muted-foreground">
                  {isEn ? `Network: ${availableCryptos.find(c => c.symbol === selectedCrypto)?.chain}` : `Rede: ${availableCryptos.find(c => c.symbol === selectedCrypto)?.chain}`}
                </p>
              </div>
            </div>

            {/* Warning */}
            <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl space-y-2">
              <div className="flex gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-yellow-400">{isEn ? 'Important' : 'Importante'}</p>
                  <ul className="text-[10px] text-muted-foreground space-y-0.5">
                    <li>• {isEn ? `Send ONLY ${selectedCrypto} on the correct network` : `Envie APENAS ${selectedCrypto} na rede correta`}</li>
                    <li>• {isEn ? 'Wrong token or network = permanent loss' : 'Token ou rede incorreta = perda permanente'}</li>
                    <li>• {isEn ? 'Add extra for network fees (gas)' : 'Adicione extra para taxas de rede (gas)'}</li>
                    <li>• {isEn ? 'Keep your transaction hash' : 'Guarde seu hash de transação'}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Terms acceptance */}
            <p className="text-[9px] text-muted-foreground text-center leading-tight">
              {isEn
                ? `By confirming payment, you accept house3.app's Terms of Use and the applicable cancellation policy for this property.`
                : `Ao confirmar, você aceita os Termos de Uso da house3.app e a política de cancelamento aplicável a este imóvel.`}
            </p>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 py-6 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif gold-text">{isEn ? 'Pre-Reservation Submitted!' : 'Pré-Reserva Enviada!'}</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  {isEn
                    ? `Your 10% deposit is being verified on-chain. Once confirmed, we'll secure your property.`
                    : `Seu depósito de 10% está sendo verificado on-chain. Após confirmação, bloquearemos seu imóvel.`}
                </p>
              </div>
            </motion.div>

            <div className="p-4 bg-muted/50 rounded-xl border border-border text-left space-y-3">
              <p className="text-[10px] uppercase font-bold tracking-widest text-primary">{isEn ? 'Next Steps' : 'Próximos Passos'}</p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>{isEn ? 'On-chain deposit confirmation (1-5 min)' : 'Confirmação on-chain do depósito (1-5 min)'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>{isEn ? 'Property secured & confirmed' : 'Imóvel bloqueado e confirmado'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>{isEn ? 'You receive email with 90% payment instructions' : 'Você recebe email com instruções do pagamento de 90%'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-primary font-bold">4.</span>
                  <span>{isEn ? 'Official voucher & booking confirmation sent' : 'Voucher oficial e confirmação de reserva enviados'}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-muted/30 rounded-xl text-left">
              <p className="text-[10px] text-muted-foreground">
                <span className="font-bold">{isEn ? 'Booking ref:' : 'Ref. reserva:'}</span> H3-{Date.now().toString(36).toUpperCase()}
              </p>
              <p className="text-[10px] text-muted-foreground">
                <span className="font-bold">{isEn ? 'Email sent to:' : 'Email enviado para:'}</span> {guestDetails.email}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] bg-background border-border p-0 overflow-hidden rounded-3xl max-h-[90vh] overflow-y-auto">
        {/* Progress bar */}
        <div className="h-1.5 bg-muted w-full sticky top-0 z-10">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        <div className="p-6 sm:p-8">
          <DialogHeader className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase text-primary tracking-widest">
                {isEn ? 'Step' : 'Passo'} {step} / 5
              </span>
              {step > 1 && step < 5 && (
                <button onClick={handleBack} className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                  <ArrowLeft className="w-3 h-3" /> {isEn ? 'Back' : 'Voltar'}
                </button>
              )}
            </div>
            <DialogTitle className="text-2xl font-serif">{stepTitles[step - 1]}</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              {property.title} • {property.location}
            </DialogDescription>
          </DialogHeader>

          {renderStep()}

          <DialogFooter className="mt-6">
            {step < 4 && !isCheckingAvailability && (
              <Button
                onClick={handleNext}
                disabled={(step === 1 && nights < 3) || (step === 2 && !isGuestDetailsValid())}
                className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-bold group"
              >
                {step === 1 && !user ? (isEn ? 'Sign In to Continue' : 'Entrar para Continuar') : (isEn ? 'Continue' : 'Continuar')}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
            {step === 3 && !isCheckingAvailability && (
              <Button
                onClick={handleNext}
                className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-bold group mt-2"
              >
                {isEn ? 'Proceed to Payment' : 'Ir para Pagamento'}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
            {step === 4 && (
              <Button
                onClick={handleConfirmReservation}
                disabled={isProcessing || cryptoAmount === 0}
                className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-bold group"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isEn ? "I've Sent the Payment" : 'Já Realizei o Envio'}
                    <CheckCircle2 className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            )}
            {step === 5 && (
              <Button onClick={onClose} className="w-full rounded-full bg-primary text-primary-foreground h-12 font-bold">
                {isEn ? 'Close' : 'Fechar'}
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
