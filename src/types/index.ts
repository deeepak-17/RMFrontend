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
    foodType: 'veg' | 'non-veg' | 'vegan';
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
    createdAt: string;
    // NGO Workflow
    reservedBy?: string;
    reservedAt?: string;
    collectedAt?: string;
}

export interface CreateDonationInput {
    title: string;
    foodType: 'veg' | 'non-veg' | 'vegan';
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
    donationId: string;
    donation?: FoodDonation;
    volunteerId: string;
    status: 'assigned' | 'accepted' | 'picked' | 'delivered';
    assignedAt: string;
    pickedAt?: string;
    deliveredAt?: string;
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
