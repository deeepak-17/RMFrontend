import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Clock, User, ClipboardList, Loader2, Sparkles } from 'lucide-react';

interface LogEntry {
    _id: string;
    userId?: string;
    userName?: string;
    userEmail?: string;
    action: string;
    details: string;
    category: 'auth' | 'donation' | 'task' | 'user' | 'system';
    timestamp: string;
}

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const getMockLogs = (): LogEntry[] => [
        { _id: '1', action: 'User Login', details: 'Admin logged in from 192.168.1.1', category: 'auth', timestamp: new Date().toISOString(), userName: 'Admin User' },
        { _id: '2', action: 'Donation Created', details: 'New donation: 5kg Rice', category: 'donation', timestamp: new Date(Date.now() - 3600000).toISOString(), userName: 'John Donor' },
        { _id: '3', action: 'User Verified', details: 'NGO "Helping Hands" verified', category: 'user', timestamp: new Date(Date.now() - 7200000).toISOString(), userName: 'Admin User' },
        { _id: '4', action: 'Task Assigned', details: 'Task #123 assigned to Volunteer Mike', category: 'task', timestamp: new Date(Date.now() - 86400000).toISOString(), userName: 'System' },
        { _id: '5', action: 'User Blocked', details: 'Blocked user for spam', category: 'user', timestamp: new Date(Date.now() - 90000000).toISOString(), userName: 'Admin User' },
        { _id: '6', action: 'System Backup', details: 'Daily backup completed', category: 'system', timestamp: new Date(Date.now() - 100000000).toISOString(), userName: 'System' },
    ];

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const response = await adminApi.getLogs();
            if (response.data.success) {
                setLogs(response.data.data);
            } else {
                setLogs(getMockLogs());
            }
        } catch (error) {
            console.warn('Using mock logs data');
            setLogs(getMockLogs());
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.userName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const getCategoryBadge = (category: string) => {
        switch (category) {
            case 'auth': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 uppercase text-[10px] font-bold">Security</Badge>;
            case 'donation': return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 uppercase text-[10px] font-bold">Donation</Badge>;
            case 'task': return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 uppercase text-[10px] font-bold">Mission</Badge>;
            case 'user': return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 uppercase text-[10px] font-bold">User</Badge>;
            default: return <Badge variant="outline" className="uppercase text-[10px] font-bold">{category}</Badge>;
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="animate-fade-in-up flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-2">
                        Operation <span className="text-gradient-green text-emerald-600">Intel</span>
                    </h1>
                    <p className="text-muted-foreground text-lg flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-500" /> Real-time audit trails and system activity
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
                                placeholder="Search intelligence logs..."
                                className="pl-10 bg-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <div className="flex gap-1 bg-white p-1 rounded-lg border shadow-sm items-center overflow-x-auto">
                                {(['all', 'auth', 'donation', 'task', 'user'] as const).map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategoryFilter(cat)}
                                        className={`px-3 py-1.5 text-xs font-bold uppercase rounded-md transition-all whitespace-nowrap ${categoryFilter === cat
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'text-muted-foreground hover:bg-muted'
                                            }`}
                                    >
                                        {cat === 'all' ? 'All' : cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Logs List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                        <p className="text-muted-foreground animate-pulse">Decrypting platform logs...</p>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <Card className="text-center py-20 border-dashed bg-muted/20">
                        <CardContent>
                            <ClipboardList className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <h3 className="text-xl font-bold text-muted-foreground">No Intel Found</h3>
                            <p className="text-muted-foreground">The audit trail is clear for these filters.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredLogs.map((log, index) => (
                            <Card key={log._id} className="animate-fade-in-up hover:shadow-md transition-all duration-200 border-l-4 border-l-emerald-500" style={{ animationDelay: `${index * 30}ms` }}>
                                <div className="flex flex-col md:flex-row md:items-center gap-6 p-6">
                                    <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-1 min-w-[140px]">
                                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-tight">
                                            <Clock className="w-3 h-3" />
                                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground opacity-60">
                                            {new Date(log.timestamp).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0">
                                        {getCategoryBadge(log.category)}
                                    </div>

                                    <div className="flex-1">
                                        <div className="font-bold text-lg mb-1">{log.action}</div>
                                        <div className="text-sm text-muted-foreground">{log.details}</div>
                                    </div>

                                    <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-xl">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Initiator</div>
                                            <div className="text-sm font-semibold">{log.userName || 'System'}</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
