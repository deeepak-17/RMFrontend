/**
 * Donor History Page (Stub)
 * Owner: Member 3 (Donor)
 * Branch: feature/donor
 *
 * TODO:
 * - Fetch donor's donations from donationsApi.getMyDonations()
 * - Display as cards with status badges
 * - Add edit/delete buttons for active donations
 * - Filter by status (available, reserved, collected, expired)
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import type { FoodDonation } from '@/types';

export default function DonorHistoryPage() {
    const [donations, _setDonations] = useState<FoodDonation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch donations from API
        // const fetchDonations = async () => {
        //   const response = await donationsApi.getMyDonations();
        //   setDonations(response.data.data);
        //   setIsLoading(false);
        // };
        // fetchDonations();
        setIsLoading(false);
    }, []);

    return (
        <div className="min-h-screen bg-neutral-50 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <Link to="/donor/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <Link to="/donor/add">
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="w-4 h-4 mr-2" />
                            New Donation
                        </Button>
                    </Link>
                </div>

                <h1 className="text-2xl font-bold mb-6">My Donations</h1>

                {isLoading ? (
                    <p className="text-center text-gray-500 py-8">Loading...</p>
                ) : donations.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8">
                            <p className="text-gray-500 mb-4">You haven't posted any donations yet.</p>
                            <Link to="/donor/add">
                                <Button className="bg-emerald-600 hover:bg-emerald-700">
                                    Post Your First Donation
                                </Button>
                            </Link>
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
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full ${donation.status === 'available' ? 'bg-green-100 text-green-700' :
                                            donation.status === 'reserved' ? 'bg-yellow-100 text-yellow-700' :
                                                donation.status === 'collected' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {donation.status}
                                        </span>
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
