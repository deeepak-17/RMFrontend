/**
 * NGO Available Donations Page (Stub)
 * Owner: Deepak (NGO)
 * Branch: feature/ngo
 *
 * TODO:
 * - Get user's location
 * - Fetch nearby donations via donationsApi.getNearby()
 * - Display on map (React-Leaflet)
 * - Allow claiming donations
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';
import type { FoodDonation } from '@/types';

export default function NgoAvailablePage() {
    const [donations, _setDonations] = useState<FoodDonation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // TODO: Get user location and fetch nearby donations
        // navigator.geolocation.getCurrentPosition(async (pos) => {
        //   const { latitude, longitude } = pos.coords;
        //   const response = await donationsApi.getNearby(latitude, longitude);
        //   setDonations(response.data.data);
        //   setIsLoading(false);
        // });
        setIsLoading(false);
    }, []);

    const handleClaim = async (donationId: string) => {
        // TODO: Call donationsApi.accept(donationId)
        console.log('Claiming donation:', donationId);
    };

    return (
        <div className="min-h-screen bg-neutral-50 p-4">
            <div className="max-w-4xl mx-auto">
                <Link to="/ngo/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                <h1 className="text-2xl font-bold mb-6">Available Donations Near You</h1>

                {/* TODO: Add Map component here */}
                <div className="h-64 bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
                    <p className="text-gray-500">Map will be displayed here (React-Leaflet)</p>
                </div>

                {isLoading ? (
                    <p className="text-center text-gray-500 py-8">Loading nearby donations...</p>
                ) : donations.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8">
                            <p className="text-gray-500">No donations available nearby right now.</p>
                            <p className="text-sm text-gray-400 mt-2">Check back later or expand your search radius.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {donations.map((donation) => (
                            <Card key={donation._id}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">{donation.title}</h3>
                                            <p className="text-sm text-gray-600">
                                                {donation.quantity} {donation.unit} • {donation.foodType}
                                            </p>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {donation.location.address || 'Location'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    Expires at {new Date(donation.expiryTime).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => handleClaim(donation._id)}
                                            className="bg-emerald-600 hover:bg-emerald-700"
                                        >
                                            Claim
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
