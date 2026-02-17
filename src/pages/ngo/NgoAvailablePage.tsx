/**
 * NGO Available Donations Page
 * Owner: Deepak (NGO)
 * Branch: feature/ngo
 *
 * Features:
 * - Display nearby donations in list and map view
 * - Filter by distance and food type
 * - Claim donations
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Clock, List, Map, Utensils, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { donationsApi } from '@/lib/api';

// Mock data - will be replaced with API calls
const mockDonations = [
    {
        _id: '1',
        title: 'Mixed Lunch Plates',
        description: 'Variety of rice, curry, vegetables, and desserts from corporate event',
        quantity: 50,
        unit: 'servings',
        foodType: 'prepared',
        donor: {
            name: 'Tech Park Canteen',
            phone: '+91 9876543210',
        },
        location: {
            address: '123 Tech Park, Sector 5',
            distance: 1.2,
            coordinates: [13.0827, 80.2707],
        },
        expiryTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        pickupWindow: {
            start: new Date().toISOString(),
            end: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        },
        status: 'available',
        servingsCount: 50,
    },
    {
        _id: '2',
        title: 'Fresh Sandwiches & Pastries',
        description: 'Assorted sandwiches and bakery items, all freshly made today',
        quantity: 40,
        unit: 'pieces',
        foodType: 'bakery',
        donor: {
            name: 'Cafe Express',
            phone: '+91 9876543211',
        },
        location: {
            address: '45 Main Street, City Center',
            distance: 2.5,
            coordinates: [13.0850, 80.2750],
        },
        expiryTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        pickupWindow: {
            start: new Date().toISOString(),
            end: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
        },
        status: 'available',
        servingsCount: 40,
    },
    {
        _id: '3',
        title: 'Vegetable Biryani',
        description: 'Leftover from wedding catering, properly stored and fresh',
        quantity: 100,
        unit: 'plates',
        foodType: 'prepared',
        donor: {
            name: 'Grand Caterers',
            phone: '+91 9876543212',
        },
        location: {
            address: '78 Wedding Hall Road',
            distance: 3.8,
            coordinates: [13.0800, 80.2650],
        },
        expiryTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        pickupWindow: {
            start: new Date().toISOString(),
            end: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(),
        },
        status: 'available',
        servingsCount: 100,
    },
    {
        _id: '4',
        title: 'Rice and Lentils',
        description: 'Simple home-style meal from temple kitchen prasadam',
        quantity: 30,
        unit: 'servings',
        foodType: 'prepared',
        donor: {
            name: 'Sri Temple Kitchen',
            phone: '+91 9876543213',
        },
        location: {
            address: '12 Temple Street',
            distance: 0.8,
            coordinates: [13.0835, 80.2720],
        },
        expiryTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour - urgent!
        pickupWindow: {
            start: new Date().toISOString(),
            end: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        },
        status: 'available',
        servingsCount: 30,
    },
];

interface Donation {
    _id: string;
    title: string;
    description: string;
    quantity: number;
    unit: string;
    foodType: string;
    donor: { name: string; phone: string };
    location: { address: string; distance: number; coordinates: number[] };
    expiryTime: string;
    pickupWindow: { start: string; end: string };
    status: string;
    servingsCount: number;
}

// Helper functions
const getTimeRemaining = (expiryTime: string) => {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const diffMs = expiry.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours <= 0 && diffMins <= 0) return 'Expired';
    if (diffHours === 0) return `${diffMins}m left`;
    return `${diffHours}h ${diffMins}m left`;
};

const isUrgent = (expiryTime: string) => {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const diffMs = expiry.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours <= 2;
};

export default function NgoAvailablePage() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
    const [claimingId, setClaimingId] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchDonations = async (lat = 0, lng = 0) => {
            try {
                setIsLoading(true);
                const response = await donationsApi.getNearby(lat, lng);
                // The backend ngoController returns { count, radiusKm, donations }
                const donationList = response.data.donations || response.data.data || (Array.isArray(response.data) ? response.data : []);
                setDonations(donationList);
            } catch (error) {
                console.error('Error fetching donations:', error);
                // Try one more time with 0,0 if specific coordinates failed
                if (lat !== 0 || lng !== 0) {
                    try {
                        const fallbackRes = await donationsApi.getNearby(0, 0);
                        const fallbackList = fallbackRes.data.donations || fallbackRes.data.data || (Array.isArray(fallbackRes.data) ? fallbackRes.data : []);
                        setDonations(fallbackList);
                    } catch (fallbackErr) {
                        console.error('Fallback error:', fallbackErr);
                    }
                }
            } finally {
                setIsLoading(false);
            }
        };

        // Try to get geolocation, but don't let it hang the UI
        if ("geolocation" in navigator) {
            const geoTimeout = setTimeout(() => {
                console.log("Geolocation timeout, fetching with defaults");
                fetchDonations(0, 0);
            }, 5000);

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    clearTimeout(geoTimeout);
                    fetchDonations(pos.coords.latitude, pos.coords.longitude);
                },
                (err) => {
                    clearTimeout(geoTimeout);
                    console.warn("Geolocation denied or failed:", err.message);
                    fetchDonations(0, 0);
                },
                { timeout: 4500 }
            );
        } else {
            fetchDonations(0, 0);
        }
    }, []);

    const handleClaim = async (donationId: string) => {
        setClaimingId(donationId);
        try {
            await donationsApi.accept(donationId);

            // Show success message
            setSuccessMessage("Donation claimed successfully! A volunteer will be assigned for transport.");

            // Update local state
            setDonations(prev => prev.map(d =>
                d._id === donationId ? { ...d, status: 'claimed' } : d
            ));

            // Clear message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (error: any) {
            console.error('Error claiming donation:', error);
            alert(error.response?.data?.message || "Failed to claim donation.");
        } finally {
            setClaimingId(null);
            setSelectedDonation(null);
        }
    };

    const sortedDonations = useMemo(() => {
        return [...donations].sort((a, b) => {
            // Sort by urgency first, then by distance
            const aUrgent = isUrgent(a.expiryTime);
            const bUrgent = isUrgent(b.expiryTime);
            if (aUrgent && !bUrgent) return -1;
            if (!aUrgent && bUrgent) return 1;
            return a.location.distance - b.location.distance;
        });
    }, [donations]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
                <div className="max-w-6xl mx-auto p-4">
                    {successMessage && (
                        <div className="mb-4 p-4 bg-emerald-100 text-emerald-700 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
                            <CheckCircle2 className="w-5 h-5" />
                            {successMessage}
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link to="/ngo/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Available Donations</h1>
                                <p className="text-sm text-gray-500">{donations.filter(d => d.status === 'available').length} donations near you</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                                className={viewMode === 'list' ? 'bg-emerald-600' : ''}
                            >
                                <List className="w-4 h-4 mr-1" /> List
                            </Button>
                            <Button
                                variant={viewMode === 'map' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('map')}
                                className={viewMode === 'map' ? 'bg-emerald-600' : ''}
                            >
                                <Map className="w-4 h-4 mr-1" /> Map
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-4">
                {viewMode === 'map' ? (
                    /* Map View */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Map Container */}
                        <div className="lg:col-span-2 h-[500px] bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl border-2 border-dashed border-emerald-300 flex flex-col items-center justify-center">
                            <Map className="w-16 h-16 text-emerald-400 mb-4" />
                            <p className="text-emerald-700 font-medium text-lg">Interactive Map</p>
                            <p className="text-emerald-600 text-sm mt-2 text-center max-w-xs">
                                Map integration coming soon! Install react-leaflet to enable.
                            </p>
                            <code className="mt-4 text-xs bg-emerald-200 text-emerald-800 px-3 py-1 rounded">
                                npm install react-leaflet leaflet
                            </code>
                        </div>

                        {/* Sidebar list */}
                        <div className="space-y-3 max-h-[500px] overflow-y-auto">
                            {sortedDonations.map((donation) => (
                                <Card
                                    key={donation._id}
                                    className={`cursor-pointer transition-all hover:shadow-md ${selectedDonation?._id === donation._id ? 'ring-2 ring-emerald-500' : ''
                                        } ${donation.status === 'claimed' ? 'opacity-60' : ''}`}
                                    onClick={() => setSelectedDonation(donation)}
                                >
                                    <CardContent className="p-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-sm">{donation.title || 'Untitled'}</h4>
                                                <p className="text-xs text-gray-500">{donation.donor?.name || 'Unknown'}</p>
                                            </div>
                                            {donation.expiryTime && isUrgent(donation.expiryTime) && donation.status === 'available' && (
                                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                                                    Urgent
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> {donation.location?.distance || 0} km
                                            </span>
                                            {donation.expiryTime && (
                                                <span className={`flex items-center gap-1 ${isUrgent(donation.expiryTime) ? 'text-red-600 font-medium' : ''}`}>
                                                    <Clock className="w-3 h-3" /> {getTimeRemaining(donation.expiryTime)}
                                                </span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* List View */
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
                            </div>
                        ) : sortedDonations.length === 0 ? (
                            <Card className="bg-white">
                                <CardContent className="text-center py-12">
                                    <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-600 font-medium">No donations available nearby</p>
                                    <p className="text-sm text-gray-400 mt-2">Check back later or expand your search radius</p>
                                </CardContent>
                            </Card>
                        ) : (
                            sortedDonations.map((donation) => (
                                <Card
                                    key={donation._id}
                                    className={`bg-white transition-all hover:shadow-md ${donation.status === 'claimed' ? 'opacity-60 bg-gray-50' : ''
                                        } ${isUrgent(donation.expiryTime) && donation.status === 'available' ? 'border-l-4 border-l-orange-500' : ''}`}
                                >
                                    <CardContent className="p-5">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                                        <Utensils className="w-5 h-5 text-emerald-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h3 className="font-semibold text-lg text-gray-900">{donation.title}</h3>
                                                            {isUrgent(donation.expiryTime) && donation.status === 'available' && (
                                                                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full flex items-center gap-1">
                                                                    <AlertCircle className="w-3 h-3" /> Urgent
                                                                </span>
                                                            )}
                                                            {donation.status === 'claimed' && (
                                                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                                                                    <CheckCircle2 className="w-3 h-3" /> Claimed
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-600 text-sm mt-1">{donation.description}</p>

                                                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                                                            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                                                                <Users className="w-4 h-4" />
                                                                {donation.servingsCount} servings
                                                            </span>
                                                            <span className="flex items-center gap-1 text-gray-600">
                                                                <MapPin className="w-4 h-4" />
                                                                {donation.location.address} ({donation.location.distance} km)
                                                            </span>
                                                            <span className={`flex items-center gap-1 ${isUrgent(donation.expiryTime) ? 'text-orange-600 font-medium' : 'text-gray-600'}`}>
                                                                <Clock className="w-4 h-4" />
                                                                {getTimeRemaining(donation.expiryTime)}
                                                            </span>
                                                        </div>

                                                        <div className="mt-3 text-sm text-gray-500">
                                                            <span className="font-medium">From:</span> {donation.donor?.name || 'Unknown Donor'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 md:items-end">
                                                {donation.status === 'available' ? (
                                                    <Button
                                                        onClick={() => handleClaim(donation._id)}
                                                        disabled={claimingId === donation._id}
                                                        className="bg-emerald-600 hover:bg-emerald-700 min-w-[120px]"
                                                    >
                                                        {claimingId === donation._id ? (
                                                            <span className="flex items-center gap-2">
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                                Claiming...
                                                            </span>
                                                        ) : (
                                                            'Claim Now'
                                                        )}
                                                    </Button>
                                                ) : (
                                                    <Button disabled variant="outline" className="min-w-[120px]">
                                                        Claimed
                                                    </Button>
                                                )}
                                                {donation.pickupWindow?.end && (
                                                    <p className="text-xs text-gray-400">
                                                        Pickup: {new Date(donation.pickupWindow.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Claim Confirmation Modal */}
            {selectedDonation && viewMode === 'map' && (
                <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
                    <Card className="w-full max-w-lg bg-white rounded-t-2xl">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-bold mb-2">{selectedDonation.title}</h3>
                            <p className="text-gray-600 text-sm mb-4">{selectedDonation.description}</p>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-sm">
                                    <Users className="w-4 h-4 text-emerald-600" />
                                    <span>{selectedDonation.servingsCount} servings available</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    <span>{selectedDonation.location.address}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="w-4 h-4 text-orange-500" />
                                    <span>Expires in {getTimeRemaining(selectedDonation.expiryTime)}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setSelectedDonation(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                    onClick={() => handleClaim(selectedDonation._id)}
                                    disabled={claimingId === selectedDonation._id || selectedDonation.status === 'claimed'}
                                >
                                    {selectedDonation.status === 'claimed' ? 'Already Claimed' : 'Claim This Donation'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
