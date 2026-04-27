import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Booking, Property } from '../types';
import { useFirebase } from './FirebaseProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, CheckCircle2, AlertTriangle, Wallet, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function UserBookings() {
  const { user } = useFirebase();
  const { t, i18n } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Record<string, Property>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'bookings'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

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
  }, [user]);

  if (loading) {
    return (
      <div className="py-12 text-center animate-pulse">
        {i18n.language.startsWith('pt') ? "Carregando suas reservas..." : "Loading your bookings..."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {bookings.map((booking) => {
          const property = properties[booking.propertyId];
          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card/50 border border-border rounded-2xl overflow-hidden backdrop-blur-sm"
            >
              <div className="p-6 flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden shrink-0 gold-border">
                  <img src={property?.image} className="w-full h-full object-cover" alt="" />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-xl mb-1">{property?.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {property?.location}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={cn(
                        "text-[10px] uppercase tracking-widest",
                        booking.paymentStatus === 'fully_paid' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                      )}>
                        {booking.paymentStatus.replace(/_/g, ' ')}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">
                        ID: {booking.id.slice(-6)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">Check-in</span>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {format(new Date(booking.checkIn), 'dd MMM yyyy')}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">Check-out</span>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {format(new Date(booking.checkOut), 'dd MMM yyyy')}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                        {i18n.language.startsWith('pt') ? "Valor Pago (10%)" : "Amount Paid (10%)"}
                      </span>
                      <div className="flex items-center gap-2 text-sm font-bold text-primary">
                        <Wallet className="w-3.5 h-3.5" />
                        {booking.cryptoAmount.toFixed(4)} {booking.cryptoCurrency}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">Status</span>
                      <div className="flex items-center gap-2 text-sm">
                        {booking.arbitrageStatus === 'booked_on_source' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-yellow-500" />
                        )}
                        <span className="capitalize">{booking.arbitrageStatus.replace(/_/g, ' ')}</span>
                      </div>
                    </div>
                  </div>

                  {booking.paymentStatus === 'deposit_confirmed' && (
                    <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between gap-4">
                      <div className="flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-primary shrink-0" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {i18n.language.startsWith('pt')
                            ? "Sua pré-reserva foi confirmada! Aguarde o contato do nosso concierge para o pagamento final de 90% e emissão do voucher."
                            : "Your pre-booking has been confirmed! Please wait for our concierge to contact you for the final 90% payment and voucher issuance."}
                        </p>
                      </div>
                    </div>
                  )}

                  {booking.arbitrageStatus === 'voucher_sent' && (
                    <div className="mt-4 p-4 bg-green-500/5 border border-green-500/20 rounded-xl flex items-center justify-between gap-4">
                      <div className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {i18n.language.startsWith('pt')
                            ? `Voucher emitido! Sua reserva na plataforma ${property?.sourcePlatform} foi concluída com sucesso. Verifique seu e-mail.`
                            : `Voucher issued! Your booking on the ${property?.sourcePlatform} platform has been successfully completed. Please check your email.`}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" className="text-[10px] uppercase font-bold">
                        {i18n.language.startsWith('pt') ? "Baixar Voucher" : "Download Voucher"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {bookings.length === 0 && (
        <div className="py-20 text-center space-y-4 border-2 border-dashed border-border rounded-3xl">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
          <p className="text-muted-foreground">
            {i18n.language.startsWith('pt') ? "Você ainda não realizou nenhuma reserva." : "You haven't made any bookings yet."}
          </p>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            {i18n.language.startsWith('pt') ? "Explorar Propriedades" : "Explore Properties"}
          </Button>
        </div>
      )}
    </div>
  );
}
