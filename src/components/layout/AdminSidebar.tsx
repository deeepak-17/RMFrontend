import {
    LayoutDashboard,
    Users,
    ClipboardList,
    LogOut,
    ShieldCheck,
    Package
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AdminSidebar() {
    const pathname = useLocation().pathname;
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const isActive = (path: string) => pathname === path;

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="p-4 border-b border-primary/10">
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <ShieldCheck className="size-5" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none transition-all group-data-[collapsible=icon]:opacity-0">
                        <span className="font-bold">ResQAdmin</span>
                        <span className="text-xs text-muted-foreground">Command Center</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="p-2">
                <SidebarMenu className="gap-2">
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            isActive={isActive("/admin/dashboard")}
                            tooltip="Dashboard"
                            className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground transition-all duration-200"
                        >
                            <Link to="/admin/dashboard" className="flex items-center gap-2">
                                <LayoutDashboard className="size-4" />
                                <span>Dashboard</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            isActive={isActive("/admin/donations")}
                            tooltip="Donations"
                            className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground transition-all duration-200"
                        >
                            <Link to="/admin/donations" className="flex items-center gap-2">
                                <Package className="size-4" />
                                <span>Donations</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            isActive={isActive("/admin/users")}
                            tooltip="User Management"
                            className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground transition-all duration-200"
                        >
                            <Link to="/admin/users" className="flex items-center gap-2">
                                <Users className="size-4" />
                                <span>Users</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            isActive={isActive("/admin/logs")}
                            tooltip="System Logs"
                            className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground transition-all duration-200"
                        >
                            <Link to="/admin/logs" className="flex items-center gap-2">
                                <ClipboardList className="size-4" />
                                <span>Logs</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="border-t border-primary/10 p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Logout"
                            onClick={handleLogout}
                            className="hover:bg-destructive/10 hover:text-destructive transition-colors group/logout"
                        >
                            <div className="flex items-center gap-2 overflow-hidden w-full">
                                <Avatar className="h-6 w-6 rounded-lg shrink-0">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                                        {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight transition-all group-data-[collapsible=icon]:opacity-0">
                                    <span className="truncate font-semibold">{user?.name || "Admin User"}</span>
                                    <span className="truncate text-xs text-muted-foreground">{user?.email || "admin@resq.com"}</span>
                                </div>
                                <LogOut className="ml-auto size-4 shrink-0 transition-transform group-hover/logout:translate-x-1" />
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
