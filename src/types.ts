export interface Property {
  id: string;
  title: string;
  description: string;
  price: number; // Price in USD or BRL
  location: string;
  image: string;
  rating: number;
  reviews: number;
  amenities: string[];
  category: 'Villa' | 'Beach House' | 'Mansion' | 'Luxury Apartment';
  tags: string[];
  sourcePlatform?: string; // Airbnb, Vrbo, etc.
  originalUrl?: string;
  ownerId?: string;
  isClaimed?: boolean;
  lastAvailabilityCheck?: string;
}

export interface SearchFilters {
  location: string;
  checkIn?: Date;
  checkOut?: Date;
  guests: number;
}

export interface UserProfile {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  role: 'user' | 'admin';
  walletAddress?: string;
}

export interface OwnerProfile {
  userId: string;
  walletAddress: string;
  preferredToken: string;
  termsAccepted: boolean;
  termsAcceptedAt: string | null;
}

export interface ClaimRequest {
  id: string;
  propertyId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  proofUrl?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  propertyId: string;
  checkIn: Date;
  checkOut: Date;
  totalAmount: number;
  depositAmount: number;
  originalAmount?: number;
  currency: string;
  paymentStatus: 'pending_deposit' | 'deposit_confirmed' | 'awaiting_full_payment' | 'fully_paid';
  arbitrageStatus: 'pending' | 'booked_on_source' | 'voucher_sent' | 'cancelled';
  sourcePlatform?: string;
  cryptoCurrency: 'BTC' | 'ETH' | 'SOL' | 'USDC';
  cryptoAmount: number;
  createdAt: Date;
  transactionHash?: string;
}
