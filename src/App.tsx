import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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


function App() {
    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Admin routes with new Layout */}
                <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
                <Route path="/admin/users" element={<AdminLayout><AdminUsersPage /></AdminLayout>} />
                <Route path="/admin/logs" element={<AdminLayout><AdminLogsPage /></AdminLayout>} />

            </Routes>
        </Router>
    );
}

export default App;
