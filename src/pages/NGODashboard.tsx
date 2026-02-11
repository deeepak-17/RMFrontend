import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Building2, TrendingUp, Users, MapPin, Package, CheckCircle } from 'lucide-react';
import { useToast, ToastContainer } from '../components/ui/toast';

const NGODashboard = () => {
    const { toasts, addToast, removeToast } = useToast();

    // Mock data for incoming donations
    const [incomingDonations, setIncomingDonations] = useState([
        { id: 1, foodType: 'Sandwiches', quantity: '20 pieces', location: 'Downtown Cafe', status: 'Delivered', volunteer: 'John Doe' },
        { id: 2, foodType: 'Fresh Vegetables', quantity: '10 kg', location: 'Green Market', status: 'In Transit', volunteer: 'Jane Smith' },
        { id: 3, foodType: 'Pastries', quantity: '15 pieces', location: 'Sweet Bakery', status: 'Assigned', volunteer: 'Mike Johnson' },
    ]);

    const handleConfirm = (id: number) => {
        setIncomingDonations(prev =>
            prev.map(donation =>
                donation.id === id ? { ...donation, status: 'Confirmed' } : donation
            )
        );
        addToast('Delivery confirmed successfully!', 'success');
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <ToastContainer toasts={toasts} onClose={removeToast} />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 animate-fade-in-up">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        NGO <span className="text-gradient-green">Dashboard</span>
                    </h1>
                    <p className="text-muted-foreground">Receive and manage donated food deliveries</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card hover className="animate-fade-in-up stagger-1">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Meals Received</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">1,240</div>
                            <p className="text-xs text-muted-foreground">This month</p>
                        </CardContent>
                    </Card>

                    <Card hover className="animate-fade-in-up stagger-2">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">People Fed</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">980+</div>
                            <p className="text-xs text-muted-foreground">Growing daily</p>
                        </CardContent>
                    </Card>

                    <Card hover className="animate-fade-in-up stagger-3">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">8</div>
                            <p className="text-xs text-muted-foreground">In progress</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Incoming Donations */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between animate-fade-in-up">
                        <h2 className="text-2xl font-semibold">Incoming Donations</h2>
                        <Badge variant="info" icon={<Package className="h-3 w-3" />}>
                            {incomingDonations.length} Active
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {incomingDonations.map((donation, index) => (
                            <Card key={donation.id} hover greenBorder className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg">{donation.foodType}</CardTitle>
                                            <CardDescription className="mt-1">
                                                Quantity: {donation.quantity}
                                            </CardDescription>
                                        </div>
                                        <Badge
                                            variant={
                                                donation.status === 'Delivered' ? 'success' :
                                                    donation.status === 'In Transit' ? 'warning' :
                                                        donation.status === 'Confirmed' ? 'info' :
                                                            'secondary'
                                            }
                                            pulse={donation.status === 'In Transit'}
                                        >
                                            {donation.status}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-3">
                                    <div className="flex items-start gap-2 text-sm">
                                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                        <span className="text-muted-foreground">{donation.location}</span>
                                    </div>

                                    <div className="flex items-start gap-2 text-sm">
                                        <Users className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                        <span className="text-muted-foreground">Volunteer: {donation.volunteer}</span>
                                    </div>
                                </CardContent>

                                <CardFooter>
                                    {donation.status === 'Delivered' && (
                                        <Button
                                            className="w-full"
                                            onClick={() => handleConfirm(donation.id)}
                                            iconLeft={<CheckCircle className="h-4 w-4" />}
                                        >
                                            Confirm Receipt
                                        </Button>
                                    )}
                                    {donation.status === 'Confirmed' && (
                                        <Button className="w-full" variant="outline" disabled>
                                            Confirmed
                                        </Button>
                                    )}
                                    {donation.status !== 'Delivered' && donation.status !== 'Confirmed' && (
                                        <Button className="w-full" variant="ghost" disabled>
                                            Awaiting Delivery
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Impact Section */}
                <Card greenBorder className="mt-8 bg-accent/20 animate-fade-in-up">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <Building2 className="h-12 w-12 mx-auto mb-4 text-primary" />
                            <h3 className="text-xl font-semibold mb-2">Making a Real Impact</h3>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Thank you for partnering with ResQMeals. Together, we're reducing food waste and feeding those who need it most in our community.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default NGODashboard;
