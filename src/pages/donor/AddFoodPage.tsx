/**
 * Add Food Page
 * Owner: Member 3 (Donor)
 * Branch: feature/donor
 *
 * IMPLEMENTED:
 * - Form with: title, foodType, quantity, preparedTime, location, image
 * - Auto-calculate expiry time (preparedTime + 4 hours)
 * - Get user's location for pickup point
 * - Hygiene certification checkbox
 * - Call donationsApi.create() on submit
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin, Clock, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { donationsApi } from '@/lib/api';


export default function AddFoodPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [foodType, setFoodType] = useState<'veg' | 'non-veg' | 'vegan'>('veg');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState<'kg' | 'plates' | 'servings'>('plates');
    const [preparedAt, setPreparedAt] = useState('');
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [hygieneCert, setHygieneCert] = useState(false);

    // Auto-calculated expiry time (4 hours from prepared time)
    const [expiryTime, setExpiryTime] = useState<string>('');

    useEffect(() => {
        if (preparedAt) {
            const prepared = new Date(preparedAt);
            const expiry = new Date(prepared.getTime() + 4 * 60 * 60 * 1000);
            setExpiryTime(expiry.toLocaleString());
        } else {
            setExpiryTime('');
        }
    }, [preparedAt]);

    // Get current location
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

    // Voice command listener
    useEffect(() => {
        const handleVAAction = (e: Event) => {
            const { key } = (e as CustomEvent).detail;
            if (key === 'submit-form') {
                formRef.current?.requestSubmit();
            } else if (key === 'get-location') {
                getCurrentLocation();
            } else if (key === 'set-veg') {
                setFoodType('veg');
            } else if (key === 'set-nonveg') {
                setFoodType('non-veg');
            } else if (key === 'set-vegan') {
                setFoodType('vegan');
            }
            // ── fill-field (from detectFieldFill) ──
            else if (key === 'fill-field') {
                const { field, value } = (e as CustomEvent).detail;
                if (field === 'title')      setTitle(value);
                else if (field === 'quantity')   setQuantity(value);
                else if (field === 'unit')       setUnit(value as 'kg' | 'plates' | 'servings');
                else if (field === 'address')    setAddress(value);
                else if (field === 'preparedAt') setPreparedAt(value);
                else if (field === 'foodType')   setFoodType(value as 'veg' | 'non-veg' | 'vegan');
            }
        };
        window.addEventListener('va-action', handleVAAction);
        return () => window.removeEventListener('va-action', handleVAAction);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // Validation
            if (!title || !quantity || !preparedAt || !latitude || !longitude) {
                throw new Error('Please fill in all required fields.');
            }

            if (!hygieneCert) {
                throw new Error('Please certify that the food was prepared in hygienic conditions.');
            }

            // Build FormData for image upload
            const formData = new FormData();
            formData.append('title', title);
            formData.append('foodType', foodType);
            formData.append('quantity', quantity);
            formData.append('unit', unit);
            formData.append('preparedAt', new Date(preparedAt).toISOString());
            formData.append('location[coordinates][0]', longitude); // lng
            formData.append('location[coordinates][1]', latitude); // lat
            formData.append('location[address]', address);
            formData.append('hygieneCert', 'true');

            if (image) {
                formData.append('image', image);
            }

            await donationsApi.create(formData);
            setSuccess(true);

            // Redirect to history after success
            setTimeout(() => navigate('/donor/history'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to create donation.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 p-4">
            <div className="max-w-2xl mx-auto">
                <Link to="/donor/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                {/* Success Alert */}
                {success && (
                    <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4 text-emerald-700 mb-4">
                        <CheckCircle className="h-5 w-5" />
                        <span>Donation created successfully! Redirecting to your history...</span>
                    </div>
                )}

                {/* Error Alert */}
                {error && (
                    <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4 text-red-700 mb-4">
                        <AlertTriangle className="h-5 w-5" />
                        <span>{error}</span>
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl text-emerald-600">Donate Food</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                            {/* Food Description */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Food Description *</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Rice and curry for 50 people"
                                    required
                                />
                            </div>

                            {/* Food Type & Quantity */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="foodType">Food Type *</Label>
                                    <select
                                        id="foodType"
                                        value={foodType}
                                        onChange={(e) => setFoodType(e.target.value as 'veg' | 'non-veg' | 'vegan')}
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
                                            placeholder="e.g., 50"
                                            required
                                            className="flex-1"
                                        />
                                        <select
                                            value={unit}
                                            onChange={(e) => setUnit(e.target.value as 'kg' | 'plates' | 'servings')}
                                            className="w-24 p-2 border rounded-md"
                                        >
                                            <option value="plates">plates</option>
                                            <option value="kg">kg</option>
                                            <option value="servings">servings</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Prepared Time with Expiry Display */}
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
                                        <span className="text-gray-500">(4-hour safety window)</span>
                                    </p>
                                )}
                            </div>

                            {/* Location */}
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
                                    placeholder="Enter pickup location"
                                    required
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        type="number"
                                        step="any"
                                        value={latitude}
                                        onChange={(e) => setLatitude(e.target.value)}
                                        placeholder="Latitude"
                                        required
                                    />
                                    <Input
                                        type="number"
                                        step="any"
                                        value={longitude}
                                        onChange={(e) => setLongitude(e.target.value)}
                                        placeholder="Longitude"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Food Image */}
                            <div className="space-y-2">
                                <Label htmlFor="image">Food Image (Optional)</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                                />
                            </div>

                            {/* Hygiene Certification */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="hygiene"
                                    checked={hygieneCert}
                                    onChange={(e) => setHygieneCert(e.target.checked)}
                                    required
                                />
                                <Label htmlFor="hygiene" className="text-sm">
                                    I certify this food was prepared in hygienic conditions *
                                </Label>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700"
                                disabled={isLoading || success}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : success ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Donation Created!
                                    </>
                                ) : (
                                    'Post Donation'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
