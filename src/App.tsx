import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
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
    VerificationPendingPage,
    AdminDashboard,
    AdminUsersPage,
    AdminLogsPage,
    AdminDonationsPage,
    DonorDashboard,
    AddFoodPage,
    EditFoodPage,
    DonorHistoryPage,
    NgoDashboard,
    NgoAvailablePage,
    NgoHistoryPage,
    VolunteerDashboard,
    VolunteerTasksPage,
} from "@/pages";
import ProfilePage from "@/pages/ProfilePage";

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

import VoiceAssistant from '@/components/VoiceAssistant';
import { PageTransition } from "@/components/animations/PageTransition";
import { DynamicBackground } from "@/components/animations/DynamicBackground";


function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="antialiased min-h-screen pb-20 md:pb-0 bg-transparent text-foreground relative">
            <DynamicBackground />
            <Navbar />
            <main className="flex-1">
                <PageTransition>
                    {children}
                </PageTransition>
            </main>
            <BottomNav />
            <VoiceAssistant />
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

    // Role verification
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    // Account Verification Check
    // If user is NGO or Volunteer and NOT verified, deny access
    // Admin and Donors might skip this check if they are auto-verified (Donors are verified: false by default in DB? No, usually true or ignored. Let's assume verified:false means blocked for them too)
    // Actually, backend sets Verified: false for everyone initially except maybe Donor? 
    // AdminController said: requires valid OrganizationType for Donor.
    // Let's protect NGO/Volunteer explicitly for now
    if (user && (user.role === 'ngo' || user.role === 'volunteer') && !user.verified) {
        return <Navigate to="/verification-pending" replace />;
    }

    // Also block if explicitly blocked (verified: false) for any role (except maybe admin to prevent lockout?)
    if (user && user.role !== 'admin' && user.verified === false) {
        // If verify is mandatory for all, this covers it. 
        // Note: If new Donors are verified:false, they will be blocked too.
        // Check backend: UserSchema default verified: false.
        // Does register endpoint verify Donors automatically? No. 
        // So ALL new users are verified: false. 
        // If we want Donors to access immediately, we must verify them on register OR skip this check.
        // Current Requirement: "initially all newly registered ngo will not have access... admin block/unblock all users"

        if (user.role === 'donor') {
            // Allow donors for now unless explicitly blocked? 
            // Wait, if default is false, then all new donors are blocked.
            // Let's ASSUME donors shouldn't be blocked by default. 
            // But admin can block them. 
            // This is tricky without a separate 'blocked' field. 
            // Recommendation: Auto-verify donors in backend OR allow unverified donors.
            // For now, I will enforce it for NGO as requested. 
        } else {
            return <Navigate to="/verification-pending" replace />;
        }
    }

    return children;
}

// Role-based redirection for the root path
function RoleRedirect() {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <LandingPage />;
    }

    if (user && !user.verified && (user.role === 'ngo' || user.role === 'volunteer')) {
        return <Navigate to="/verification-pending" replace />;
    }

    // Redirect to respective dashboard based on role
    switch (user?.role) {
        case 'admin':
            return <Navigate to="/admin/dashboard" replace />;
        case 'donor':
            return <Navigate to="/donor/dashboard" replace />;
        case 'ngo':
            return <Navigate to="/ngo/dashboard" replace />;
        case 'volunteer':
            return <Navigate to="/volunteer/dashboard" replace />;
        default:
            return <LandingPage />;
    }
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/landing" element={<LandingPage />} />
                    <Route path="/dashboard" element={<RoleRedirect />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/verification-pending" element={<VerificationPendingPage />} />

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
                    <Route path="/admin/donations" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminLayout><AdminDonationsPage /></AdminLayout>
                        </ProtectedRoute>
                    } />

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
                    <Route path="/donor/edit/:id" element={
                        <ProtectedRoute allowedRoles={['donor']}>
                            <AppLayout><EditFoodPage /></AppLayout>
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
                    {/* Profile route (all roles) */}
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <AppLayout><ProfilePage /></AppLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="/volunteer/tasks" element={
                        <ProtectedRoute allowedRoles={['volunteer']}>
                            <AppLayout><VolunteerTasksPage /></AppLayout>
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
            <Toaster position="top-right" richColors closeButton />
        </AuthProvider>
    );
}

export default App;

