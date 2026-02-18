import { TrendingUp, Users, Building2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

interface StatCardProps {
    icon: React.ReactNode;
    value: number;
    label: string;
    delay: number;
}

const StatCard = ({ icon, value, label, delay }: StatCardProps) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            const duration = 2000;
            const increment = value / (duration / 16);
            let current = 0;

            const counter = setInterval(() => {
                current += increment;
                if (current >= value) {
                    setCount(value);
                    clearInterval(counter);
                } else {
                    setCount(Math.floor(current));
                }
            }, 16);

            return () => clearInterval(counter);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return (
        <div className={`flex flex-col items-center gap-2 p-6 bg-card rounded-lg border shadow-sm hover-lift stagger-${delay / 100}`} style={{ animationDelay: `${delay}ms` }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                {icon}
            </div>
            <div className="text-3xl font-bold text-gradient-green animate-count-up">{count.toLocaleString()}+</div>
            <div className="text-sm text-muted-foreground">{label}</div>
        </div>
    );
};

export const Hero = () => {
    return (
        <section className="relative w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-accent/20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center text-center space-y-8 animate-fade-in-up">
                    {/* Main Heading */}
                    <div className="space-y-4 max-w-3xl">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                            Help the Environment by{' '}
                            <span className="text-gradient-green">Reducing Food Waste</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Connect surplus food from local cafes, bakeries, and restaurants with NGOs and shelters who need it most.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up stagger-1">
                        <Link to="/volunteer/tasks">
                            <Button size="lg" className="gap-2">
                                Start Volunteering <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Link to="/about">
                            <Button size="lg" variant="outline">
                                Learn More
                            </Button>
                        </Link>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mt-12">
                        <StatCard
                            icon={<TrendingUp className="h-6 w-6" />}
                            value={15000}
                            label="Meals Saved"
                            delay={100}
                        />
                        <StatCard
                            icon={<Users className="h-6 w-6" />}
                            value={250}
                            label="Active Volunteers"
                            delay={200}
                        />
                        <StatCard
                            icon={<Building2 className="h-6 w-6" />}
                            value={45}
                            label="Partner NGOs"
                            delay={300}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
