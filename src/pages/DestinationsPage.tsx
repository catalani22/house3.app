import { useState } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  image: string;
  properties: number;
  priceFrom: number;
  description: string;
  tags: string[];
}

const destinations: Destination[] = [
  {
    id: 'santorini',
    name: 'Santorini',
    country: 'Greece',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800',
    properties: 24,
    priceFrom: 2800,
    description: 'Iconic cliffside villas with infinity pools overlooking the Aegean caldera.',
    tags: ['Villas', 'Sea View', 'Romantic'],
  },
  {
    id: 'maldives',
    name: 'Maldives',
    country: 'Maldives',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800',
    properties: 18,
    priceFrom: 5500,
    description: 'Overwater bungalows and private island estates in crystal-clear waters.',
    tags: ['Private Island', 'Overwater', 'Diving'],
  },
  {
    id: 'amalfi',
    name: 'Amalfi Coast',
    country: 'Italy',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&q=80&w=800',
    properties: 31,
    priceFrom: 3200,
    description: 'Historic Mediterranean estates perched above dramatic coastal cliffs.',
    tags: ['Historic', 'Coastal', 'Gastronomy'],
  },
  {
    id: 'stbarts',
    name: 'St. Barths',
    country: 'Caribbean',
    region: 'Caribbean',
    image: 'https://images.unsplash.com/photo-1580541631950-7282082b04fe?auto=format&fit=crop&q=80&w=800',
    properties: 42,
    priceFrom: 4800,
    description: 'The ultimate Caribbean luxury — pristine beaches and celebrity-level privacy.',
    tags: ['Beach', 'Privacy', 'Celebrity'],
  },
  {
    id: 'aspen',
    name: 'Aspen',
    country: 'United States',
    region: 'Americas',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800',
    properties: 15,
    priceFrom: 6200,
    description: 'Mountain chalets with ski-in/ski-out access and panoramic alpine views.',
    tags: ['Ski', 'Mountain', 'Winter'],
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800',
    properties: 28,
    priceFrom: 1800,
    description: 'Tropical jungle estates and beachfront villas with Balinese luxury.',
    tags: ['Tropical', 'Wellness', 'Culture'],
  },
  {
    id: 'cotedazur',
    name: "Côte d'Azur",
    country: 'France',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&q=80&w=800',
    properties: 36,
    priceFrom: 4200,
    description: 'French Riviera mansions from Monaco to Saint-Tropez — the epitome of glamour.',
    tags: ['Glamour', 'Yacht', 'Nightlife'],
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    region: 'Middle East',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800',
    properties: 22,
    priceFrom: 3800,
    description: 'Ultra-modern penthouses and palm island estates in the city of the future.',
    tags: ['Modern', 'Penthouse', 'Desert'],
  },
  {
    id: 'toscana',
    name: 'Tuscany',
    country: 'Italy',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1523528283115-9bf9b1699245?auto=format&fit=crop&q=80&w=800',
    properties: 19,
    priceFrom: 2400,
    description: 'Rolling vineyards and centuries-old estates in the heart of Italian wine country.',
    tags: ['Vineyard', 'Historic', 'Rural'],
  },
  {
    id: 'ibiza',
    name: 'Ibiza',
    country: 'Spain',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&q=80&w=800',
    properties: 27,
    priceFrom: 3500,
    description: 'Minimalist luxury villas with sunset views and access to the world\'s best nightlife.',
    tags: ['Nightlife', 'Sunset', 'Modern'],
  },
  {
    id: 'swiss-alps',
    name: 'Swiss Alps',
    country: 'Switzerland',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&q=80&w=800',
    properties: 12,
    priceFrom: 8500,
    description: 'Elite alpine chalets in Zermatt, Verbier, and St. Moritz with private spas.',
    tags: ['Ski', 'Spa', 'Exclusive'],
  },
  {
    id: 'mykonos',
    name: 'Mykonos',
    country: 'Greece',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&q=80&w=800',
    properties: 20,
    priceFrom: 3100,
    description: 'Cycladic-style villas with private pools overlooking the Aegean Sea.',
    tags: ['Party', 'Beach', 'Design'],
  },
];

const regions = ['All', ...new Set(destinations.map(d => d.region))];

export default function DestinationsPage() {
  const [activeRegion, setActiveRegion] = useState('All');

  const filtered = activeRegion === 'All'
    ? destinations
    : destinations.filter(d => d.region === activeRegion);

  return (
    <main className="min-h-screen pt-28 pb-20 bg-background">
      {/* Hero */}
      <div className="container mx-auto px-4 sm:px-6 mb-12 sm:mb-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <p className="text-primary text-xs uppercase tracking-[0.3em] font-bold">
            Curated Worldwide
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif">
            Extraordinary <span className="gold-text">Destinations</span>
          </h1>
          <p className="text-muted-foreground font-light text-lg">
            Only the world's most exclusive locations. Ultra-premium properties in destinations
            where luxury meets lifestyle.
          </p>
        </div>
      </div>

      {/* Region Filter */}
      <div className="container mx-auto px-4 sm:px-6 mb-10">
        <div className="flex flex-wrap justify-center gap-3">
          {regions.map(region => (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              className={cn(
                'px-5 py-2.5 rounded-full text-sm font-medium transition-all border',
                activeRegion === region
                  ? 'bg-primary text-black border-primary'
                  : 'bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              )}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Destination Grid */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map(dest => (
            <div
              key={dest.id}
              className="group relative bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/40 transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
                    <MapPin className="w-3 h-3" />
                    <span>{dest.country}</span>
                  </div>
                  <h3 className="text-2xl font-serif text-white">{dest.name}</h3>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-primary/90 text-black text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                    {dest.properties} Properties
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground font-light leading-relaxed line-clamp-2">
                  {dest.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {dest.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-wider text-primary/80 bg-primary/5 border border-primary/20 rounded-full px-3 py-1 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">From</span>
                    <span className="font-serif text-lg">${dest.priceFrom.toLocaleString()}<span className="text-xs text-muted-foreground ml-1">/night</span></span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                    <ArrowRight className="w-4 h-4 text-primary group-hover:text-black" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-4 sm:px-6 mt-16 sm:mt-20">
        <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 text-center">
          <h3 className="text-2xl sm:text-3xl font-serif mb-3">
            Don't see your <span className="gold-text">destination</span>?
          </h3>
          <p className="text-muted-foreground font-light mb-6 max-w-xl mx-auto">
            Our concierge team sources ultra-premium properties in any location worldwide.
            Tell us where you want to go.
          </p>
          <a
            href="mailto:concierge@house3.app"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-black font-semibold rounded-full hover:bg-primary/90 transition-colors"
          >
            Request a Destination
          </a>
        </div>
      </div>
    </main>
  );
}
