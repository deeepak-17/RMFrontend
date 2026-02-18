/**
 * Donor History Page
 * Owner: Member 3 (Donor)
 * Branch: feature/donor
 *
 * IMPLEMENTED:
 * - Fetch donor's donations from donationsApi.getMyDonations()
 * - Display as cards with status badges
 * - Add edit/delete buttons for active donations
 * - Filter by status (available, reserved, collected, expired)
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, RefreshCw, Loader2, PackageOpen, Edit, Trash2, Clock, MapPin } from 'lucide-react';
import { donationsApi } from '@/lib/api';
import type { FoodDonation } from '@/types';

// Status badge component
function StatusBadge({ status }: { status: FoodDonation['status'] }) {
    const styles = {
        available: 'bg-green-100 text-green-700',
        reserved: 'bg-yellow-100 text-yellow-700',
        collected: 'bg-blue-100 text-blue-700',
        expired: 'bg-red-100 text-red-700',
    };

    return (
        <span className={`px-2 py-1 text-xs rounded-full ${styles[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

// Calculate time remaining until expiry
function getTimeRemaining(expiryTime: string): string {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
}

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChainOfCustodyTimeline } from "@/components/donation/ChainOfCustodyTimeline";

export default function DonorHistoryPage() {
    const [donations, setDonations] = useState<FoodDonation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | FoodDonation['status']>('all');

    const fetchDonations = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await donationsApi.getMyDonations();
            setDonations(response.data.data || response.data || []);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load donations.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    // Delete handler
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this donation?')) return;

        try {
            setDeletingId(id);
            await donationsApi.delete(id);
            setDonations(donations.filter((d) => d._id !== id));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete donation.');
        } finally {
            setDeletingId(null);
        }
    };

    // Filtered donations
    const filteredDonations = filter === 'all'
        ? donations
        : donations.filter((d) => d.status === filter);

    // Stats
    const stats = {
        total: donations.length,
        available: donations.filter((d) => d.status === 'available').length,
        reserved: donations.filter((d) => d.status === 'reserved').length,
        collected: donations.filter((d) => d.status === 'collected').length,
    };

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-neutral-50 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <Link to="/donor/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={fetchDonations} disabled={isLoading}>
                            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Link to="/donor/add">
                            <Button className="bg-emerald-600 hover:bg-emerald-700">
                                <Plus className="w-4 h-4 mr-2" />
                                New Donation
                            </Button>
                        </Link>
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-4">My Donations</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Total', value: stats.total, filter: 'all' as const },
                        { label: 'Available', value: stats.available, filter: 'available' as const },
                        { label: 'Reserved', value: stats.reserved, filter: 'reserved' as const },
                        { label: 'Collected', value: stats.collected, filter: 'collected' as const },
                    ].map((stat) => (
                        <Card
                            key={stat.label}
                            className={`cursor-pointer transition-shadow hover:shadow-md ${filter === stat.filter ? 'ring-2 ring-emerald-500' : ''}`}
                            onClick={() => setFilter(stat.filter)}
                        >
                            <CardContent className="p-4 text-center">
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                        <Loader2 className="w-10 h-10 mb-4 animate-spin text-emerald-600" />
                        <p>Loading your donations...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="py-8 text-center">
                            <p className="mb-4 text-red-600">{error}</p>
                            <Button variant="outline" onClick={fetchDonations}>
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Empty State */}
                {!isLoading && !error && donations.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-16">
                            <PackageOpen className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                            <p className="text-gray-500 mb-4">You haven't posted any donations yet.</p>
                            <Link to="/donor/add">
                                <Button className="bg-emerald-600 hover:bg-emerald-700">
                                    Post Your First Donation
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {/* Donations List */}
                {!isLoading && !error && filteredDonations.length > 0 && (
                    <div className="space-y-4">
                        {filteredDonations.map((donation) => (
                            <Card key={donation._id}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-4">
                                            {/* Image */}
                                            {donation.imageUrl && (
                                                <img
                                                    src={`http://localhost:5001${donation.imageUrl}`}
                                                    alt={donation.title}
                                                    className="w-20 h-20 rounded-lg object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = "/placeholder-food.jpg";
                                                    }}
                                                />
                                            )}
                                            <div>
                                                <h3 className="font-semibold text-lg">{donation.title}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {/* Quantity is now a string like "50 plates" */}
                                                    {donation.quantity} • {donation.foodType}
                                                </p>
                                                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {getTimeRemaining(donation.expiryTime)}
                                                    </span>
                                                    {donation.location?.address && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-4 h-4" />
                                                            {donation.location.address}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <StatusBadge status={donation.status} />

                                            {/* Track Button (Dialog) */}
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="ml-2 gap-1">
                                                        <Clock className="w-3 h-3" /> Track
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle>Donation Journey</DialogTitle>
                                                    </DialogHeader>
                                                    <ChainOfCustodyTimeline donation={donation} />
                                                </DialogContent>
                                            </Dialog>

                                            {/* Edit/Delete buttons - only for available donations */}
                                            {donation.status === 'available' && (
                                                <div className="flex gap-1 ml-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => navigate(`/donor/edit/${donation._id}`)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(donation._id)}
                                                        disabled={deletingId === donation._id}
                                                    >
                                                        {deletingId === donation._id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        )}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
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
