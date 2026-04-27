import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, onSnapshot, doc, updateDoc, orderBy } from 'firebase/firestore';
import { Booking, Property } from '../types';
import { useFirebase } from './FirebaseProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Wallet, 
  Send,
  Search,
  Filter,
  ShieldCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function AdminDashboard() {
  const { profile } = useFirebase();
  const { t, i18n } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Record<string, Property>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending_deposit' | 'deposit_confirmed' | 'awaiting_full_payment'>('all');

  useEffect(() => {
    if (profile?.role !== 'admin') return;

    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const unsubBookings = onSnapshot(q, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      setBookings(bookingsData);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'bookings');
    });

    const unsubProps = onSnapshot(collection(db, 'properties'), (snapshot) => {
      const props: Record<string, Property> = {};
      snapshot.docs.forEach(doc => {
        props[doc.id] = doc.data() as Property;
      });
      setProperties(props);
    });

    return () => {
      unsubBookings();
      unsubProps();
    };
  }, [profile]);

  const updateBookingStatus = async (bookingId: string, updates: Partial<Booking>) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `bookings/${bookingId}`);
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h1 className="text-2xl font-serif">
            {i18n.language.startsWith('pt') ? "Acesso Negado" : "Access Denied"}
          </h1>
          <p className="text-muted-foreground">
            {i18n.language.startsWith('pt') 
              ? "Você precisa de privilégios de administrador para acessar esta área."
              : "You need administrator privileges to access this area."}
          </p>
          <Button onClick={() => window.location.href = '/'}>
            {i18n.language.startsWith('pt') ? "Voltar para Home" : "Back to Home"}
          </Button>
        </div>
      </div>
    );
  }

  const filteredBookings = bookings.filter(b => filter === 'all' || b.paymentStatus === filter);

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <LayoutDashboard className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-serif">{t('admin_dashboard.title').split(' ').slice(0, -1).join(' ')} <span className="gold-text">{t('admin_dashboard.title').split(' ').slice(-1)}</span></h1>
            </div>
            <p className="text-muted-foreground">{t('admin_dashboard.subtitle')}</p>
          </div>
          
          <div className="flex items-center gap-3 bg-card p-1 rounded-xl border border-border">
            {(['all', 'pending_deposit', 'deposit_confirmed', 'awaiting_full_payment'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  filter === f ? 'bg-primary text-black' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t(`admin_dashboard.filters.${f}`)}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredBookings.map((booking) => {
              const property = properties[booking.propertyId];
              return (
                <motion.div
                  key={booking.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all"
                >
                  <div className="p-6 flex flex-col lg:flex-row gap-8">
                    {/* Property Info */}
                    <div className="lg:w-1/4 flex gap-4">
                      <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 gold-border">
                        <img src={property?.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg leading-tight mb-1">{property?.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{property?.location}</p>
                        <Badge variant="outline" className="text-[10px] uppercase tracking-tighter">
                          {property?.sourcePlatform || 'JamesEdition'}
                        </Badge>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="lg:w-1/4 space-y-3">
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Datas:</span>
                        <span className="font-medium">
                          {format(new Date(booking.checkIn), 'dd/MM')} - {format(new Date(booking.checkOut), 'dd/MM')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Wallet className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Pagamento:</span>
                        <span className="font-bold text-primary">
                          {booking.cryptoAmount.toFixed(4)} {booking.cryptoCurrency}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Total (Markup Inc.):</span>
                        <span className="font-medium">${booking.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="lg:w-1/4 flex flex-col gap-2 justify-center">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Pagamento:</span>
                        <Badge className={cn(
                          "text-[10px] uppercase",
                          booking.paymentStatus === 'fully_paid' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                        )}>
                          {booking.paymentStatus.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Arbitragem:</span>
                        <Badge className={cn(
                          "text-[10px] uppercase",
                          booking.arbitrageStatus === 'booked_on_source' ? 'bg-blue-500/20 text-blue-500' : 'bg-muted text-muted-foreground'
                        )}>
                          {booking.arbitrageStatus.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:w-1/4 flex flex-col justify-center gap-2">
                      {booking.paymentStatus === 'pending_deposit' && (
                        <Button 
                          size="sm" 
                          className="w-full gold-gradient text-black font-bold text-xs"
                          onClick={() => updateBookingStatus(booking.id, { paymentStatus: 'deposit_confirmed' })}
                        >
                          Confirmar Depósito (10%)
                        </Button>
                      )}
                      
                      {booking.paymentStatus === 'deposit_confirmed' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="w-full text-xs"
                          onClick={() => updateBookingStatus(booking.id, { paymentStatus: 'awaiting_full_payment' })}
                        >
                          Solicitar Pagamento Final (90%)
                        </Button>
                      )}

                      {booking.paymentStatus === 'awaiting_full_payment' && (
                        <Button 
                          size="sm" 
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-xs"
                          onClick={() => updateBookingStatus(booking.id, { paymentStatus: 'fully_paid' })}
                        >
                          Confirmar Pagamento Total
                        </Button>
                      )}

                      {booking.paymentStatus === 'fully_paid' && booking.arbitrageStatus === 'pending' && (
                        <div className="space-y-2">
                          <a 
                            href={property?.originalUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full p-2 rounded-lg bg-muted hover:bg-muted/80 text-xs font-bold transition-all"
                          >
                            Reservar na {property?.sourcePlatform || 'Origem'}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <Button 
                            size="sm" 
                            className="w-full gold-gradient text-black font-bold text-xs"
                            onClick={() => updateBookingStatus(booking.id, { arbitrageStatus: 'booked_on_source' })}
                          >
                            Marcar como Reservado
                          </Button>
                        </div>
                      )}

                      {booking.arbitrageStatus === 'booked_on_source' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="w-full text-xs border-primary text-primary"
                          onClick={() => updateBookingStatus(booking.id, { arbitrageStatus: 'voucher_sent' })}
                        >
                          <Send className="w-3 h-3 mr-2" />
                          Enviar Voucher ao Cliente
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredBookings.length === 0 && !loading && (
            <div className="py-20 text-center space-y-4 bg-card rounded-3xl border border-dashed border-border">
              <Search className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">Nenhuma reserva encontrada para este filtro.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
