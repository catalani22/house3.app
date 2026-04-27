import { mockProperties } from "../data/mockProperties";
import PropertyCard from "./PropertyCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, addDoc, getDocs } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { Property } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

export default function PropertyGrid() {
  const [activeTab, setActiveTab] = useState("all");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const path = 'properties';
    const q = query(collection(db, path));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const propsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Property[];
      
      setProperties(propsData);
      setLoading(false);

      // Seed data if empty (for demo purposes)
      if (snapshot.empty) {
        seedData();
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, []);

  const seedData = async () => {
    try {
      console.log("Seeding initial properties...");
      for (const prop of mockProperties) {
        const { id, ...propWithoutId } = prop;
        await addDoc(collection(db, 'properties'), propWithoutId);
      }
    } catch (error) {
      console.warn("Seeding failed (likely insufficient permissions):", error);
      // Don't throw here to avoid crashing the app for non-admins
    }
  };

  const filteredProperties = activeTab === "all" 
    ? properties 
    : properties.filter(p => p.category.toLowerCase() === activeTab.toLowerCase());

  return (
    <section className="py-16 sm:py-20 container mx-auto px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-serif mb-3">
            {t('grid.title').split(' ').slice(0, -1).join(' ')} <span className="gold-text">{t('grid.title').split(' ').slice(-1)}</span>
          </h2>
          <p className="text-muted-foreground max-w-xl font-light">
            {t('grid.subtitle')}
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
          <TabsList className="bg-muted p-1 rounded-full h-12 border border-border overflow-x-auto flex w-full md:w-auto no-scrollbar">
            <TabsTrigger value="all" className="rounded-full px-4 sm:px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold whitespace-nowrap text-xs sm:text-sm">{t('categories.all')}</TabsTrigger>
            <TabsTrigger value="villa" className="rounded-full px-4 sm:px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold whitespace-nowrap text-xs sm:text-sm">{t('categories.villa')}</TabsTrigger>
            <TabsTrigger value="beach house" className="rounded-full px-4 sm:px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold whitespace-nowrap text-xs sm:text-sm">{t('categories.beach')}</TabsTrigger>
            <TabsTrigger value="mansion" className="rounded-full px-4 sm:px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold whitespace-nowrap text-xs sm:text-sm">{t('categories.mansion')}</TabsTrigger>
            <TabsTrigger value="luxury apartment" className="rounded-full px-4 sm:px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold whitespace-nowrap text-xs sm:text-sm">{t('categories.apartment')}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[4/3] w-full rounded-2xl bg-muted" />
              <Skeleton className="h-4 w-3/4 bg-muted" />
              <Skeleton className="h-4 w-1/2 bg-muted" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </section>
  );
}
