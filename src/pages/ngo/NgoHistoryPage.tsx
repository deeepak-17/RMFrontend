/**
 * NGO History Page
 * Owner: Deepak (NGO)
 * Branch: feature/ngo
 *
 * Features:
 * - Display claimed and collected donations
 * - Filter by status and date
 * - Show impact summary
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, Users, Leaf, Calendar, MapPin, CheckCircle2, Clock, Filter, Loader2 } from 'lucide-react';
import { donationsApi } from '@/lib/api';
import { FoodDonation } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChainOfCustodyTimeline } from "@/components/donation/ChainOfCustodyTimeline";
import { toast } from 'sonner';

export default function NgoHistoryPage() {
    const [collections, setCollections] = useState<FoodDonation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'collected' | 'reserved' | 'expired'>('all');

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const response = await donationsApi.getNgoHistory();
            setCollections(response.data || []);
        } catch (error) {
            console.error("Failed to load history", error);
            toast.error("Failed to load collection history");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const filteredCollections = filter === 'all'
        ? collections
        : collections.filter(c => c.status === filter);

    const stats = {
        totalCollections: collections.filter(c => c.status === 'collected').length,
        peopleFed: collections.filter(c => c.status === 'collected').length * 4, // Mock calculation: 4 people per donation? Or parse quantity?
        co2Saved: collections.filter(c => c.status === 'collected').length * 2.5, // Mock CO2: 2.5kg per donation
        pending: collections.filter(c => c.status === 'reserved').length,
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'collected':
                return (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Collected
                    </span>
                );
            case 'reserved':
                return (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Reserved
                    </span>
                );
            case 'expired':
                return (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Expired
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                        {status}
                    </span>
                );
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link to="/ngo/dashboard" className="p-2 hover:bg-white rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Collection History</h1>
                        <p className="text-gray-600">Track your rescued food impact</p>
                    </div>
                </div>

                {/* Impact Summary */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-white shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Total Collections</p>
                                    <p className="text-2xl font-bold text-emerald-600">{stats.totalCollections}</p>
                                </div>
                                <div className="p-3 bg-emerald-100 rounded-full">
                                    <Package className="w-5 h-5 text-emerald-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">People Fed</p>
                                    <p className="text-2xl font-bold text-blue-600">{stats.peopleFed}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">CO₂ Saved</p>
                                    <p className="text-2xl font-bold text-teal-600">{stats.co2Saved} kg</p>
                                </div>
                                <div className="p-3 bg-teal-100 rounded-full">
                                    <Leaf className="w-5 h-5 text-teal-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Pending Pickups</p>
                                    <p className="text-2xl font-bold text-orange-500">{stats.pending}</p>
                                </div>
                                <div className="p-3 bg-orange-100 rounded-full">
                                    <Clock className="w-5 h-5 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-500 mr-2">
                        <Filter className="w-4 h-4 inline-block mr-1" /> Filter:
                    </span>
                    {['all', 'collected', 'reserved'].map((status) => (
                        <Button
                            key={status}
                            variant={filter === status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter(status as any)}
                            className={filter === status ? 'bg-emerald-600' : ''}
                        >
                            {status === 'all' ? 'All' :
                                status.charAt(0).toUpperCase() + status.slice(1)}
                        </Button>
                    ))}
                </div>

                {/* Collection List */}
                <Card className="bg-white shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            Recent Collections ({filteredCollections.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="animate-spin w-8 h-8 text-emerald-500" />
                            </div>
                        ) : filteredCollections.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-600 font-medium">No collections found</p>
                                <p className="text-sm text-gray-400 mt-2">
                                    {filter !== 'all' ? 'Try changing the filter or ' : ''}
                                    Start by claiming available donations
                                </p>
                                <Link to="/ngo/available">
                                    <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                                        Find Donations
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredCollections.map((collection) => (
                                    <div
                                        key={collection._id}
                                        className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`p-2 rounded-lg ${collection.status === 'collected' ? 'bg-green-100' :
                                                'bg-yellow-100'
                                                }`}>
                                                <Package className={`w-5 h-5 ${collection.status === 'collected' ? 'text-green-600' :
                                                    'text-yellow-600'
                                                    }`} />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{collection.title}</h4>
                                                <p className="text-sm text-gray-600">From: {(typeof collection.donorId === 'object' ? collection.donorId?.name : null) || 'Unknown Donor'}</p>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" /> {collection.location?.address || 'No address'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(collection.status)}

                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                                                            <Clock className="w-3 h-3" /> Track
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-md">
                                                        <DialogHeader>
                                                            <DialogTitle>Chain of Custody</DialogTitle>
                                                        </DialogHeader>
                                                        <ChainOfCustodyTimeline donation={collection} />
                                                    </DialogContent>
                                                </Dialog>
                                            </div>

                                            <span className="text-xs text-gray-500">
                                                {collection.collectedAt ? `Collected ${formatDate(collection.collectedAt)}` :
                                                    collection.reservedAt ? `Reserved ${formatDate(collection.reservedAt)}` : ''}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
