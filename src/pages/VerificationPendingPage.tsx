import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function VerificationPendingPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <ShieldAlert className="w-8 h-8 text-amber-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Verification Pending</CardTitle>
                    <CardDescription>
                        Your account requires admin verification before you can access the dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        We are reviewing your documents. This process usually takes 24-48 hours. You will receive an email once your account is activated.
                    </p>
                    <div className="space-y-2">
                        <Button variant="outline" className="w-full" asChild>
                            <Link to="/">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Return Home
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                            Sign Out
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
