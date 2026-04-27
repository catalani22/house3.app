import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Heart, Shield, Wifi, Car, Waves, UtensilsCrossed, TreePine, Sparkles, ArrowLeft } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Property } from '../types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import BookingModal from '../components/BookingModal';

const AMENITY_ICONS: Record<string, any> = {
  'Pool': Waves,
  'WiFi': Wifi,
  'Parking': Car,
  'Kitchen': UtensilsCrossed,
  'Garden': TreePine,
  'Spa': Sparkles,
};

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchProperty = async () => {
      try {
        const docRef = doc(db, 'properties', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() } as Property);
        }
      } catch (err) {
        console.error('Failed to fetch property:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen pt-28 pb-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="animate-pulse space-y-8">
            <div className="h-[50vh] bg-muted rounded-3xl" />
            <div className="h-8 w-1/3 bg-muted rounded-full" />
            <div className="h-4 w-2/3 bg-muted rounded-full" />
          </div>
        </div>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="min-h-screen pt-28 pb-20 bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-serif">Property Not Found</h2>
          <p className="text-muted-foreground">This property may no longer be available.</p>
          <Button onClick={() => navigate('/')} className="rounded-full bg-primary text-black">
            Back to Properties
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-20 bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 sm:px-6 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      {/* Hero Image */}
      <div className="container mx-auto px-4 sm:px-6 mb-10">
        <div className="relative aspect-[16/7] sm:aspect-[16/6] rounded-3xl overflow-hidden">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex gap-2">
            {property.sourcePlatform && (
              <Badge className="bg-primary text-black text-[10px] font-black uppercase tracking-widest border-none shadow-xl">
                Verified {property.sourcePlatform}
              </Badge>
            )}
            <Badge className="bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase border border-white/20">
              {property.category}
            </Badge>
          </div>
          <button className="absolute top-4 sm:top-6 right-4 sm:right-6 p-3 bg-black/40 backdrop-blur-md rounded-full hover:bg-black/60 transition-colors border border-white/10">
            <Heart className="w-5 h-5 text-white/80" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Left — Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Location */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{property.location}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
                {property.title}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="font-bold">{property.rating}</span>
                  <span className="text-muted-foreground text-sm">({property.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-primary">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Crypto Ready</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-serif">About This Property</h2>
              <p className="text-muted-foreground font-light leading-relaxed text-lg">
                {property.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {property.tags.map(tag => (
                <span key={tag} className="text-xs uppercase tracking-wider text-primary/80 bg-primary/5 border border-primary/20 rounded-full px-4 py-2 font-medium">
                  {tag}
                </span>
              ))}
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-serif">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {property.amenities.map(amenity => {
                    const Icon = AMENITY_ICONS[amenity] || Sparkles;
                    return (
                      <div key={amenity} className="flex items-center gap-3 p-4 bg-card border border-border rounded-2xl">
                        <Icon className="w-5 h-5 text-primary" />
                        <span className="text-sm font-light">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* How it Works (mini) */}
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-serif">How to Reserve</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif text-sm shrink-0">1</div>
                  <div>
                    <p className="text-sm font-medium">Secure with 10%</p>
                    <p className="text-xs text-muted-foreground">Pre-reservation deposit in crypto</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif text-sm shrink-0">2</div>
                  <div>
                    <p className="text-sm font-medium">Instant Booking</p>
                    <p className="text-xs text-muted-foreground">We reserve immediately</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif text-sm shrink-0">3</div>
                  <div>
                    <p className="text-sm font-medium">Complete Payment</p>
                    <p className="text-xs text-muted-foreground">Pay remaining directly</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Booking Card */}
          <div className="lg:sticky lg:top-28">
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Per Night</span>
                  <span className="text-3xl font-serif">
                    ${property.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">USD</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-primary uppercase font-bold tracking-tighter block">Crypto Ready</span>
                  <span className="text-[10px] text-muted-foreground">BTC • ETH • SOL • USDC</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pre-reservation (10%)</span>
                  <span className="font-medium">${(property.price * 0.1).toLocaleString()} /night</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Accepted tokens</span>
                  <span className="text-primary text-xs font-bold">16 tokens</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Confirmation</span>
                  <span className="text-xs">Instant</span>
                </div>
              </div>

              <Button
                onClick={() => setIsBookingOpen(true)}
                className="w-full py-6 rounded-full bg-primary text-black text-lg font-bold hover:bg-primary/90 transition-colors"
              >
                Reserve Now
              </Button>

              <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                Secure your dates with a 10% pre-reservation deposit. 
                Remaining payment details sent via email after confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        property={property}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </main>
  );
}
