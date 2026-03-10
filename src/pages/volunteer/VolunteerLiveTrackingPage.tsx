import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, MapPin, Package, CheckCircle2, Clock, AlertTriangle, Radio } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { tasksApi } from '@/lib/api';
import { toast } from 'sonner';
import { VolunteerMapView } from '@/components/volunteer/VolunteerMapView';

export default function VolunteerLiveTrackingPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTask, setActiveTask] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSharingLive, setIsSharingLive] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchActiveTask = async () => {
        try {
            const res = await tasksApi.getMyTasks();
            const tasks = Array.isArray(res.data) ? res.data : (res.data.data || []);
            // Find the first picked or accepted task
            const active = tasks.find((t: any) => ['accepted', 'picked'].includes(t.status));
            setActiveTask(active || null);
        } catch (error) {
            console.error('Error fetching task', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveTask();
    }, []);

    // Live location sharing
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isSharingLive && activeTask) {
            interval = setInterval(() => {
                if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(async (pos) => {
                        const { latitude, longitude } = pos.coords;
                        try {
                            await tasksApi.updateLiveLocation(activeTask._id, latitude, longitude);
                            toast.success("Live location updated", { id: 'live-loc' });
                        } catch (e) {
                            console.error("Loc update failed", e);
                        }
                    });
                } else {
                    // simulate
                    const lat = 12.9716 + (Math.random() - 0.5) * 0.01;
                    const lng = 77.5946 + (Math.random() - 0.5) * 0.01;
                    tasksApi.updateLiveLocation(activeTask._id, lat, lng).catch(console.error);
                }
            }, 30000); // 30 seconds

            toast.success("Live tracking started!");
        }
        return () => clearInterval(interval);
    }, [isSharingLive, activeTask]);

    const handleEmergencyReassign = async () => {
        if (!activeTask) return;
        if (!confirm("Are you sure? This will trigger an emergency alert and reassign the task immediately.")) return;

        try {
            setActionLoading(true);
            await tasksApi.triggerEmergencyReassign(activeTask._id);
            toast.success("Emergency reassignment triggered.");
            navigate('/volunteer/dashboard');
        } catch (error) {
            toast.error("Failed to trigger emergency reassignment");
        } finally {
            setActionLoading(false);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;
    }

    if (!activeTask) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center py-12 border-dashed">
                    <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-700">No Active Delivery</h2>
                    <p className="text-gray-500 mb-6">You don't have any task currently in transit.</p>
                    <Link to="/volunteer/tasks">
                        <Button className="bg-emerald-600">Go to My Tasks</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    const donation = activeTask.donationId;
    const ngo = activeTask.ngoId;
    const steps = ['assigned', 'accepted', 'picked', 'delivered'];
    const currentStepIndex = steps.indexOf(activeTask.status);

    const pickupCoords = donation?.location?.coordinates ? [donation.location.coordinates[1], donation.location.coordinates[0]] : [0, 0];
    const deliveryCoords = ngo?.location?.coordinates ? [ngo.location.coordinates[1], ngo.location.coordinates[0]] : [pickupCoords[0] + 0.01, pickupCoords[1] + 0.01];

    let timeString = '';
    let isUrgent = false;
    if (activeTask.pickupWindowEnd) {
        const diff = new Date(activeTask.pickupWindowEnd).getTime() - Date.now();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        timeString = diff > 0 ? `${hours}h ${minutes}m left` : "OVERDUE";
        isUrgent = diff < 60 * 60 * 1000 || diff < 0;
    }

    return (
        <div className="min-h-screen bg-neutral-50 pb-20">
            {/* Map Background */}
            <div className="h-[40vh] w-full relative">
                <VolunteerMapView
                    pickup={pickupCoords as [number, number]}
                    delivery={deliveryCoords as [number, number]}
                    volunteer={user?.location?.coordinates ? [user.location.coordinates[1], user.location.coordinates[0]] as [number, number] : undefined}
                    pickupAddress={donation?.location?.address}
                    deliveryAddress={ngo?.location?.address || ngo?.address}
                    taskStatus={activeTask.status}
                />

                <div className="absolute top-4 left-4 z-[1000]">
                    <Link to="/volunteer/dashboard" className="bg-white/90 backdrop-blur pb-1 flex items-center gap-2 px-3 py-2 rounded-full shadow hover:bg-white text-sm font-bold text-gray-800">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Link>
                </div>

                {activeTask.isEmergency && (
                    <div className="absolute top-4 right-4 z-[1000] bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold font-mono animate-pulse shadow-lg flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> EMERGENCY
                    </div>
                )}
            </div>

            <div className="max-w-2xl mx-auto -mt-10 relative z-10 px-4">
                <Card className="shadow-lg border-emerald-100 mb-4 overflow-hidden">
                    <CardContent className="p-0">
                        <div className="bg-emerald-600 p-4 text-white flex justify-between items-center">
                            <div>
                                <h2 className="font-bold text-lg">{donation?.title || 'Active Pickup'}</h2>
                                <p className="text-emerald-100 text-xs mt-0.5 font-mono">ID: #{activeTask._id.slice(-8)}</p>
                            </div>
                            <Button
                                size="sm"
                                variant={isSharingLive ? "destructive" : "secondary"}
                                className={`h-8 font-bold ${isSharingLive ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white text-emerald-700 hover:bg-emerald-50'}`}
                                onClick={() => setIsSharingLive(!isSharingLive)}
                            >
                                <Radio className={`w-3.5 h-3.5 mr-1.5 ${isSharingLive ? 'animate-pulse' : ''}`} />
                                {isSharingLive ? 'Stop Live' : 'Go Live'}
                            </Button>
                        </div>

                        <div className="p-6">
                            {/* Stepper */}
                            <div className="relative flex justify-between items-center mb-8">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full z-0" />
                                <div
                                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 rounded-full z-0 transition-all duration-500"
                                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                                />
                                {steps.map((step, idx) => (
                                    <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-white transition-colors duration-300 ${idx <= currentStepIndex ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                            {idx < currentStepIndex ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${idx <= currentStepIndex ? 'text-emerald-700' : 'text-gray-400'}`}>
                                            {step}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Details */}
                            <div className="space-y-4">
                                {timeString && (
                                    <div className={`flex items-center justify-between p-3 rounded-lg border ${isUrgent ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                                        <div className="flex items-center gap-2 font-bold text-sm">
                                            <Clock className="w-4 h-4" /> Window Remaining
                                        </div>
                                        <div className="font-mono font-bold text-base">{timeString}</div>
                                    </div>
                                )}

                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                    <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-sm text-gray-900 flex items-center gap-2">
                                            Pickup Details
                                            {activeTask.status === 'accepted' && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase">Next Stop</span>}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">{donation?.location?.address || 'Unknown address'}</p>
                                        <p className="text-xs text-gray-500 mt-1 font-mono bg-white inline-block px-1.5 border rounded">Qty: {donation?.quantity}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-sm text-gray-900 flex items-center gap-2">
                                            Drop-off Details
                                            {activeTask.status === 'picked' && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase">Next Stop</span>}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">{ngo?.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">{ngo?.location?.address || ngo?.address || 'Unknown address'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Emergency Trigger */}
                <div className="flex justify-center mt-6">
                    <Button
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 font-bold text-xs shadow-sm bg-white"
                        onClick={handleEmergencyReassign}
                        disabled={actionLoading}
                    >
                        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <AlertTriangle className="w-4 h-4 mr-2" />}
                        Trigger Emergency Reassignment
                    </Button>
                </div>
                <p className="text-center text-gray-400 text-[10px] mt-3 px-8 pb-4">
                    Only use emergency reassignment if you are completely unable to complete this pickup (e.g., vehicle breakdown, medical emergency).
                </p>
            </div>
        </div>
    );
}
