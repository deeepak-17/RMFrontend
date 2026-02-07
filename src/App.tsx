import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

// Page imports
import {
    LoginPage,
    RegisterPage,
    DonorDashboard,
    AddFoodPage,
    DonorHistoryPage,
    NgoDashboard,
    NgoAvailablePage,
    NgoHistoryPage,
    VolunteerDashboard,
    VolunteerTasksPage,
    AdminDashboard,
    AdminUsersPage,
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

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="antialiased min-h-screen pb-20 md:pb-0 bg-background text-foreground">
            <Navbar />
            <main className="flex-1">{children}</main>
            <BottomNav />
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Donor routes - Member 3 */}
                <Route path="/donor/dashboard" element={<Layout><DonorDashboard /></Layout>} />
                <Route path="/donor/add" element={<Layout><AddFoodPage /></Layout>} />
                <Route path="/donor/history" element={<Layout><DonorHistoryPage /></Layout>} />

                {/* NGO routes */}
                <Route path="/ngo/dashboard" element={<Layout><NgoDashboard /></Layout>} />
                <Route path="/ngo/available" element={<Layout><NgoAvailablePage /></Layout>} />
                <Route path="/ngo/history" element={<Layout><NgoHistoryPage /></Layout>} />

                {/* Volunteer routes */}
                <Route path="/volunteer/dashboard" element={<Layout><VolunteerDashboard /></Layout>} />
                <Route path="/volunteer/tasks" element={<Layout><VolunteerTasksPage /></Layout>} />

                {/* Admin routes */}
                <Route path="/admin/dashboard" element={<Layout><AdminDashboard /></Layout>} />
                <Route path="/admin/users" element={<Layout><AdminUsersPage /></Layout>} />
            </Routes>
        </Router>
    );
}

export default App;
