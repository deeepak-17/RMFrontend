import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import type { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, ShieldCheck, UserCheck, UserX, Loader2, Sparkles, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'donor' | 'ngo' | 'volunteer' | 'admin'>('all');

    const getMockUsers = (): User[] => [
        { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'donor', verified: true, createdAt: new Date().toISOString(), sustainabilityCredits: 10, languagePref: 'en' },
        { _id: '2', name: 'Helping Hands', email: 'contact@helpinghands.org', role: 'ngo', verified: false, createdAt: new Date().toISOString(), sustainabilityCredits: 0, languagePref: 'en' },
        { _id: '3', name: 'Mike Volunteer', email: 'mike@vol.com', role: 'volunteer', verified: true, createdAt: new Date().toISOString(), sustainabilityCredits: 50, languagePref: 'en' },
        { _id: '5', name: 'New NGO', email: 'info@newngo.org', role: 'ngo', verified: false, createdAt: new Date().toISOString(), sustainabilityCredits: 0, languagePref: 'en' },
    ];

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await adminApi.getUsers();
            // Backend returns { users: User[], pagination: ... }
            if (response.data && Array.isArray(response.data.users)) {
                console.log("Admin Users Data:", response.data.users); // DEBUG log
                setUsers(response.data.users);
            } else if (response.data && Array.isArray(response.data)) {
                // Fallback if it returns just an array
                setUsers(response.data);
            } else {
                console.warn('Unexpected API response format:', response.data);
                setUsers(getMockUsers());
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
            // check if error is 403 (Forbidden) -> show toast
            // @ts-ignore
            if (error.response?.status === 403) {
                toast.error("Access Denied: You are not an admin");
            }
            setUsers(getMockUsers());
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleVerify = async (userId: string) => {
        try {
            await adminApi.verifyUser(userId);
            toast.success('User verified successfully');
            fetchUsers();
        } catch (error) {
            console.warn('Mock verify success');
            toast.success('User verified successfully (Mock)');
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, verified: true } : u));
        }
    };

    const handleBlock = async (userId: string) => {
        try {
            await adminApi.blockUser(userId);
            toast.success('User blocked successfully');
            fetchUsers();
        } catch (error) {
            console.warn('Mock block success');
            toast.success('User blocked successfully (Mock)');
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, verified: false } : u));
        }
    };

    const filteredUsers = users.filter(user => {
        // Explicitly exclude System Admin
        if (user.role === 'admin' || user.email === 'admin@resqmeals.com') return false;

        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'donor': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 uppercase text-[10px] font-bold">Donor</Badge>;
            case 'ngo': return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 uppercase text-[10px] font-bold">NGO</Badge>;
            case 'volunteer': return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 uppercase text-[10px] font-bold">Volunteer</Badge>;
            case 'admin': return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 uppercase text-[10px] font-bold">Admin</Badge>;
            default: return <Badge variant="outline">{role}</Badge>;
        }
    };

    const getStatusBadge = (verified: boolean) => {
        if (verified) {
            return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1 border-none px-2 py-0.5">
                <ShieldCheck className="w-3 h-3" /> Verified
            </Badge>;
        } else {
            return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-1 border-none px-2 py-0.5">
                <Loader2 className="w-3 h-3 animate-spin" /> Pending/Blocked
            </Badge>;
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="animate-fade-in-up flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-2">
                        User <span className="text-gradient-green text-emerald-600">Management</span>
                    </h1>
                    <p className="text-muted-foreground text-lg flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-500" /> Oversee and moderate the ResQForce
                    </p>
                </div>
            </div>

            {/* Filters */}
            <Card className="animate-fade-in-up p-0 overflow-hidden shadow-sm border-2 border-transparent hover:border-primary/10 transition-colors" style={{ animationDelay: '100ms' }}>
                <CardContent className="p-4 bg-muted/30">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                className="pl-10 bg-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <div className="flex gap-1 bg-white p-1 rounded-lg border shadow-sm flex-wrap">
                                {(['all', 'donor', 'ngo', 'volunteer'] as const).map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => setRoleFilter(role)}
                                        className={`px-3 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${roleFilter === role
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'text-muted-foreground hover:bg-muted'
                                            }`}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users Grid */}
            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                        <p className="text-muted-foreground animate-pulse">Scanning ResQForce database...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <Card className="text-center py-20 border-dashed bg-muted/20">
                        <CardContent>
                            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <h3 className="text-xl font-bold text-muted-foreground">No users found</h3>
                            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUsers.map((user, index) => (
                            <Card key={user._id} className="flex flex-col animate-fade-in-up hover:shadow-lg hover:border-emerald-500/30 transition-all duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start mb-2">
                                        {getRoleBadge(user.role)}
                                        {getStatusBadge(user.verified)}
                                    </div>
                                    <CardTitle className="text-xl font-extrabold group-hover:text-primary transition-colors truncate">{user.name}</CardTitle>
                                    <CardDescription className="font-mono text-xs opacity-70 truncate">{user.email}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col">
                                    <div className="text-sm text-muted-foreground mb-4">
                                        Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown'}
                                    </div>

                                    {user.verificationDocument && (
                                        <div className="mb-4 bg-muted/40 p-2 rounded text-xs">
                                            <p className="font-semibold mb-1">Verification Document:</p>
                                            <div className="flex items-center justify-between">
                                                <span className="uppercase text-[10px] bg-slate-200 px-1 rounded">{user.documentType?.replace('_', ' ') || 'Document'}</span>
                                                <a
                                                    href={`http://localhost:5001/${user.verificationDocument}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline flex items-center gap-1"
                                                >
                                                    View File ↗
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-2 mt-auto pt-4 border-t border-border/50">
                                        {!user.verified && (
                                            <Button
                                                onClick={() => handleVerify(user._id)}
                                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase transition-all active:scale-95"
                                                size="sm"
                                            >
                                                <UserCheck className="w-3 h-3 mr-2" /> Verify
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            onClick={() => handleBlock(user._id)}
                                            className="flex-1 border-destructive/20 text-destructive hover:bg-destructive hover:text-white text-xs font-bold uppercase transition-all active:scale-95"
                                            size="sm"
                                        >
                                            <UserX className="w-3 h-3 mr-2" /> {user.verified ? 'Block' : 'Block / Reject'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
