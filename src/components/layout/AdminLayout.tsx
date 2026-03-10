
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/layout/AdminSidebar"
import { BottomNav } from "@/components/layout/BottomNav"
import { PageTransition } from "@/components/animations/PageTransition"
import { DynamicBackground } from "@/components/animations/DynamicBackground"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <DynamicBackground />
            <AdminSidebar />
            <main className="w-full relative flex flex-col min-h-screen bg-transparent text-foreground">
                <div className="p-4 flex items-center gap-4 bg-background/50 backdrop-blur-md sticky top-0 z-10 border-b md:border-none">
                    <SidebarTrigger />
                    <span className="md:hidden font-bold text-lg text-gradient-green">ResQMeals Admin</span>
                </div>
                <div className="flex-1">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </div>
                <BottomNav />
            </main>
        </SidebarProvider>
    )
}
