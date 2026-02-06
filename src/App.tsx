import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import Header from "@/components/sections/header";
import HeroSection from "@/components/sections/hero";
import MissionStatement from "@/components/sections/mission-statement";
import SellingPoints from "@/components/sections/selling-points";
import HowItWorks from "@/components/sections/how-it-works";
import BusinessSolutions from "@/components/sections/business-solutions";
import CTABanner from "@/components/sections/cta-banner";
import Footer from "@/components/sections/footer";

// Pages
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DonorDashboard from '@/pages/donor/DonorDashboard';
import AddFoodPage from '@/pages/donor/AddFoodPage';
import DonorHistoryPage from '@/pages/donor/DonorHistoryPage';
import NgoDashboard from '@/pages/ngo/NgoDashboard';
import NgoAvailablePage from '@/pages/ngo/NgoAvailablePage';
import NgoHistoryPage from '@/pages/ngo/NgoHistoryPage';
import VolunteerDashboard from '@/pages/volunteer/VolunteerDashboard';
import VolunteerTasksPage from '@/pages/volunteer/VolunteerTasksPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';

function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main>
                <HeroSection />
                <MissionStatement />
                <SellingPoints />
                <HowItWorks />
                <BusinessSolutions />
                <CTABanner />
            </main>
            <Footer />
        </div>
    );
}

function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="antialiased min-h-screen pb-20 md:pb-0 bg-background text-foreground">
            <Navbar />
            <main className="flex-1">{children}</main>
            <BottomNav />
        </div>
    );
}

// Protected route wrapper
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Donor routes */}
                    <Route path="/donor/dashboard" element={
                        <ProtectedRoute allowedRoles={['donor']}>
                            <AppLayout><DonorDashboard /></AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/donor/add" element={
                        <ProtectedRoute allowedRoles={['donor']}>
                            <AppLayout><AddFoodPage /></AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/donor/history" element={
                        <ProtectedRoute allowedRoles={['donor']}>
                            <AppLayout><DonorHistoryPage /></AppLayout>
                        </ProtectedRoute>
                    } />

                    {/* NGO routes */}
                    <Route path="/ngo/dashboard" element={
                        <ProtectedRoute allowedRoles={['ngo']}>
                            <AppLayout><NgoDashboard /></AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/ngo/available" element={
                        <ProtectedRoute allowedRoles={['ngo']}>
                            <AppLayout><NgoAvailablePage /></AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/ngo/history" element={
                        <ProtectedRoute allowedRoles={['ngo']}>
                            <AppLayout><NgoHistoryPage /></AppLayout>
                        </ProtectedRoute>
                    } />

                    {/* Volunteer routes */}
                    <Route path="/volunteer/dashboard" element={
                        <ProtectedRoute allowedRoles={['volunteer']}>
                            <AppLayout><VolunteerDashboard /></AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/volunteer/tasks" element={
                        <ProtectedRoute allowedRoles={['volunteer']}>
                            <AppLayout><VolunteerTasksPage /></AppLayout>
                        </ProtectedRoute>
                    } />

                    {/* Admin routes */}
                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AppLayout><AdminDashboard /></AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/users" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AppLayout><AdminUsersPage /></AppLayout>
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
