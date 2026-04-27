import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, MapPin, Users, Search } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { t } = useTranslation();

  return (
    <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1920"
          alt="Luxury Villa"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center text-foreground">
        <p className="text-primary text-xs sm:text-sm uppercase tracking-[0.3em] font-bold mb-4">
          100% Crypto-Native Platform
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif mb-6 tracking-tight leading-[1.1]">
          {t('hero.title').split(' ').slice(0, 3).join(' ')} <br className="hidden sm:block" />
          <span className="gold-text">{t('hero.title').split(' ').slice(3).join(' ')}</span>
        </h1>
        <p className="text-base sm:text-xl md:text-2xl mb-10 sm:mb-12 max-w-2xl mx-auto text-muted-foreground font-light">
          {t('hero.subtitle')}
        </p>

        {/* Search Bar */}
        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl md:rounded-full p-2 shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-2">
          <div className="flex-1 flex items-center gap-3 px-4 py-2 w-full">
            <MapPin className="text-primary w-5 h-5 flex-shrink-0" />
            <div className="flex flex-col items-start w-full">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Destination</span>
              <Input 
                placeholder={t('hero.search_placeholder')} 
                className="border-0 p-0 h-auto focus-visible:ring-0 text-foreground placeholder:text-muted-foreground font-medium bg-transparent"
              />
            </div>
          </div>

          <div className="h-10 w-px bg-border hidden md:block" />

          <div className="flex-1 flex items-center gap-3 px-4 py-2 w-full">
            <CalendarIcon className="text-primary w-5 h-5 flex-shrink-0" />
            <Popover>
              <PopoverTrigger>
                <div className="flex flex-col items-start cursor-pointer w-full">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Check-in / Out</span>
                  <span className="text-foreground font-medium text-sm">
                    {date ? format(date, "dd MMM, yyyy") : "Select date"}
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="bg-card text-foreground"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="h-10 w-px bg-border hidden md:block" />

          <div className="flex-1 flex items-center gap-3 px-4 py-2 w-full">
            <Users className="text-primary w-5 h-5 flex-shrink-0" />
            <div className="flex flex-col items-start w-full">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Guests</span>
              <span className="text-foreground font-medium text-sm">1 Guest</span>
            </div>
          </div>

          <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-14 w-full md:w-auto font-bold">
            <Search className="w-5 h-5 mr-2" />
            {t('hero.search_button')}
          </Button>
        </div>
      </div>
    </section>
  );
}
