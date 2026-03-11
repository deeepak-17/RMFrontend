import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { Map as MapIcon } from 'lucide-react';

// Fix for default marker icons in Leaflet with React/Webpack/Vite
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

interface VolunteerMapViewProps {
    pickup: [number, number]; // [lat, lng]
    delivery: [number, number]; // [lat, lng]
    volunteer?: [number, number]; // [lat, lng]
    pickupAddress?: string;
    deliveryAddress?: string;
    taskStatus: string;
}

export const VolunteerMapView = ({ pickup, delivery, volunteer, pickupAddress, deliveryAddress, taskStatus }: VolunteerMapViewProps) => {
    // Leaflet uses [lat, lng]
    const center: [number, number] = volunteer || [
        (pickup[0] + delivery[0]) / 2,
        (pickup[1] + delivery[1]) / 2
    ];

    return (
        <Card className="overflow-hidden border-emerald-100 shadow-sm h-[300px] relative z-0">
            <MapContainer
                center={center}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Volunteer Marker (Live Position) */}
                {volunteer && (
                    <Marker position={volunteer}>
                        <Popup>
                            <div className="text-xs font-bold text-blue-600">Your Current Position</div>
                        </Popup>
                    </Marker>
                )}

                {/* Pickup Marker */}
                <Marker position={pickup}>
                    <Popup>
                        <div className="text-xs">
                            <span className="font-bold text-emerald-600 uppercase block mb-1">Pickup</span>
                            {pickupAddress || 'Donor Location'}
                        </div>
                    </Popup>
                </Marker>

                {/* Delivery Marker */}
                <Marker position={delivery}>
                    <Popup>
                        <div className="text-xs">
                            <span className="font-bold text-orange-600 uppercase block mb-1">Delivery</span>
                            {deliveryAddress || 'NGO Location'}
                        </div>
                    </Popup>
                </Marker>

                {/* Route Line */}
                <Polyline
                    positions={volunteer ? [volunteer, taskStatus === 'picked' ? delivery : pickup] : [pickup, delivery]}
                    color="#10b981"
                    weight={3}
                    dashArray="5, 10"
                    opacity={0.6}
                />
            </MapContainer>

            {/* Overlay Info */}
            <div className="absolute top-2 right-2 z-[1000] flex flex-col gap-2 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-sm p-2 rounded-md border border-emerald-100 text-[10px] font-bold shadow-sm flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse bg-emerald-500`} />
                    LIVE TRACKING ACTIVE
                </div>
            </div>

            {/* Navigation Shortcuts */}
            <div className="absolute bottom-2 left-2 z-[1000] flex gap-2">
                <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${taskStatus === 'picked' ? delivery[0] : pickup[0]},${taskStatus === 'picked' ? delivery[1] : pickup[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white hover:bg-emerald-50 text-emerald-700 text-[10px] font-bold py-1.5 px-3 rounded-full border border-emerald-100 shadow-sm transition-colors flex items-center gap-1.5"
                >
                    <MapIcon className="w-3 h-3" />
                    Open Maps
                </a>
            </div>
        </Card>
    );
};
