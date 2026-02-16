import { Navbar } from '../components/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Leaf, Users, Code } from 'lucide-react';

const teamMembers = [
    { name: 'Deepak', role: 'Volunteer Module Lead' },
    { name: 'Team Member 2', role: 'Developer' },
    { name: 'Team Member 3', role: 'Developer' },
    { name: 'Team Member 4', role: 'Developer' },
    { name: 'Team Member 5', role: 'Developer' },
];

const techStack = [
    'React 19', 'TypeScript', 'Tailwind CSS', 'Node.js',
    'Express', 'MongoDB', 'Socket.io', 'JWT Auth'
];

const About = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="container mx-auto px-4 py-12">
                {/* Mission Statement */}
                <section className="max-w-4xl mx-auto text-center mb-16 animate-fade-in-up">
                    <div className="flex justify-center mb-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Leaf className="h-10 w-10" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Our <span className="text-gradient-green">Mission</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        ResQMeals is dedicated to reducing food waste and fighting hunger by connecting surplus food
                        from local businesses with NGOs and shelters that serve those in need. Together, we're building
                        a more sustainable and compassionate future, one meal at a time.
                    </p>
                </section>

                {/* Impact Stats */}
                <section className="max-w-5xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-center mb-8 animate-fade-in-up">
                        Our <span className="text-gradient-green">Impact</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card hover className="text-center animate-fade-in-up stagger-1">
                            <CardContent className="pt-6">
                                <div className="text-4xl font-bold text-gradient-green mb-2 animate-count-up">15,000+</div>
                                <p className="text-muted-foreground">Meals Rescued</p>
                            </CardContent>
                        </Card>

                        <Card hover className="text-center animate-fade-in-up stagger-2">
                            <CardContent className="pt-6">
                                <div className="text-4xl font-bold text-gradient-green mb-2 animate-count-up">250+</div>
                                <p className="text-muted-foreground">Active Volunteers</p>
                            </CardContent>
                        </Card>

                        <Card hover className="text-center animate-fade-in-up stagger-3">
                            <CardContent className="pt-6">
                                <div className="text-4xl font-bold text-gradient-green mb-2 animate-count-up">45+</div>
                                <p className="text-muted-foreground">Partner NGOs</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Team Section */}
                <section className="max-w-5xl mx-auto mb-16">
                    <div className="text-center mb-8 animate-fade-in-up">
                        <div className="flex justify-center mb-4">
                            <Users className="h-12 w-12 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">
                            Meet Our <span className="text-gradient-green">Team</span>
                        </h2>
                        <p className="text-muted-foreground">
                            Dedicated individuals working together to make a difference
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teamMembers.map((member, index) => (
                            <Card key={member.name} hover className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{member.name}</CardTitle>
                                            <p className="text-sm text-muted-foreground">{member.role}</p>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Technology Stack */}
                <section className="max-w-5xl mx-auto mb-16">
                    <div className="text-center mb-8 animate-fade-in-up">
                        <div className="flex justify-center mb-4">
                            <Code className="h-12 w-12 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">
                            Built with Modern <span className="text-gradient-green">Technology</span>
                        </h2>
                        <p className="text-muted-foreground">
                            Leveraging the latest technologies for a robust and scalable platform
                        </p>
                    </div>

                    <Card greenBorder className="animate-fade-in-up">
                        <CardContent className="pt-6">
                            <div className="flex flex-wrap gap-3 justify-center">
                                {techStack.map((tech, index) => (
                                    <span
                                        key={tech}
                                        className="px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-medium hover-scale cursor-default animate-fade-in"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Environmental Message */}
                <section className="max-w-3xl mx-auto">
                    <Card greenBorder className="bg-accent/20 animate-fade-in-up">
                        <CardContent className="pt-6 text-center">
                            <Leaf className="h-12 w-12 mx-auto mb-4 text-primary" />
                            <h3 className="text-2xl font-bold mb-4">
                                Help the <span className="text-gradient-green">Environment</span>
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Every meal rescued through ResQMeals contributes to reducing greenhouse gas emissions
                                from food waste in landfills. By redistributing surplus food, we're not just fighting
                                hunger—we're protecting our planet for future generations.
                            </p>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
};

export default About;
