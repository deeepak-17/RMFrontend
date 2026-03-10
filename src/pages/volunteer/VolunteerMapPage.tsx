import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Navigation, Package, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { tasksApi } from '@/lib/api';
import { toast } from 'sonner';

// leaflet icon fix
// @ts-ignore
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// @ts-ignore
import markerIcon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

export default function VolunteerMapPage() {
    const { user } = useAuth();
    const [availableTasks, setAvailableTasks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const center = user?.location?.coordinates
        ? [user.location.coordinates[1], user.location.coordinates[0]] as [number, number]
        : [12.9716, 77.5946] as [number, number];

    const fetchTasks = async () => {
        try {
            setIsLoading(true);
            const lat = center[0];
            const lng = center[1];
            const res = await tasksApi.getAvailable(lat, lng, 15);
            setAvailableTasks(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error('Failed to fetch available tasks', error);
            toast.error('Failed to load nearby tasks');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleAccept = async (taskId: string) => {
        try {
            setActionLoading(taskId);
            await tasksApi.accept(taskId);
            toast.success('Task accepted! It has been moved to your active tasks.');
            fetchTasks(); // refresh
        } catch (err) {
            console.error(err);
            toast.error('Failed to accept task');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="h-screen w-full flex flex-col relative">
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 right-0 z-[1000] p-4 bg-gradient-to-b from-white/90 to-transparent pointer-events-none">
                <div className="max-w-4xl mx-auto flex items-center justify-between pointer-events-auto">
                    <Link to="/volunteer/dashboard" className="inline-flex items-center text-gray-800 bg-white/80 backdrop-blur-md px-3 py-2 rounded-full shadow-sm hover:bg-white text-sm font-medium transition-all">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Link>
                    <div className="bg-white/90 backdrop-blur-md shadow-sm px-4 py-2 rounded-full flex items-center gap-2 pointer-events-auto">
                        <Navigation className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-bold text-gray-800">{availableTasks.length} Nearby Pickups</span>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 w-full bg-slate-100 z-0 relative">
                <MapContainer
                    center={center}
                    zoom={13}
                    zoomControl={false}
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution='&amp;copy OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Volunteer Location */}
                    <Marker position={center}>
                        <Popup>
                            <div className="text-xs font-bold text-blue-600 text-center">Your Location</div>
                        </Popup>
                    </Marker>

                    {/* Task Markers */}
                    {availableTasks.map(task => {
                        const donation = task.donationId;
                        if (!donation?.location?.coordinates) return null;
                        const pickupCoords: [number, number] = [donation.location.coordinates[1], donation.location.coordinates[0]];

                        // Time calculation
                        let timeString = '';
                        let isUrgent = false;
                        if (task.pickupWindowEnd) {
                            const diff = new Date(task.pickupWindowEnd).getTime() - Date.now();
                            if (diff < 0) return null; // Expired, skip
                            const hours = Math.floor(diff / (1000 * 60 * 60));
                            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                            timeString = `${hours}h ${minutes}m left`;
                            isUrgent = diff < 60 * 60 * 1000;
                        } else if (donation.expiryTime) {
                            const diff = new Date(donation.expiryTime).getTime() - Date.now();
                            if (diff < 0) return null;
                            const hours = Math.floor(diff / (1000 * 60 * 60));
                            timeString = `${hours}h left`;
                            isUrgent = diff < 60 * 60 * 1000;
                        }

                        return (
                            <Marker key={task._id} position={pickupCoords}>
                                <Popup className="min-w-[200px]">
                                    <div className="p-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="font-bold text-gray-900">{donation.title}</div>
                                            {task.priority === 'High' && (
                                                <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[9px] font-bold rounded-sm ml-2">HIGH</span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-600 mb-1 flex items-center gap-1.5">
                                            <Package className="w-3 h-3" />
                                            {donation.quantity} &bull; {donation.foodType}
                                        </div>
                                        <div className="text-xs text-gray-500 mb-3 truncate" title={donation.location.address}>
                                            {donation.location.address}
                                        </div>

                                        {timeString && (
                                            <div className={`text-[10px] font-bold py-1 px-2 rounded flex items-center gap-1.5 mb-3 ${isUrgent ? 'bg-orange-100 text-orange-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                                <Clock className="w-3 h-3" />
                                                Pickup Window: {timeString}
                                            </div>
                                        )}

                                        <Button
                                            size="sm"
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 h-8 text-white flex justify-center items-center"
                                            onClick={() => handleAccept(task._id)}
                                            disabled={actionLoading === task._id}
                                        >
                                            {actionLoading === task._id ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : null}
                                            Accept Pickup
                                        </Button>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>

            {/* Refresh / Tools panel */}
            <div className="absolute bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[1000]">
                <Button
                    variant="default"
                    className="rounded-full shadow-lg bg-gray-900 text-white hover:bg-black w-40 flex items-center justify-center gap-2"
                    onClick={fetchTasks}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                    Search This Area
                </Button>
            </div>
        </div>
    );
}
