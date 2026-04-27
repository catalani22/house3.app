// ─── Source Platform Booking Rules (comes from scraping/API/sync) ─────────────
export interface SourcePlatformRules {
  // Platform identification
  platformName: string;
  platformId?: string;
  originalListingUrl?: string;

  // Accepted payment tokens (CRITICAL — we can only offer these to the guest)
  acceptedTokens: string[];
  acceptedChains: string[];

  // Booking constraints
  minNights: number;
  maxNights?: number;
  maxGuests: number;
  checkInTime: string;   // e.g. "15:00"
  checkOutTime: string;  // e.g. "11:00"
  advanceBookingDays: number; // min days in advance to book

  // Required guest fields (varies by platform)
  requiredFields: ('fullName' | 'email' | 'phone' | 'nationality' | 'passport' | 'idCard' | 'address' | 'age')[];

  // Pricing from source (real values synced)
  cleaningFee: number;
  serviceFeePercent: number;
  taxPercent: number;
  securityDeposit?: number;

  // Cancellation policy
  cancellationPolicy: 'flexible' | 'moderate' | 'strict' | 'non_refundable';
  cancellationDetails: string;

  // House rules
  houseRules: string[];

  // Calendar sync
  calendarSyncUrl?: string;
  lastSyncAt?: string;
  blockedDates?: string[]; // ISO date strings
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number; // Nightly price in USD (already with our 10% markup applied)
  location: string;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  amenities: string[];
  category: 'Villa' | 'Beach House' | 'Mansion' | 'Luxury Apartment' | 'Penthouse' | 'Chalet' | 'Estate';
  tags: string[];

  // Source platform data (populated from scraping/API/sync)
  sourcePlatform?: string;
  sourceRules?: SourcePlatformRules;
  originalUrl?: string;
  originalPrice?: number; // Real price on source platform (without our markup)

  // Owner-listed properties
  ownerId?: string;
  isClaimed?: boolean;
  isOwnerListed?: boolean;

  // Sync metadata
  lastAvailabilityCheck?: string;
  availabilityStatus?: 'available' | 'unavailable' | 'pending_check';
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

export interface GuestInfo {
  fullName: string;
  email: string;
  phone: string;
  nationality?: string;
  documentType?: 'passport' | 'id_card' | 'drivers_license';
  documentNumber?: string;
  address?: string;
  specialRequests?: string;
}

export interface BookingPricing {
  nightlyRate: number;
  nights: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  taxes: number;
  totalAmount: number;
  depositAmount: number; // 10% pre-reservation
  remainingAmount: number; // 90% paid to source platform
  currency: 'USD';
}

export interface Booking {
  id: string;
  userId: string;
  propertyId: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: number;

  // Guest data (all fields required by source platform)
  guestDetails: GuestInfo;

  // Full pricing breakdown
  pricing: BookingPricing;

  // Payment details
  payment: {
    cryptoCurrency: string;
    cryptoAmount: number;
    walletAddress: string;
    chain: string;
    transactionHash?: string;
  };

  // Source platform management
  sourcePlatform: string;
  sourceBookingRef?: string; // Ref from source platform after we book
  paymentStatus: 'pending_deposit' | 'deposit_confirmed' | 'awaiting_full_payment' | 'fully_paid';
  arbitrageStatus: 'pending' | 'booked_on_source' | 'voucher_sent' | 'cancelled';

  createdAt: Date;
  updatedAt?: Date;
}
