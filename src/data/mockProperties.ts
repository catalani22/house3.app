import { Property } from "../types";

export const mockProperties: Property[] = [
  {
    id: "1",
    title: "Villa Azure - Angra dos Reis",
    description: "Mansão cinematográfica com pé na areia, heliponto privado e 7 suítes de luxo.",
    price: 15000,
    location: "Angra dos Reis, RJ",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
    rating: 5.0,
    reviews: 42,
    amenities: ["Heliponto", "Piscina Infinita", "Chef Privado", "Automação"],
    category: "Villa",
    tags: ["Exclusivo", "Beira Mar"],
    sourcePlatform: "Airbnb Luxe"
  },
  {
    id: "2",
    title: "Penthouse Prestige - Itaim Bibi",
    description: "Cobertura triplex com vista 360º de São Paulo, piscina privativa e adega climatizada.",
    price: 8500,
    location: "Itaim Bibi, São Paulo",
    image: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&q=80&w=1200",
    rating: 4.9,
    reviews: 28,
    amenities: ["Piscina Privativa", "Adega", "Concierge 24h", "Academia"],
    category: "Luxury Apartment",
    tags: ["Skyline", "Design"],
    sourcePlatform: "Housi Premium"
  },
  {
    id: "3",
    title: "Mansion Emerald - Trancoso",
    description: "Refúgio de luxo no Quadrado, integrando natureza e sofisticação em cada detalhe.",
    price: 12000,
    location: "Trancoso, Bahia",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200",
    rating: 4.9,
    reviews: 15,
    amenities: ["Jardim Tropical", "Piscina", "Staff Completo", "Wi-Fi Starlink"],
    category: "Mansion",
    tags: ["Natureza", "Privacidade"],
    sourcePlatform: "Vrbo Luxury"
  },
  {
    id: "4",
    title: "Beach House Diamond - Florianópolis",
    description: "Casa de vidro sobre as rochas com acesso direto à praia e pôr do sol inesquecível.",
    price: 9800,
    location: "Jurerê Internacional, SC",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1200",
    rating: 4.8,
    reviews: 33,
    amenities: ["Acesso Praia", "Jacuzzi", "Espaço Gourmet", "Segurança"],
    category: "Beach House",
    tags: ["Vista Mar", "Moderno"],
    sourcePlatform: "Airbnb"
  }
];
