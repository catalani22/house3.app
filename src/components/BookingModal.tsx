import React, { useState, useEffect } from "react";
import { Property } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, differenceInDays, addDays } from "date-fns";
import { Calendar as CalendarIcon, Wallet, ArrowRight, CheckCircle2, Loader2, Sparkles, ShieldCheck, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFirebase } from "./FirebaseProvider";
import { loginWithGoogle } from "../firebase";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { getCryptoPrice } from "@/services/priceService";
import { orchestrateAI } from "@/services/aiService";
import { PLATFORM_WALLETS } from "../constants";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface BookingModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

type CryptoCurrency = 'BTC' | 'ETH' | 'SOL' | 'USDC';
type Step = 1 | 2 | 3 | 4; // 1: Dates, 2: Availability Check, 3: Payment, 4: Confirmation

export default function BookingModal({ property, isOpen, onClose }: BookingModalProps) {
  const { user } = useFirebase();
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState<Step>(1);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: addDays(new Date(), 2), // Min 48h notice
    to: addDays(new Date(), 5),
  });
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoCurrency>('ETH');
  const [cryptoPrices, setCryptoPrices] = useState<Record<CryptoCurrency, number>>({
    BTC: 65000,
    ETH: 3500,
    SOL: 140,
    USDC: 1
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [conciergeTip, setConciergeTip] = useState<string>("");
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  const nights = dateRange.from && dateRange.to ? differenceInDays(dateRange.to, dateRange.from) : 0;
  const totalAmount = nights * property.price;
  const depositAmount = totalAmount * 0.1;
  const cryptoAmount = depositAmount / cryptoPrices[selectedCrypto];

  useEffect(() => {
    const fetchPrices = async () => {
      const symbols: CryptoCurrency[] = ['BTC', 'ETH', 'SOL', 'USDC'];
      const newPrices: Partial<Record<CryptoCurrency, number>> = {};
      for (const sym of symbols) {
        newPrices[sym] = await getCryptoPrice(sym);
      }
      setCryptoPrices(newPrices as Record<CryptoCurrency, number>);
    };
    
    if (isOpen) {
      fetchPrices();
      const interval = setInterval(fetchPrices, 30000); // Update every 30s
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

  const handleNext = async () => {
    if (step === 1) {
      if (!user) {
        loginWithGoogle();
        return;
      }
      if (nights < 3) return;
      
      setIsCheckingAvailability(true);
      setStep(2);
      // Simulate real-time availability check on source platform
      await new Promise(resolve => setTimeout(resolve, 2500));
      setIsCheckingAvailability(false);
      setStep(3);
    }
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
        totalAmount: totalAmount,
        depositAmount: depositAmount,
        originalAmount: totalAmount * 0.9, // Assuming 10% markup
        currency: 'USD',
        paymentStatus: 'pending_deposit',
        arbitrageStatus: 'pending',
        sourcePlatform: property.sourcePlatform || 'JamesEdition',
        cryptoCurrency: selectedCrypto,
        cryptoAmount: cryptoAmount,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'bookings'), bookingData);
      
      // Simulate wallet interaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsProcessing(false);
      setIsSuccess(true);
      setStep(4);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'bookings');
      setIsProcessing(false);
    }
  };

  const getWalletAddress = () => {
    if (selectedCrypto === 'BTC') return PLATFORM_WALLETS.DEPOSIT.BTC;
    if (selectedCrypto === 'SOL') return PLATFORM_WALLETS.DEPOSIT.SOL;
    return PLATFORM_WALLETS.DEPOSIT.EVM;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">{t('booking.step_1')} (Mín. 3 noites)</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-border rounded-xl bg-muted/50">
                  <span className="text-[10px] text-muted-foreground block uppercase">Check-in</span>
                  <span className="font-medium">{dateRange.from ? format(dateRange.from, "dd/MM/yyyy") : "---"}</span>
                </div>
                <div className="p-3 border border-border rounded-xl bg-muted/50">
                  <span className="text-[10px] text-muted-foreground block uppercase">Check-out</span>
                  <span className="font-medium">{dateRange.to ? format(dateRange.to, "dd/MM/yyyy") : "---"}</span>
                </div>
              </div>
              {nights < 3 && nights > 0 && (
                <p className="text-xs text-red-500 font-medium">A estadia mínima é de 3 noites.</p>
              )}
            </div>

            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex gap-3">
              <Info className="w-4 h-4 text-blue-500 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {i18n.language.startsWith('pt') 
                  ? `Nossa IA verificará a disponibilidade em tempo real na plataforma de origem (${property.sourcePlatform || 'JamesEdition'}) antes de processar seu depósito de 10%.`
                  : `Our AI will verify availability in real-time on the source platform (${property.sourcePlatform || 'JamesEdition'}) before processing your 10% deposit.`}
              </p>
            </div>

            {conciergeTip && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl italic text-xs text-primary/80"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <p>"{conciergeTip}"</p>
              </motion.div>
            )}

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Diária ({nights} noites)</span>
                <span className="font-medium">${totalAmount.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-primary/10 flex justify-between items-end">
                <div>
                  <span className="text-xs font-bold uppercase text-primary">Total</span>
                  <p className="text-2xl font-serif">${totalAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">{t('booking.deposit')}</span>
                  <p className="text-lg font-bold text-primary">${depositAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <ShieldCheck className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif">
                {i18n.language.startsWith('pt') ? "Verificando Disponibilidade" : "Checking Availability"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                {i18n.language.startsWith('pt') 
                  ? `Sincronizando com ${property.sourcePlatform || 'JamesEdition'} para garantir que o imóvel esteja vago nas datas escolhidas.`
                  : `Syncing with ${property.sourcePlatform || 'JamesEdition'} to ensure the property is vacant on the chosen dates.`}
              </p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase text-muted-foreground">{t('booking.step_2')} (10%)</label>
              <div className="grid grid-cols-2 gap-3">
                {(['BTC', 'ETH', 'SOL', 'USDC'] as CryptoCurrency[]).map((crypto) => (
                  <button
                    key={crypto}
                    onClick={() => setSelectedCrypto(crypto)}
                    className={cn(
                      "p-4 border rounded-2xl flex items-center justify-between transition-all",
                      selectedCrypto === crypto 
                        ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(212,175,55,0.2)]" 
                        : "border-border bg-muted/30 hover:border-primary/30"
                    )}
                  >
                    <span className="font-bold">{crypto}</span>
                    <span className="text-[10px] text-muted-foreground">1 {crypto} = ${cryptoPrices[crypto]?.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 gold-border rounded-2xl bg-card space-y-4">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold uppercase text-primary tracking-widest">Valor do Depósito</span>
                <p className="text-4xl font-serif gold-text">{cryptoAmount.toFixed(selectedCrypto === 'BTC' ? 6 : 4)} {selectedCrypto}</p>
                <p className="text-sm text-muted-foreground">Equivalente a ${depositAmount.toLocaleString()} USD</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Endereço de Depósito</label>
                <div className="p-3 bg-muted/50 rounded-xl border border-border flex items-center justify-between gap-2">
                  <code className="text-[10px] truncate font-mono">{getWalletAddress()}</code>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 hover:text-primary">
                    <Wallet className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl space-y-3">
              <div className="flex gap-3">
                <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {i18n.language.startsWith('pt')
                    ? "Envie exatamente o valor acima. Após a confirmação on-chain do depósito de 10%, iniciaremos o bloqueio do imóvel. Você receberá as instruções para o pagamento final (90%) em seguida."
                    : "Send exactly the amount above. After on-chain confirmation of the 10% deposit, we will begin blocking the property. You will receive instructions for the final payment (90%) afterwards."}
                </p>
              </div>
              <div className="pt-3 border-t border-yellow-500/10">
                <p className="text-[9px] text-muted-foreground leading-tight italic">
                  {i18n.language.startsWith('pt')
                    ? `Ao confirmar, você aceita os termos de uso da house3.app e declara estar ciente de que esta reserva será processada na plataforma originária (${property.sourcePlatform || 'JamesEdition'}), aceitando também seus respectivos termos e políticas de cancelamento.`
                    : `By confirming, you accept house3.app's terms of use and declare you are aware that this reservation will be processed on the source platform (${property.sourcePlatform || 'JamesEdition'}), also accepting their respective terms and cancellation policies.`}
                </p>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 py-8 text-center">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-6"
                >
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse" />
                    <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin" />
                    <Wallet className="absolute inset-0 m-auto w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-serif">Aguardando Transação</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">
                      Por favor, confirme a transação de <span className="text-primary font-bold">{cryptoAmount.toFixed(4)} {selectedCrypto}</span> em sua carteira conectada.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-12 h-12 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-serif gold-text">{t('booking.success')}</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                      Seu depósito de 10% foi recebido. Estamos bloqueando o imóvel em {property.sourcePlatform || 'JamesEdition'}.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-2xl border border-border text-left space-y-2">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Próximo Passo</p>
                    <p className="text-xs leading-relaxed">
                      Em instantes você receberá o link para o pagamento final de 90%. Assim que concluído, enviaremos seu voucher oficial.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-background border-border p-0 overflow-hidden rounded-3xl">
        <div className="h-2 bg-muted w-full">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
        
        <div className="p-8">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase text-primary tracking-widest">Passo {step} de 4</span>
            </div>
            <DialogTitle className="text-3xl font-serif">
              {step === 1 && t('booking.title')}
              {step === 2 && "Verificando..."}
              {step === 3 && "Pré-reserva (10%)"}
              {step === 4 && t('booking.step_3')}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {property.title} • {property.location}
            </DialogDescription>
          </DialogHeader>

          {renderStep()}

          <DialogFooter className="mt-8">
            {step < 4 && step !== 2 && (
              <Button 
                onClick={step === 3 ? handleConfirmReservation : handleNext}
                disabled={step === 1 && nights < 3 || isProcessing}
                className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 font-bold text-lg group"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {step === 1 ? (user ? "Verificar Disponibilidade" : t('nav.login')) : "Já realizei o envio"}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            )}
            {step === 4 && isSuccess && (
              <Button onClick={onClose} className="w-full rounded-full bg-primary text-primary-foreground h-14 font-bold">
                Fechar
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
