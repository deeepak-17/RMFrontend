// User types
export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'donor' | 'ngo' | 'volunteer' | 'admin';
    organizationType?: 'restaurant' | 'canteen' | 'event' | 'shelter';
    verificationStatus: 'pending' | 'verified' | 'rejected';
    sustainabilityCredits: number;
    languagePref: string;
    createdAt: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

// Food Donation types
export interface FoodDonation {
    _id: string;
    donorId: string;
    title: string;
    foodType: 'veg' | 'non-veg' | 'vegan';
    quantity: number;
    unit: 'kg' | 'plates' | 'servings';
    preparedAt: string;
    expiryTime: string;
    hygieneCert: boolean;
    imageUrl?: string;
    location: {
        type: 'Point';
        coordinates: [number, number]; // [lng, lat]
        address?: string;
    };
    status: 'available' | 'reserved' | 'collected' | 'expired';
    createdAt: string;
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
