/**
 * NGO History Page
 * Owner: Deepak (NGO)
 * Branch: feature/ngo
 *
 * Features:
 * - Display claimed and collected donations
 * - Filter by status and date
 * - Show impact summary
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, Users, Leaf, Calendar, MapPin, CheckCircle2, Clock, Filter, Loader2 } from 'lucide-react';
import { donationsApi } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from 'sonner';

export default function NgoHistoryPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'delivered' | 'picked' | 'accepted' | 'assigned'>('all');
    const [ratingTaskId, setRatingTaskId] = useState<string | null>(null);
    const [ratingValue, setRatingValue] = useState(5);
    const [feedbackText, setFeedbackText] = useState("");
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const response = await donationsApi.getNgoTasks();
            setTasks(response.data || []);
        } catch (error) {
            console.error("Failed to load history", error);
            toast.error("Failed to load collection history");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitRating = async () => {
        if (!ratingTaskId) return;
        setIsSubmittingRating(true);
        try {
            await donationsApi.submitTaskFeedback(ratingTaskId, ratingValue, feedbackText);
            toast.success("Feedback submitted! Thank you.");
            setRatingTaskId(null);
            setFeedbackText("");
            fetchHistory(); // Refresh to hide the rate button
        } catch (error) {
            toast.error("Failed to submit feedback");
        } finally {
            setIsSubmittingRating(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    // Keep a ref to tasks for the voice handler
    const tasksRef = useRef(tasks);
    useEffect(() => { tasksRef.current = tasks; }, [tasks]);

    // Voice command listener
    useEffect(() => {
        const handle = (e: Event) => {
            const { key, itemName } = (e as CustomEvent).detail;
            const cur = tasksRef.current;

            if (key === 'ngo-filter-all') {
                setFilter('all');
            } else if (key === 'ngo-filter-collected' || key === 'filter-completed') {
                setFilter('delivered');
            } else if (key === 'ngo-filter-reserved' || key === 'filter-active') {
                setFilter('accepted');
            } else if (key === 'refresh-list') {
                fetchHistory();
            } else if (key === 'ngo-total') {
                const count = cur.filter(t => t.status === 'delivered').length;
                window.dispatchEvent(new CustomEvent('va-speak', { detail: { text: `Total collections: ${count}` } }));
            } else if (key === 'ngo-people-fed') {
                const count = cur.filter(t => t.status === 'delivered').length * 4;
                window.dispatchEvent(new CustomEvent('va-speak', { detail: { text: `People fed: approximately ${count}` } }));
            } else if (key === 'ngo-pending') {
                const count = cur.filter(t => ['assigned', 'accepted', 'picked'].includes(t.status)).length;
                window.dispatchEvent(new CustomEvent('va-speak', { detail: { text: `Pending pickups: ${count}` } }));
            } else if (key === 'track-latest') {
                let btn: HTMLButtonElement | null = null;
                if (itemName) {
                    const rows = document.querySelectorAll<HTMLElement>('[data-donation-title]');
                    for (const row of Array.from(rows)) {
                        if ((row.dataset.donationTitle ?? '').toLowerCase().includes(itemName)) {
                            btn = row.querySelector('[data-va="track"]');
                            break;
                        }
                    }
                }
                (btn ?? document.querySelector<HTMLButtonElement>('[data-va="track"]'))?.click();
            }
        };
        window.addEventListener('va-action', handle);
        return () => window.removeEventListener('va-action', handle);
    }, []);

    const filteredTasks = filter === 'all'
        ? tasks
        : tasks.filter(t => t.status === filter);


    const stats = {
        totalCollections: tasks.filter(t => t.status === 'delivered').length,
        peopleFed: tasks.filter(t => t.status === 'delivered').length * 4,
        co2Saved: tasks.filter(t => t.status === 'delivered').length * 2.5,
        pending: tasks.filter(t => ['assigned', 'accepted', 'picked'].includes(t.status)).length,
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'delivered':
                return (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Delivered
                    </span>
                );
            case 'picked':
                return (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                        <Package className="w-3 h-3" /> In Transit
                    </span>
                );
            case 'accepted':
            case 'assigned':
                return (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Promised
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                        {status}
                    </span>
                );
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link to="/ngo/dashboard" className="p-2 hover:bg-white rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Collection History</h1>
                        <p className="text-gray-600">Track your rescued food impact</p>
                    </div>
                </div>

                {/* Impact Summary */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-white shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Total Collections</p>
                                    <p className="text-2xl font-bold text-emerald-600">{stats.totalCollections}</p>
                                </div>
                                <div className="p-3 bg-emerald-100 rounded-full">
                                    <Package className="w-5 h-5 text-emerald-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">People Fed</p>
                                    <p className="text-2xl font-bold text-blue-600">{stats.peopleFed}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">CO₂ Saved</p>
                                    <p className="text-2xl font-bold text-teal-600">{stats.co2Saved} kg</p>
                                </div>
                                <div className="p-3 bg-teal-100 rounded-full">
                                    <Leaf className="w-5 h-5 text-teal-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white shadow-sm">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Pending Pickups</p>
                                    <p className="text-2xl font-bold text-orange-500">{stats.pending}</p>
                                </div>
                                <div className="p-3 bg-orange-100 rounded-full">
                                    <Clock className="w-5 h-5 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-500 mr-2">
                        <Filter className="w-4 h-4 inline-block mr-1" /> Filter:
                    </span>
                    {['all', 'delivered', 'picked', 'accepted'].map((status) => (
                        <Button
                            key={status}
                            variant={filter === status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter(status as any)}
                            className={filter === status ? 'bg-emerald-600' : ''}
                        >
                            {status === 'all' ? 'All' :
                                status.charAt(0).toUpperCase() + status.slice(1)}
                        </Button>
                    ))}
                </div>

                {/* Collection List */}
                <Card className="bg-white shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-500" />
                            Recent Tasks ({filteredTasks.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="animate-spin w-8 h-8 text-emerald-500" />
                            </div>
                        ) : filteredTasks.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-600 font-medium">No activity found</p>
                                <p className="text-sm text-gray-400 mt-2">
                                    {filter !== 'all' ? 'Try changing the filter or ' : ''}
                                    Start by claiming available donations
                                </p>
                                <Link to="/ngo/available">
                                    <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                                        Find Donations
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredTasks.map((task) => (
                                    <div
                                        key={task._id}
                                        data-donation-title={task.donationId?.title}
                                        className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`p-2 rounded-lg ${task.status === 'delivered' ? 'bg-green-100' :
                                                'bg-yellow-100'
                                                }`}>
                                                <Package className={`w-5 h-5 ${task.status === 'delivered' ? 'text-green-600' :
                                                    'text-yellow-600'
                                                    }`} />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{task.donationId?.title || 'Food Donation'}</h4>
                                                <p className="text-sm text-gray-600">Volunteer: {task.volunteerId?.name || 'Pending Assignment'}</p>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" /> {task.donationId?.location?.address || 'Pickup Point'}
                                                    </span>
                                                    {task.volunteerId?.reliabilityScore && (
                                                        <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 rounded">
                                                            {task.volunteerId.reliabilityScore}% Reliable
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(task.status)}

                                                {task.status?.toLowerCase() === 'delivered' && (
                                                    !task.rating ? (
                                                        <Button
                                                            onClick={() => setRatingTaskId(task._id)}
                                                            variant="default"
                                                            size="sm"
                                                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                                                        >
                                                            Rate Volunteer
                                                        </Button>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                                                            ★ {task.rating} Rated
                                                        </span>
                                                    )
                                                )}

                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button data-va="track" variant="outline" size="sm" className="h-7 text-xs gap-1">
                                                            <Clock className="w-3 h-3" /> Track

                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-md">
                                                        <DialogHeader>
                                                            <DialogTitle>Chain of Custody</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="space-y-4 py-4">
                                                            {(() => {
                                                                const seen = new Set();
                                                                // Deduplicate: Keep the LATEST entry for each status (to prioritize feedback)
                                                                return [...(task.history || [])].reverse().filter((h: any) => {
                                                                    if (seen.has(h.status)) return false;
                                                                    seen.add(h.status);
                                                                    return true;
                                                                }).reverse();
                                                            })()?.map((h: any, i: number) => (
                                                                <div key={i} className="flex gap-3 relative before:absolute before:left-2 before:top-6 before:bottom-0 before:w-0.5 before:bg-gray-100 last:before:hidden">
                                                                    <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm shrink-0" />
                                                                    <div>
                                                                        <p className="text-sm font-bold capitalize">{h.status}</p>
                                                                        <p className="text-[10px] text-gray-400">{new Date(h.timestamp).toLocaleString()}</p>
                                                                        <p className="text-xs text-gray-500 mt-1 italic">{h.note}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>

                                            <span className="text-xs text-gray-500">
                                                {task.deliveredAt ? `Delivered ${formatDate(task.deliveredAt)}` :
                                                    task.assignedAt ? `Assigned ${formatDate(task.assignedAt)}` : ''}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Rating Dialog (User Story 5.5, 5.8) */}
            <Dialog open={!!ratingTaskId} onOpenChange={() => setRatingTaskId(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Volunteer Performance Review</DialogTitle>
                    </DialogHeader>
                    <div className="py-6 space-y-6 flex flex-col items-center">
                        <div className="text-center space-y-2">
                            <p className="text-sm text-gray-500">How was your delivery experience with the volunteer?</p>
                            <div className="flex justify-center gap-2 mt-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRatingValue(star)}
                                        className={`p-1 transition-all ${star <= ratingValue ? 'text-amber-400 scale-110' : 'text-gray-300 hover:text-amber-200'}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-10 h-10 ${star <= ratingValue ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="w-full space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Comments for Improvement</label>
                            <textarea
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                className="w-full min-h-[100px] p-3 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                placeholder="Describe the hygiene, punctuality, or any issues..."
                            />
                        </div>

                        <Button
                            onClick={handleSubmitRating}
                            disabled={isSubmittingRating}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 text-base font-bold rounded-xl"
                        >
                            {isSubmittingRating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Submit Performance Review"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
