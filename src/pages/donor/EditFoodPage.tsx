import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin, Clock, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { donationsApi } from '@/lib/api';
import type { FoodDonation } from '@/types';

export default function EditFoodPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [foodType, setFoodType] = useState<'veg' | 'non-veg' | 'vegan'>('veg');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState<'kg' | 'plates' | 'servings'>('plates');
    const [preparedAt, setPreparedAt] = useState('');
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [expiryTime, setExpiryTime] = useState<string>('');

    // Fetch existing donation data
    useEffect(() => {
        const fetchDonation = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const response = await donationsApi.getById(id);
                const donation: FoodDonation = response.data;

                setTitle(donation.title);
                setFoodType(donation.foodType as any);

                // Parse quantity and unit (stored as "50 plates")
                // Handle cases where quantity might not have a unit or be formatted differently
                const parts = donation.quantity ? donation.quantity.split(' ') : ['0', 'plates'];
                const qty = parts[0];
                const u = parts.length > 1 ? parts.slice(1).join(' ') : 'plates';

                setQuantity(qty || '');
                setUnit((u as any) || 'plates');

                // Format preparedAt for datetime-local input (YYYY-MM-DDTHH:mm)
                if (donation.preparedTime) {
                    const date = new Date(donation.preparedTime);
                    // Adjust to local ISO string for input
                    const localIso = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
                    setPreparedAt(localIso);
                }

                if (donation.location) {
                    setAddress(donation.location.address || '');
                    if (donation.location.coordinates) {
                        setLongitude(donation.location.coordinates[0].toString());
                        setLatitude(donation.location.coordinates[1].toString());
                    }
                }
            } catch (err: any) {
                console.error('Failed to fetch donation:', err);
                setError('Failed to load donation details.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDonation();
    }, [id]);

    // Auto-calculate expiry time
    useEffect(() => {
        if (preparedAt) {
            const prepared = new Date(preparedAt);
            const expiry = new Date(prepared.getTime() + 4 * 60 * 60 * 1000);
            setExpiryTime(expiry.toLocaleString());
        } else {
            setExpiryTime('');
        }
    }, [preparedAt]);

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude.toString());
                    setLongitude(position.coords.longitude.toString());
                },
                (err) => {
                    console.error('Geolocation error:', err);
                    setError('Could not get your location. Please enter manually.');
                }
            );
        } else {
            setError('Geolocation is not supported by your browser.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        setError(null);
        setIsSaving(true);

        try {
            // Build update object (not FormData, since we're mostly updating text fields for now)
            // Note: If image update is needed, we'd need to handle that. Assuming text-only update for MVP simplicity or check backend support.
            // Backend updateDonation takes req.body directly. 
            // Ideally should support json.

            const updateData = {
                title,
                foodType,
                quantity: `${quantity} ${unit}`,
                preparedAt: new Date(preparedAt).toISOString(),
                location: {
                    type: 'Point',
                    coordinates: [parseFloat(longitude), parseFloat(latitude)],
                    address
                }
            };

            await donationsApi.update(id, updateData);
            setSuccess(true);
            setTimeout(() => navigate('/donor/history'), 2000);
        } catch (err: any) {
            console.error('Update error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to update donation.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 p-4">
            <div className="max-w-2xl mx-auto">
                <Link to="/donor/history" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to History
                </Link>

                {success && (
                    <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4 text-emerald-700 mb-4">
                        <CheckCircle className="h-5 w-5" />
                        <span>Donation updated successfully! Redirecting...</span>
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4 text-red-700 mb-4">
                        <AlertTriangle className="h-5 w-5" />
                        <span>{error}</span>
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl text-emerald-600">Edit Donation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Food Description *</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="foodType">Food Type *</Label>
                                    <select
                                        id="foodType"
                                        value={foodType}
                                        onChange={(e) => setFoodType(e.target.value as any)}
                                        className="w-full p-2 border rounded-md"
                                    >
                                        <option value="veg">Vegetarian</option>
                                        <option value="non-veg">Non-Vegetarian</option>
                                        <option value="vegan">Vegan</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Quantity *</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="quantity"
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            required
                                            className="flex-1"
                                        />
                                        <select
                                            value={unit}
                                            onChange={(e) => setUnit(e.target.value as any)}
                                            className="w-24 p-2 border rounded-md"
                                        >
                                            <option value="plates">plates</option>
                                            <option value="kg">kg</option>
                                            <option value="servings">servings</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="preparedAt">Prepared At *</Label>
                                <Input
                                    id="preparedAt"
                                    type="datetime-local"
                                    value={preparedAt}
                                    onChange={(e) => setPreparedAt(e.target.value)}
                                    required
                                />
                                {expiryTime && (
                                    <p className="text-sm text-orange-600 flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Expires at: <span className="font-medium">{expiryTime}</span>
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="address">Pickup Address *</Label>
                                    <button
                                        type="button"
                                        onClick={getCurrentLocation}
                                        className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                                    >
                                        <MapPin className="h-4 w-4" />
                                        Use Current Location
                                    </button>
                                </div>
                                <Input
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700"
                                disabled={isSaving || success}
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Update Donation'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
