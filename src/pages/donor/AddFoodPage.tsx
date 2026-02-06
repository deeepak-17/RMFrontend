/**
 * Add Food Page (Stub)
 * Owner: Member 3 (Donor)
 * Branch: feature/donor
 *
 * TODO:
 * - Create form with: title, foodType, quantity, preparedTime, location, image
 * - Auto-calculate expiry time (preparedTime + 4 hours)
 * - Get user's location for pickup point
 * - Upload image to backend
 * - Call donationsApi.create() on submit
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AddFoodPage() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // TODO: Implement form submission
        console.log('Form submitted');

        setIsLoading(false);
        navigate('/donor/history');
    };

    return (
        <div className="min-h-screen bg-neutral-50 p-4">
            <div className="max-w-2xl mx-auto">
                <Link to="/donor/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl text-emerald-600">Donate Food</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Food Description</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., Rice and curry for 50 people"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="foodType">Food Type</Label>
                                    <select id="foodType" className="w-full p-2 border rounded-md">
                                        <option value="veg">Vegetarian</option>
                                        <option value="non-veg">Non-Vegetarian</option>
                                        <option value="vegan">Vegan</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Quantity</Label>
                                    <Input id="quantity" type="number" placeholder="e.g., 50" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="preparedAt">Prepared At</Label>
                                <Input id="preparedAt" type="datetime-local" required />
                                <p className="text-sm text-gray-500">
                                    Expiry will be auto-calculated as 4 hours from preparation
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Pickup Address</Label>
                                <Input id="address" placeholder="Enter pickup location" required />
                                {/* TODO: Add map picker */}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Food Image (Optional)</Label>
                                <Input id="image" type="file" accept="image/*" />
                            </div>

                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="hygiene" required />
                                <Label htmlFor="hygiene" className="text-sm">
                                    I certify this food was prepared in hygienic conditions
                                </Label>
                            </div>

                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                                {isLoading ? 'Submitting...' : 'Post Donation'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
