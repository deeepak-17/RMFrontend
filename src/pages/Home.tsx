import { Package, Truck, Heart, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon, title, description, step }: { icon: React.ReactNode; title: string; description: string; step: number }) => {
    return (
        <Card hover className="text-center animate-fade-in-up" style={{ animationDelay: `${step * 100}ms` }}>
            <CardHeader>
                <div className="flex justify-center mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {icon}
                    </div>
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription className="text-base">{description}</CardDescription>
            </CardHeader>
        </Card>
    );
};

const Home = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <Hero />

            {/* How It Works Section */}
            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12 animate-fade-in-up">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Your Impact as a <span className="text-gradient-green">Volunteer</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Join our community of heroes delivering food to those in need
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <FeatureCard
                            step={1}
                            icon={<Package className="h-8 w-8" />}
                            title="Pick Up"
                            description="Receive notifications for food pickup tasks from local donors nearby"
                        />
                        <FeatureCard
                            step={2}
                            icon={<Truck className="h-8 w-8" />}
                            title="Deliver"
                            description="Transport the surplus food safely to designated NGOs and shelters"
                        />
                        <FeatureCard
                            step={3}
                            icon={<Heart className="h-8 w-8" />}
                            title="Impact"
                            description="Directly help feed the hungry and reduce environmental waste"
                        />
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-16 md:py-24 bg-accent/20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Ready to Make a <span className="text-gradient-green">Difference?</span>
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Join hundreds of volunteers who are already helping to minimize food waste and support their communities.
                        </p>

                        <Card greenBorder hover className="max-w-md mx-auto animate-fade-in-up">
                            <CardHeader>
                                <CardTitle className="text-primary">Volunteer Dashboard</CardTitle>
                                <CardDescription>
                                    Access your tasks, track deliveries, and see your impact.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link to="/volunteer/tasks">
                                    <Button className="w-full gap-2" size="lg">
                                        Go to My Tasks <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-8 bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Package className="h-5 w-5" />
                            </div>
                            <span className="font-semibold text-gradient-green">ResQMeals</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © 2026 ResQMeals. Reducing food waste, one meal at a time.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
