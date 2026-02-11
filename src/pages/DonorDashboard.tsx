import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Package, TrendingUp, Heart, MapPin, Calendar } from 'lucide-react';
import { useToast, ToastContainer } from '../components/ui/toast';

const DonorDashboard = () => {
    const { toasts, addToast, removeToast } = useToast();
    const [formData, setFormData] = useState({
        foodType: '',
        quantity: '',
        location: '',
        expiryDate: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addToast('Donation posted successfully!', 'success');
        setFormData({ foodType: '', quantity: '', location: '', expiryDate: '' });
    };

    // Mock data for past donations
    const pastDonations = [
        { id: 1, foodType: 'Sandwiches', quantity: '20 pieces', status: 'Delivered', date: '2026-02-07' },
        { id: 2, foodType: 'Pastries', quantity: '15 pieces', status: 'Picked', date: '2026-02-06' },
        { id: 3, foodType: 'Fresh Vegetables', quantity: '5 kg', status: 'Assigned', date: '2026-02-05' },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <ToastContainer toasts={toasts} onClose={removeToast} />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 animate-fade-in-up">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        Donor <span className="text-gradient-green">Dashboard</span>
                    </h1>
                    <p className="text-muted-foreground">Make a difference by donating surplus food</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card hover className="animate-fade-in-up stagger-1">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">28</div>
                            <p className="text-xs text-muted-foreground">+3 this month</p>
                        </CardContent>
                    </Card>

                    <Card hover className="animate-fade-in-up stagger-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Meals Saved</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">420</div>
                            <p className="text-xs text-muted-foreground">Making an impact!</p>
                        </CardContent>
                    </Card>

                    <Card hover className="animate-fade-in-up stagger-3">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">People Helped</CardTitle>
                            <Heart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">350+</div>
                            <p className="text-xs text-muted-foreground">Thank you!</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Donation Form */}
                    <Card greenBorder className="animate-fade-in-up">
                        <CardHeader>
                            <CardTitle>Create New Donation</CardTitle>
                            <CardDescription>Post surplus food available for pickup</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    label="Food Type"
                                    placeholder="e.g., Sandwiches, Pastries, Vegetables"
                                    value={formData.foodType}
                                    onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                                    iconLeft={<Package className="h-4 w-4" />}
                                    required
                                />

                                <Input
                                    label="Quantity"
                                    placeholder="e.g., 20 pieces, 5 kg"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    required
                                />

                                <Input
                                    label="Pickup Location"
                                    placeholder="Your cafe/bakery address"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    iconLeft={<MapPin className="h-4 w-4" />}
                                    required
                                />

                                <Input
                                    label="Expiry Date"
                                    type="date"
                                    value={formData.expiryDate}
                                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    iconLeft={<Calendar className="h-4 w-4" />}
                                    required
                                />

                                <Button type="submit" className="w-full">
                                    Post Donation
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Past Donations */}
                    <div className="space-y-4 animate-fade-in-up stagger-1">
                        <h2 className="text-2xl font-semibold">Recent Donations</h2>

                        {pastDonations.map((donation) => (
                            <Card key={donation.id} hover>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg">{donation.foodType}</CardTitle>
                                            <CardDescription>{donation.quantity}</CardDescription>
                                        </div>
                                        <Badge
                                            variant={
                                                donation.status === 'Delivered' ? 'success' :
                                                    donation.status === 'Picked' ? 'default' :
                                                        'secondary'
                                            }
                                        >
                                            {donation.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardFooter className="text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {new Date(donation.date).toLocaleDateString()}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Impact Message */}
                <Card greenBorder className="mt-8 bg-accent/20 animate-fade-in-up">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
                            <h3 className="text-xl font-semibold mb-2">Thank You for Making a Difference!</h3>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Your donations help reduce food waste and feed those in need. Together, we're building a more sustainable future.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DonorDashboard;
