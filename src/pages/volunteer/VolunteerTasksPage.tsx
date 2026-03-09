/**
 * Volunteer Tasks Page
 * Owner: Member 4 (Volunteer)
 * Branch: feature/volunteer
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Package, Check, Loader2, Map as MapIcon, X, Navigation, Sparkles, Star, Info, Clock } from 'lucide-react';
import type { PickupTask } from '@/types';
import { tasksApi } from '@/lib/api';
import { VolunteerMapView } from '@/components/volunteer/VolunteerMapView';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, Bell } from 'lucide-react';
import { socketService } from '@/lib/socket';

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function VolunteerTasksPage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<PickupTask[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [showMapForTask, setShowMapForTask] = useState<string | null>(null);
    const [confirmDeliveryId, setConfirmDeliveryId] = useState<string | null>(null);
    const [deliveryFeedback, setDeliveryFeedback] = useState("");
    const [deliveryRating, setDeliveryRating] = useState(5);

    const fetchTasks = async () => {
        try {
            setIsLoading(true);
            const response = await tasksApi.getMyTasks();
            const taskList = Array.isArray(response.data) ? response.data : (response.data.data || []);
            setTasks(taskList);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error("Failed to load tasks");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();

        // Socket listener for new assignments
        const onTaskAssigned = (data: any) => {
            console.log("Tasks Page: New task assigned", data);
            toast.info("🛎️ You've been assigned a new task!", {
                icon: <Bell className="w-4 h-4 text-emerald-600" />,
                duration: 5000
            });
            fetchTasks();
        };

        const onReassignmentNeeded = () => fetchTasks();

        socketService.on('task:assigned', onTaskAssigned);
        socketService.on('task:reassignment_needed', onReassignmentNeeded);

        return () => {
            socketService.off('task:assigned', onTaskAssigned);
            socketService.off('task:reassignment_needed', onReassignmentNeeded);
        };
    }, []);

    const handleAccept = async (taskId: string) => {
        try {
            setActionLoading(taskId);
            await tasksApi.accept(taskId);
            toast.success("Task accepted! Get ready for pickup.");
            await fetchTasks();
        } catch (error) {
            console.error('Error accepting task:', error);
            toast.error("Failed to accept task.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleUpdateStatus = async (taskId: string, status: 'picked' | 'delivered', feedback?: string, rating?: number) => {
        try {
            setActionLoading(taskId);
            await tasksApi.updateStatus(taskId, status, feedback, rating);

            if (status === 'delivered') {
                toast.success("Great job! Delivery confirmed and credits earned.");
                setConfirmDeliveryId(null);
                setDeliveryFeedback("");
                setDeliveryRating(5);
            } else {
                toast.success("Marked as picked. Proceed to delivery.");
            }

            await fetchTasks();
        } catch (error) {
            console.error('Error updating task status:', error);
            toast.error("Failed to update status.");
        } finally {
            setActionLoading(null);
        }
    };

    const activeTasks = tasks.filter((t: any) => ['assigned', 'accepted', 'picked'].includes(t.status?.toLowerCase()));

    return (
        <div className="min-h-screen bg-neutral-50 p-4">
            <div className="max-w-4xl mx-auto pb-20">
                <Link to="/volunteer/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">My Tasks</h1>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchTasks}
                        disabled={isLoading}
                        className="text-xs h-8"
                    >
                        {isLoading ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : null}
                        Refresh
                    </Button>
                </div>

                {isLoading && tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-4" />
                        <p className="text-gray-500">Retrieving your assignments...</p>
                    </div>
                ) : tasks.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-600 font-medium">No tasks assigned yet.</p>
                            <p className="text-sm text-gray-400 mt-2">You'll be notified when a new pickup is nearby.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <Tabs defaultValue="active" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6 h-12 bg-white rounded-xl shadow-sm border border-gray-100 p-1">
                            <TabsTrigger value="active" className="rounded-lg font-bold data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm">
                                Active Tasks ({activeTasks.length})
                            </TabsTrigger>
                            <TabsTrigger value="past" className="rounded-lg font-bold data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700 data-[state=active]:shadow-sm">
                                Past Tasks ({tasks.length - activeTasks.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="active" className="space-y-4 outline-none">
                            {activeTasks.length === 0 ? (
                                <Card className="border-dashed bg-transparent shadow-none border-2">
                                    <CardContent className="text-center py-12">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                            <Package className="w-8 h-8 text-emerald-600/50" />
                                        </div>
                                        <p className="text-gray-600 font-medium">No active tasks right now.</p>
                                        <p className="text-sm text-gray-400 mt-2">You'll be pinged when a pickup comes in.</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                activeTasks.map((task: any) => {
                                    const donation = task.donationId;
                                    const ngo = task.ngoId;
                                    const isActive = ['accepted', 'picked'].includes(task.status);

                                    // Reversing GeoJSON [lng, lat] for Leaflet [lat, lng]
                                    const pickupCoords: [number, number] = donation?.location?.coordinates
                                        ? [donation.location.coordinates[1], donation.location.coordinates[0]]
                                        : [0, 0];
                                    const deliveryCoords: [number, number] = ngo?.location?.coordinates
                                        ? [ngo.location.coordinates[1], ngo.location.coordinates[0]]
                                        : [pickupCoords[0] + 0.01, pickupCoords[1] + 0.01];

                                    // Calculate distance from volunteer
                                    const volCoords = user?.location?.coordinates || [0, 0];
                                    const distance = user?.location?.coordinates
                                        ? getDistance(volCoords[1], volCoords[0], pickupCoords[0], pickupCoords[1])
                                        : null;

                                    return (
                                        <Card key={task._id} className={`overflow-hidden transition-all ${isActive ? 'ring-1 ring-emerald-500 shadow-md' : ''}`}>
                                            <CardContent className="p-0">
                                                <div className="p-4">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="font-semibold text-lg">{donation?.title || 'Pickup Task'}</h3>
                                                                {distance !== null && (
                                                                    <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 rounded-full">
                                                                        <Navigation className="w-2.5 h-2.5" />
                                                                        {distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`} away
                                                                    </span>
                                                                )}
                                                                {(() => {
                                                                    const expiry = new Date(donation?.expiryTime).getTime();
                                                                    const now = Date.now();
                                                                    const diff = expiry - now;
                                                                    if (diff < 0) return (
                                                                        <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 rounded-full">EXPIRED</span>
                                                                    );

                                                                    const hours = Math.floor(diff / (1000 * 60 * 60));
                                                                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                                                    const isUrgent = diff < 60 * 60 * 1000; // < 1 hour

                                                                    return (
                                                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full flex items-center gap-1 ${isUrgent ? 'bg-orange-100 text-orange-700 animate-pulse' : 'bg-emerald-50 text-emerald-700'}`}>
                                                                            <Clock className="w-2.5 h-2.5" />
                                                                            {hours}h {minutes}m left
                                                                        </span>
                                                                    );
                                                                })()}
                                                                {task.priority === 'High' && (
                                                                    <span className="px-2 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded-full">
                                                                        HIGH PRIORITY
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full tracking-wider ${task.status === 'assigned' ? 'bg-slate-100 text-slate-600' :
                                                                task.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                                                                    task.status === 'picked' ? 'bg-emerald-100 text-emerald-700' :
                                                                        'bg-gray-100 text-gray-500'
                                                                }`}>
                                                                {task.status.toUpperCase()}
                                                            </span>
                                                            {task.status === 'delivered' && task.deliveredAt && (
                                                                <span className="ml-2 text-[10px] text-gray-400 font-medium">
                                                                    at {new Date(task.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Impact</div>
                                                            <div className="text-sm font-bold text-emerald-600 flex items-center justify-end gap-1">
                                                                <Check className="w-3.5 h-3.5" />
                                                                +10 Credits
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                                        <div className="bg-white p-3 rounded-lg border border-gray-100">
                                                            <div className="flex items-center gap-2 mb-2 font-bold text-xs text-gray-400 uppercase tracking-wider">
                                                                <Package className="w-3.5 h-3.5 text-emerald-600" />
                                                                <span>Pickup From</span>
                                                            </div>
                                                            <p className="text-sm text-gray-800 font-medium leading-tight">{donation?.location?.address || 'Pickup address not specified'}</p>
                                                            <div className="mt-2 text-[10px] text-gray-400 font-medium flex items-center gap-2">
                                                                <span>{donation?.quantity || 'Standard'} qty</span>
                                                                <span>•</span>
                                                                <span>ID: #{task._id.slice(-6)}</span>
                                                            </div>
                                                        </div>

                                                        <div className="bg-white p-3 rounded-lg border border-gray-100">
                                                            <div className="flex items-center gap-2 mb-2 font-bold text-xs text-gray-400 uppercase tracking-wider">
                                                                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                                                                <span>Deliver To</span>
                                                            </div>
                                                            <p className="text-sm text-gray-800 font-medium leading-tight">{ngo?.name || 'Authorized NGO'}</p>
                                                            <p className="text-[10px] text-gray-400 mt-1 truncate">{ngo?.address || 'Delivery point info provided'}</p>
                                                        </div>
                                                    </div>

                                                    {showMapForTask === task._id && (
                                                        <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                            <VolunteerMapView
                                                                pickup={pickupCoords}
                                                                delivery={deliveryCoords}
                                                                volunteer={user?.location?.coordinates ? [volCoords[1], volCoords[0]] : undefined}
                                                                pickupAddress={donation?.location?.address}
                                                                deliveryAddress={ngo?.address}
                                                                taskStatus={task.status}
                                                            />
                                                        </div>
                                                    )}

                                                    {['assigned', 'accepted'].includes(task.status) && (
                                                        <div className="flex flex-wrap gap-2 pt-2">
                                                            {task.status === 'assigned' && (
                                                                <Button
                                                                    onClick={() => handleAccept(task._id)}
                                                                    className="bg-emerald-600 hover:bg-emerald-700 flex-1 h-9"
                                                                    disabled={actionLoading === task._id || new Date(donation?.expiryTime).getTime() < Date.now()}
                                                                >
                                                                    {actionLoading === task._id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                                                                    {new Date(donation?.expiryTime).getTime() < Date.now() ? 'Cannot Accept (Expired)' : 'Accept Task'}
                                                                </Button>
                                                            )}
                                                            {task.status === 'accepted' && (
                                                                <Button
                                                                    onClick={() => handleUpdateStatus(task._id, 'picked')}
                                                                    className="bg-emerald-600 hover:bg-emerald-700 flex-1 h-9"
                                                                    disabled={actionLoading === task._id}
                                                                >
                                                                    {actionLoading === task._id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Package className="w-4 h-4 mr-2" />}
                                                                    Mark as Picked
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="outline"
                                                                onClick={async () => {
                                                                    if (confirm("Are you sure? This will automatically reassign the task.")) {
                                                                        try {
                                                                            setActionLoading(task._id);
                                                                            await tasksApi.decline(task._id);
                                                                            toast.success("Task reassigned.");
                                                                            await fetchTasks();
                                                                        } catch (e) { toast.error("Failed to decline."); } finally { setActionLoading(null); }
                                                                    }
                                                                }}
                                                                className="border-red-200 text-red-600 hover:bg-red-50 h-9"
                                                                disabled={actionLoading === task._id}
                                                            >
                                                                Decline
                                                            </Button>
                                                        </div>
                                                    )}
                                                    {task.status === 'picked' && (
                                                        <Button
                                                            onClick={() => setConfirmDeliveryId(task._id)}
                                                            className="bg-emerald-600 hover:bg-emerald-700 flex-1 h-9"
                                                            disabled={actionLoading === task._id}
                                                        >
                                                            {actionLoading === task._id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                                                            Mark as Delivered
                                                        </Button>
                                                    )}

                                                    {isActive && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setShowMapForTask(showMapForTask === task._id ? null : task._id)}
                                                            className={`h-9 w-9 ${showMapForTask === task._id ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400'}`}
                                                        >
                                                            {showMapForTask === task._id ? <X className="w-5 h-5" /> : <MapIcon className="w-5 h-5" />}
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            )}
                        </TabsContent>

                        <TabsContent value="past" className="space-y-4 outline-none pt-2">
                            {tasks.length - activeTasks.length === 0 ? (
                                <div className="text-center py-10 bg-white rounded-xl border border-gray-100 shadow-sm">
                                    <History className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium text-sm">No past tasks found.</p>
                                </div>
                            ) : (
                                tasks.filter((t: any) => !['assigned', 'accepted', 'picked'].includes(t.status?.toLowerCase())).map((task: any) => {
                                    const donation = task.donationId;
                                    const ngo = task.ngoId;

                                    return (
                                        <Card key={task._id} className="overflow-hidden border-gray-100 shadow-sm opacity-80">
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800">{donation?.title || 'Pickup Task'}</h3>
                                                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full tracking-wider mt-1 ${task.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {task.status.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    {task.status === 'delivered' && (
                                                        <div className="text-sm font-bold text-emerald-600 flex items-center justify-end gap-1">
                                                            <Check className="w-3.5 h-3.5" /> +10
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500 space-y-2">
                                                    <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-gray-400" /> From: {donation?.location?.address || 'Unknown'}</p>
                                                    <p className="flex items-center gap-1.5"><Package className="w-3 h-3 text-gray-400" /> To: {ngo?.name || 'Unknown'}</p>

                                                    {(task.rating || task.feedback) && (
                                                        <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
                                                            {task.rating && (
                                                                <div className="flex items-center gap-1 mb-1">
                                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                                        <Star key={s} className={`w-3 h-3 ${s <= task.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {task.feedback && (
                                                                <p className="text-[11px] italic text-gray-600 flex items-start gap-1">
                                                                    <Info className="w-3 h-3 mt-0.5 text-gray-400 flex-shrink-0" />
                                                                    "{task.feedback}"
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            )}
                        </TabsContent>
                    </Tabs>
                )}

                {/* Delivery Confirmation Dialog */}
                <Dialog open={!!confirmDeliveryId} onOpenChange={(open) => !open && setConfirmDeliveryId(null)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Confirm Delivery</DialogTitle>
                            <DialogDescription>
                                Are you at the NGO location? Only confirm if the food has been safely handed over.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center justify-center py-4 space-y-4">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                                <Check className="w-8 h-8 text-emerald-600" />
                            </div>
                            <div className="w-full space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center block">Rate your experience</label>
                                    <div className="flex justify-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setDeliveryRating(star)}
                                                className={`transition-all ${star <= deliveryRating ? 'text-amber-400 scale-110' : 'text-gray-300 hover:text-amber-200'}`}
                                            >
                                                <Sparkles className={`w-8 h-8 ${star <= deliveryRating ? 'fill-amber-400' : ''}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Optional Delivery Feedback</label>
                                    <textarea
                                        className="w-full min-h-[80px] p-3 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Any notes about the delivery or location? (e.g., Left at reception)"
                                        value={deliveryFeedback}
                                        onChange={(e) => setDeliveryFeedback(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="sm:justify-between sm:space-x-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setConfirmDeliveryId(null)}
                                className="flex-1"
                                disabled={actionLoading !== null}
                            >
                                Not yet
                            </Button>
                            <Button
                                type="button"
                                className="bg-emerald-600 hover:bg-emerald-700 flex-1"
                                onClick={() => confirmDeliveryId && handleUpdateStatus(confirmDeliveryId, 'delivered', deliveryFeedback, deliveryRating)}
                                disabled={actionLoading !== null}
                            >
                                {actionLoading !== null ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Yes, Delivered!
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div >
    );
}
