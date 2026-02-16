
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/layout/AdminSidebar"
import { BottomNav } from "@/components/layout/BottomNav"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <main className="w-full relative flex flex-col min-h-screen bg-background text-foreground">
                <div className="p-4 flex items-center gap-4 bg-background/50 backdrop-blur-sm sticky top-0 z-10 border-b md:border-none">
                    <SidebarTrigger />
                    <span className="md:hidden font-bold text-lg">ResQMeals Admin</span>
                </div>
                <div className="flex-1">
                    {children}
                </div>
                <BottomNav />
            </main>
        </SidebarProvider>
    )
}
