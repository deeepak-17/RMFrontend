import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import AdminLayout from "@/components/layout/AdminLayout";
import Header from "@/components/sections/header";
import HeroSection from "@/components/sections/hero";
import MissionStatement from "@/components/sections/mission-statement";
import SellingPoints from "@/components/sections/selling-points";
import HowItWorks from "@/components/sections/how-it-works";
import BusinessSolutions from "@/components/sections/business-solutions";
import CTABanner from "@/components/sections/cta-banner";
import Footer from "@/components/sections/footer";

// Page imports
import {
    LoginPage,
    RegisterPage,
    AdminDashboard,
    AdminUsersPage,
    AdminLogsPage,
} from "@/pages";

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

    return children;
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="/landing" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Admin routes with new Layout and Protection */}
                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminLayout><AdminDashboard /></AdminLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/users" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminLayout><AdminUsersPage /></AdminLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/logs" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminLayout><AdminLogsPage /></AdminLayout>
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;

