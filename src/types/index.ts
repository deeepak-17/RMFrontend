// User types
export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'donor' | 'ngo' | 'volunteer' | 'admin';
    organizationType?: 'restaurant' | 'canteen' | 'event' | 'shelter';
    verified: boolean;
    sustainabilityCredits: number;
    languagePref: string;
    isAvailable?: boolean;
    totalDeliveries?: number;
    totalDistance?: number;
    reliabilityScore?: number;
    completedTasks?: number;
    totalAssignedTasks?: number;
    // Volunteer Epic
    onTimePickups?: number;
    latePickups?: number;
    averageDeliveryTimeMin?: number;
    createdAt: string;
    verificationDocument?: string;
    documentType?: string;
    location?: {
        type: 'Point';
        coordinates: [number, number]; // [lng, lat]
        address?: string;
    };
}

export interface AuthResponse {
    token: string;
    user: User;
}

// Food Donation types
export interface FoodDonation {
    _id: string;
    donorId: string | User;
    title: string;
    foodType: 'veg' | 'non-veg' | 'vegan' | string;
    quantity: string; // Changed from number to string to match backend "50 plates"
    unit?: string; // Optional, inferred from quantity string
    preparedTime: string; // Backend sends this
    preparedAt?: string; // Legacy/frontend alias
    expiryTime: string;
    hygieneCert?: boolean;
    imageUrl?: string;
    location: {
        type: 'Point';
        coordinates: [number, number]; // [lng, lat]
        address?: string;
    };
    status: 'available' | 'reserved' | 'collected' | 'expired';
    // User Story 5.1 & 5.6
    riskScore?: number;
    riskFactors?: string[];
    isHighRisk?: boolean;
    emergencyMode?: boolean;
    createdAt: string;
    // NGO Workflow
    reservedBy?: string;
    reservedAt?: string;
    collectedAt?: string;
}

export interface CreateDonationInput {
    title: string;
    foodType: 'veg' | 'non-veg' | 'vegan' | string;
    quantity: number;
    unit: 'kg' | 'plates' | 'servings';
    preparedAt: string;
    location: {
        coordinates: [number, number];
        address?: string;
    };
    image?: File;
}

// Pickup Task types (Volunteer)
export interface PickupTask {
    _id: string;
    donationId: string | any;
    donation?: FoodDonation;
    volunteerId: string;
    ngoId?: any;
    status: 'assigned' | 'accepted' | 'picked' | 'delivered' | 'declined' | 'pending';
    assignedAt: string;
    pickedAt?: string;
    deliveredAt?: string;
    priority?: 'Normal' | 'High';
    // Volunteer Epic
    pickupWindowStart?: string;
    pickupWindowEnd?: string;
    liveLocation?: {
        coordinates: [number, number];
        updatedAt: string;
    };
    isEmergency?: boolean;
    emergencyAt?: string;
    missedPickup?: boolean;
    // User Story 5.3: Chain-of-Custody Tracking
    history?: Array<{
        status: string;
        timestamp: string;
        updatedBy?: string;
        note?: string;
    }>;
    pickupLocation: {
        coordinates: [number, number];
        address?: string;
    };
    deliveryLocation: {
        coordinates: [number, number];
        address?: string;
    };
}

// Impact Analytics
export interface ImpactStats {
    carbonSaved: number; // kg CO2
    mealsRecovered: number;
    creditsEarned: number;
}

// Performance Stats
export interface PerformanceStats {
    reliabilityScore: number;
    onTimeRate: number;
    totalDeliveries: number;
    totalDistance: number;
    averageRating: number;
    badge: string;
    onTimePickups: number;
    latePickups: number;
    averageDeliveryTimeMin: number;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface ApiError {
    success: false;
    message: string;
    errors?: Record<string, string>;
}
