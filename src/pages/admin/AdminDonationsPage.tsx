import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import { FoodDonation } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChainOfCustodyTimeline } from "@/components/donation/ChainOfCustodyTimeline";
import { Loader2, Package, Clock, User } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDonationsPage() {
    const [donations, setDonations] = useState<FoodDonation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const fetchDonations = async () => {
        setIsLoading(true);
        try {
            const response = await adminApi.getDonations(statusFilter);
            // Expected response: { donations: [], pagination: { ... } }
            if (response.data && response.data.donations) {
                setDonations(response.data.donations);
                // pagination not yet used in UI
            }
        } catch (error) {
            console.error("Failed to fetch donations", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, [page, statusFilter]);

    const getStatusBadge = (status: string, expiryTime?: string) => {
        if (status === 'available' && expiryTime && new Date(expiryTime) < new Date()) {
            return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Expired (Time)</Badge>;
        }
        switch (status) {
            case 'available': return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Available</Badge>;
            case 'reserved': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Reserved</Badge>;
            case 'collected': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Collected</Badge>;
            case 'expired': return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Expired</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
            <div className="animate-fade-in-up">
                <h1 className="text-3xl md:text-5xl font-bold mb-2">
                    Donation <span className="text-gradient-green text-emerald-600">Oversight</span>
                </h1>
                <p className="text-muted-foreground text-lg">Track the lifecycle of every meal pledged</p>
            </div>

            {/* Filters */}
            <div className="flex gap-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                {(['all', 'available', 'reserved', 'collected', 'expired'] as const).map((status) => (
                    <Button
                        key={status}
                        variant={statusFilter === status ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setStatusFilter(status)}
                        className="capitalize"
                    >
                        {status}
                    </Button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : donations.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">No donations found matching criteria.</p>
                        </CardContent>
                    </Card>
                ) : (
                    donations.map((donation) => (
                        <Card key={donation._id} className="animate-fade-in-up hover:shadow-md transition-all">
                            <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                                {/* Image */}
                                <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                    {donation.imageUrl ? (
                                        <img src={`http://localhost:5001${donation.imageUrl}`} alt={donation.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <Package className="w-8 h-8 m-auto text-gray-400 mt-4" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <h3 className="font-bold text-lg truncate">{donation.title}</h3>
                                        {getStatusBadge(donation.status, donation.expiryTime)}
                                        {donation.emergencyMode && (
                                            <Badge variant="destructive" className="animate-pulse bg-red-600 font-bold border-none shadow-lg shadow-red-100">
                                                EMERGENCY
                                            </Badge>
                                        )}
                                        {donation.riskScore !== undefined && (
                                            <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-gray-100 border text-[10px] font-bold">
                                                <span className={`w-2 h-2 rounded-full ${donation.riskScore > 75 ? 'bg-red-500 animate-pulse' :
                                                        donation.riskScore > 40 ? 'bg-orange-400' : 'bg-green-500'
                                                    }`} />
                                                RISK: {donation.riskScore}%
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            Donor: {(typeof donation.donorId === 'object' ? donation.donorId.name : null) || 'Unknown'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Package className="w-3 h-3" />
                                            {donation.quantity}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Posted {format(new Date(donation.createdAt), 'PP')}
                                        </span>
                                        {donation.expiryTime && (
                                            <span className={`flex items-center gap-1 ${new Date(donation.expiryTime) < new Date() && donation.status === 'available' ? 'text-red-500 font-bold' : ''}`}>
                                                <Clock className="w-3 h-3" />
                                                Expires {format(new Date(donation.expiryTime), 'PP p')}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-shrink-0">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="gap-2">
                                                <Clock className="w-4 h-4" />
                                                View Timeline
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Chain of Custody</DialogTitle>
                                            </DialogHeader>
                                            <ChainOfCustodyTimeline donation={donation} />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Pagination Controls could go here */}
        </div>
    );
}
