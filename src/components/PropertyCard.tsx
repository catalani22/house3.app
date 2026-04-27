import React, { useState } from "react";
import { Property } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Heart } from "lucide-react";
import { motion } from "motion/react";
import BookingModal from "./BookingModal";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        onClick={() => setIsBookingOpen(true)}
      >
        <Card className="overflow-hidden border border-border bg-card shadow-lg rounded-2xl group cursor-pointer h-full flex flex-col hover:border-primary/50 transition-all duration-300">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              {property.sourcePlatform && (
                <Badge className="bg-primary text-black text-[9px] font-black uppercase tracking-widest border-none shadow-xl">
                  Verified {property.sourcePlatform}
                </Badge>
              )}
            </div>
            <div className="absolute top-4 right-4 z-10">
              <button 
                className="p-2 bg-black/40 backdrop-blur-md rounded-full hover:bg-black/60 transition-colors border border-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle favorite
                }}
              >
                <Heart className="w-5 h-5 text-white/80 hover:text-primary transition-colors" />
              </button>
            </div>
            <div className="absolute bottom-4 left-4 flex gap-2">
              {property.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-black/60 backdrop-blur-md text-primary text-[10px] font-bold uppercase border border-primary/20">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <CardContent className="p-5 flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{property.category}</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-primary text-primary" />
                <span className="text-xs font-bold text-foreground">{property.rating}</span>
                <span className="text-xs text-muted-foreground">({property.reviews})</span>
              </div>
            </div>
            
            <h3 className="text-xl font-serif mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            
            <div className="flex items-center gap-1 text-muted-foreground mb-3">
              <MapPin className="w-3 h-3" />
              <span className="text-xs">{property.location}</span>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 font-light">
              {property.description}
            </p>
          </CardContent>
          
          <CardContent className="p-5 pt-0 flex items-center justify-between border-t border-border mt-auto">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Diária</span>
              <span className="text-xl font-serif text-foreground">
                $ {property.price.toLocaleString('en-US')}
                <span className="text-xs font-sans font-normal text-muted-foreground ml-1">USD</span>
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-primary uppercase font-bold tracking-tighter">Crypto Ready</span>
              <span className="text-[10px] text-muted-foreground">BTC • ETH • SOL</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <BookingModal 
        property={property} 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </>
  );
};

export default PropertyCard;
