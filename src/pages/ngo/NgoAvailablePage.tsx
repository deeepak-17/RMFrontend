/**
 * NGO Available Donations Page
 * Owner: Deepak (NGO)
 * Branch: feature/ngo
 *
 * Features:
 * - Display nearby donations in list and map view
 * - Expandable fullscreen map with Street View panel
 * - Multiple map layers (Street, Satellite, Terrain, Dark)
 * - Embedded 360° Google Street View
 * - Filter by distance and food type
 * - Claim donations
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft, MapPin, Clock, List, Map, Utensils, Users,
    AlertCircle, CheckCircle2, Layers, Eye, Globe2, Satellite,
    Mountain, Maximize2, X, Navigation, ExternalLink
} from 'lucide-react';
import { donationsApi } from '@/lib/api';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useMap } from 'react-leaflet';

// Helper component to recenter map when selected donation changes
const RecenterMap = ({ position }: { position: L.LatLngExpression | null }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 15, { duration: 1.5 });
        }
    }, [position, map]);
    return null;
};

// Custom marker icons with pulse animation for urgent
const createCustomIcon = (color: string, isUrgent: boolean) => {
    const size = isUrgent ? 40 : 32;
    const pulseRing = isUrgent ? `
        <circle cx="12" cy="8" r="10" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.4">
            <animate attributeName="r" from="8" to="16" dur="1.5s" repeatCount="indefinite"/>
            <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite"/>
        </circle>` : '';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">
        ${pulseRing}
        <defs>
            <filter id="shadow-${color.replace('#', '')}" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-opacity="0.3"/>
            </filter>
        </defs>
        <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8z" 
              fill="${color}" stroke="white" stroke-width="2" filter="url(#shadow-${color.replace('#', '')})"/>
        <circle cx="12" cy="8" r="3.5" fill="white"/>
        ${isUrgent ? `<circle cx="12" cy="8" r="2" fill="${color}"/>` : ''}
    </svg>`;
    return L.divIcon({
        html: svg,
        className: 'custom-marker',
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size + 4],
    });
};

const urgentIcon = createCustomIcon('#ef4444', true);
const normalIcon = createCustomIcon('#059669', false);
const claimedIcon = createCustomIcon('#9ca3af', false);

// Tile layer configurations
const tileLayers = {
    street: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        label: 'Street',
        icon: Globe2,
    },
    satellite: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri, Maxar, Earthstar Geographics',
        label: 'Satellite',
        icon: Satellite,
    },
    terrain: {
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
        label: 'Terrain',
        icon: Mountain,
    },
    dark: {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        label: 'Dark',
        icon: Eye,
    },
};

// Google Maps with Street View layer (works without API key)
const getStreetViewIframeUrl = (lat: number, lng: number) =>
    `https://www.google.com/maps?layer=c&cbll=${lat},${lng}&cbp=12,0,,0,0&output=svembed`;

// Google Street View full URL (opens in new tab)
const getStreetViewUrl = (lat: number, lng: number) =>
    `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;

// Google Maps directions URL
const getDirectionsUrl = (lat: number, lng: number) =>
    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;



interface Donation {
    _id: string;
    title: string;
    description: string;
    quantity: number;
    unit: string;
    foodType: string;
    donor: { name: string; phone: string };
    location: { address: string; distance: number; coordinates: number[] };
    expiryTime: string;
    pickupWindow: { start: string; end: string };
    status: string;
    servingsCount: number;
    imageUrl?: string;
    riskScore?: number;
    riskFactors?: string[];
    emergencyMode?: boolean;
    isHighRisk?: boolean;
}

const getTimeRemaining = (expiryTime: string) => {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const diffMs = expiry.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (diffHours <= 0 && diffMins <= 0) return 'Expired';
    if (diffHours === 0) return `${diffMins}m left`;
    return `${diffHours}h ${diffMins}m left`;
};

const isUrgent = (expiryTime: string) => {
    const now = new Date();
    const expiry = new Date(expiryTime);
    return (expiry.getTime() - now.getTime()) / (1000 * 60 * 60) <= 2;
};

export default function NgoAvailablePage() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
    const [claimingId, setClaimingId] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [activeLayer, setActiveLayer] = useState<keyof typeof tileLayers>('street');
    const [isExpanded, setIsExpanded] = useState(false);
    const [streetViewDonation, setStreetViewDonation] = useState<Donation | null>(null);

    // Fetch donations from API with geolocation
    useEffect(() => {
        const fetchDonations = async (lat = 0, lng = 0) => {
            try {
                setIsLoading(true);
                const response = await donationsApi.getNearby(lat, lng);
                const donationList = response.data.donations || response.data.data || (Array.isArray(response.data) ? response.data : []);

                // Map backend response (donorId) to frontend structure (donor)
                const mappedDonations = donationList.map((d: any) => ({
                    ...d,
                    donor: d.donorId || { name: 'Unknown Donor', phone: '' },
                    // Ensure imageUrl has full path if relative
                    imageUrl: d.imageUrl,
                    // Ensure location is valid
                    location: d.location || { address: 'Unknown', distance: 0, coordinates: [0, 0] }
                }));

                setDonations(mappedDonations);
            } catch (error) {
                console.error('Error fetching donations:', error);
                setDonations([]);
            } finally {
                setIsLoading(false);
            }
        };

        if ("geolocation" in navigator) {
            const geoTimeout = setTimeout(() => {
                console.log("Geolocation timeout, fetching with defaults");
                fetchDonations(0, 0);
            }, 5000);

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    clearTimeout(geoTimeout);
                    fetchDonations(pos.coords.latitude, pos.coords.longitude);
                },
                (err) => {
                    clearTimeout(geoTimeout);
                    console.warn("Geolocation denied or failed:", err.message);
                    fetchDonations(0, 0);
                },
                { timeout: 4500 }
            );
        } else {
            fetchDonations(0, 0);
        }
    }, []);

    // Lock body scroll when expanded
    useEffect(() => {
        if (isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isExpanded]);

    // ── Voice command listener ──────────────────────────────────
    const donationsRef = useRef(donations);
    useEffect(() => { donationsRef.current = donations; }, [donations]);

    useEffect(() => {
        const handle = (e: Event) => {
            const { key, itemName } = (e as CustomEvent).detail;
            const current = donationsRef.current;

            if (key === 'show-map') {
                setViewMode('map');
            } else if (key === 'show-list') {
                setViewMode('list');
            } else if (key === 'impact-report') {
                document.querySelector('[data-va="impact"]')?.scrollIntoView({ behavior: 'smooth' });
            } else if (key === 'claim-first') {
                const first = current.find((d) => d.status === 'available');
                if (first) handleClaim(first._id);
            } else if (key === 'track-latest') {
                // Match by item name if provided, otherwise click first track button
                let btn: HTMLButtonElement | null = null;
                if (itemName) {
                    const cards = document.querySelectorAll<HTMLElement>('[data-donation-title]');
                    for (const card of Array.from(cards)) {
                        const title = card.dataset.donationTitle?.toLowerCase() ?? '';
                        if (title.includes(itemName)) {
                            btn = card.querySelector('[data-va="track"]');
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

    const handleClaim = async (donationId: string) => {
        setClaimingId(donationId);
        try {
            await donationsApi.accept(donationId);
            setSuccessMessage("Donation claimed successfully! A volunteer will be assigned for transport.");
            setDonations(prev => prev.map(d =>
                d._id === donationId ? { ...d, status: 'claimed' } : d
            ));
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (error: any) {
            console.error('Error claiming donation:', error);
            alert(error.response?.data?.message || "Failed to claim donation.");
        } finally {
            setClaimingId(null);
            setSelectedDonation(null);
        }
    };

    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';

    // Filter and sort donations
    const filteredDonations = useMemo(() => {
        return donations.filter(d => {
            if (!searchQuery) return true;
            return (
                d.title.toLowerCase().includes(searchQuery) ||
                d.description.toLowerCase().includes(searchQuery) ||
                (d.donor?.name || '').toLowerCase().includes(searchQuery) ||
                d.foodType.toLowerCase().includes(searchQuery)
            );
        });
    }, [donations, searchQuery]);

    const sortedDonations = useMemo(() => {
        return [...filteredDonations].sort((a, b) => {
            const aUrgent = isUrgent(a.expiryTime);
            const bUrgent = isUrgent(b.expiryTime);
            if (aUrgent && !bUrgent) return -1;
            if (!aUrgent && bUrgent) return 1;
            return a.location.distance - b.location.distance;
        });
    }, [filteredDonations]);

    // ---- Shared Map Component ----
    const renderMap = (height: string) => (
        <MapContainer
            center={[13.0827, 80.2707] as L.LatLngExpression}
            zoom={14}
            style={{ height, width: '100%' }}
            zoomControl={true}
        >
            <TileLayer
                key={activeLayer}
                attribution={tileLayers[activeLayer].attribution}
                url={tileLayers[activeLayer].url}
            />
            <Circle
                center={[13.0827, 80.2707] as L.LatLngExpression}
                radius={4000}
                pathOptions={{
                    color: '#059669', fillColor: '#059669',
                    fillOpacity: 0.05, weight: 1, dashArray: '6 4',
                }}
            />
            {sortedDonations
                .filter(donation => donation.status === 'available')
                .map((donation) => {
                    const urgent = isUrgent(donation.expiryTime);
                    const icon = urgent ? urgentIcon : normalIcon;
                    const coords = donation.location.coordinates;
                    // Backend stores as [lng, lat], Leaflet needs [lat, lng]
                    return (
                        <Marker key={donation._id} position={[coords[1], coords[0]] as L.LatLngExpression}
                            icon={icon} eventHandlers={{ click: () => setSelectedDonation(donation) }}>
                            <Popup maxWidth={280} minWidth={230}>
                                <div style={{ fontFamily: 'system-ui, sans-serif' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <h4 style={{ fontWeight: 700, fontSize: '15px', margin: 0, color: '#111827', lineHeight: '1.3' }}>
                                            {donation.title}
                                        </h4>
                                        {urgent && donation.status === 'available' && (
                                            <span style={{ background: 'linear-gradient(135deg, #fef2f2, #fee2e2)', color: '#dc2626', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                                                ⚡ {donation.emergencyMode ? 'EMERGENCY' : 'URGENT'}
                                            </span>
                                        )}
                                    </div>
                                    {donation.riskScore !== undefined && (
                                        <div style={{ marginBottom: '8px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                                <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 600 }}>SAFETY RISK</span>
                                                <span style={{ fontSize: '10px', color: donation.riskScore > 75 ? '#dc2626' : donation.riskScore > 40 ? '#ea580c' : '#059669', fontWeight: 800 }}>{donation.riskScore}%</span>
                                            </div>
                                            <div style={{ height: '4px', background: '#f3f4f6', borderRadius: '2px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${donation.riskScore}%`, background: donation.riskScore > 75 ? '#ef4444' : donation.riskScore > 40 ? '#f97316' : '#10b981' }} />
                                            </div>
                                        </div>
                                    )}
                                    <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.7' }}>
                                        <p style={{ margin: '0 0 2px 0' }}>🏪 {donation.donor.name}</p>
                                        <p style={{ margin: '0 0 2px 0' }}>🍽️ {donation.servingsCount} servings • {donation.quantity} {donation.unit}</p>
                                        <p style={{ margin: '0 0 2px 0' }}>📍 {donation.location.distance} km away</p>
                                        <p style={{ margin: '0', color: urgent ? '#ea580c' : '#6b7280', fontWeight: urgent ? 600 : 400 }}>
                                            ⏰ {getTimeRemaining(donation.expiryTime)}
                                        </p>
                                    </div>
                                    <div style={{ height: '1px', background: '#e5e7eb', margin: '10px 0' }} />
                                    {donation.status === 'available' ? (
                                        <div>
                                            <button onClick={() => handleClaim(donation._id)} disabled={claimingId === donation._id}
                                                style={{ width: '100%', padding: '8px', background: 'linear-gradient(135deg, #059669, #047857)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
                                                {claimingId === donation._id ? '⏳ Claiming...' : '✅ Claim Now'}
                                            </button>
                                            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                                                <button onClick={() => { setStreetViewDonation(donation); setIsExpanded(true); }}
                                                    style={{ flex: 1, textAlign: 'center', fontSize: '11px', fontWeight: 600, padding: '6px 8px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', color: '#1d4ed8', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                                    👁️ 360° View
                                                </button>
                                                <a href={getDirectionsUrl(coords[1], coords[0])} target="_blank" rel="noopener noreferrer"
                                                    style={{ flex: 1, textAlign: 'center', fontSize: '11px', fontWeight: 600, padding: '6px 8px', background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', color: '#059669', borderRadius: '6px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                                    🧭 Directions
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '12px', fontWeight: 600 }}>✓ Already Claimed</p>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

            {/* Recenter map on selected donation or street view target */}
            {(selectedDonation || streetViewDonation) && (
                <RecenterMap position={
                    selectedDonation
                        ? [selectedDonation.location.coordinates[1], selectedDonation.location.coordinates[0]]
                        : [streetViewDonation!.location.coordinates[1], streetViewDonation!.location.coordinates[0]]
                } />
            )}
        </MapContainer>
    );

    // ---- Layer Switcher Component ----
    const renderLayerSwitcher = () => (
        <div className="flex gap-1 bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-1.5 border border-white/50">
            {(Object.keys(tileLayers) as Array<keyof typeof tileLayers>).map((key) => {
                const layer = tileLayers[key];
                const IconComp = layer.icon;
                return (
                    <button key={key} onClick={() => setActiveLayer(key)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${activeLayer === key
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-200'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}>
                        <IconComp className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{layer.label}</span>
                    </button>
                );
            })}
        </div>
    );

    // ---- Legend Component ----
    const renderLegend = () => (
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-3 border border-white/50 text-xs">
            <p className="font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" /> Map Legend
            </p>
            <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-200 animate-pulse"></span>
                    <span className="text-gray-600">Urgent (&lt; 2 hrs)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200"></span>
                    <span className="text-gray-600">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-gray-400 ring-2 ring-gray-200"></span>
                    <span className="text-gray-600">Claimed</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-100">
            {/* ==================== FULLSCREEN EXPANDED MAP ==================== */}
            {isExpanded && (
                <div className="fixed inset-0 z-[9999] bg-gray-900 flex flex-col" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    {/* Expanded Header */}
                    <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                                <Map className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-sm">ResQMeals Explorer</h2>
                                <p className="text-gray-400 text-xs">
                                    {streetViewDonation ? `📍 ${streetViewDonation.title} — ${streetViewDonation.location.address}` : 'Interactive map with 360° Street View'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {renderLayerSwitcher()}
                            <button onClick={() => { setIsExpanded(false); setStreetViewDonation(null); }}
                                className="ml-2 w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-white flex items-center justify-center transition-all">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Expanded Content Area */}
                    <div className="flex-1 flex overflow-hidden">
                        {/* Map Panel */}
                        <div className={`relative ${streetViewDonation ? 'w-[45%]' : 'w-full'} transition-all duration-500`}>
                            {renderMap('100%')}

                            {/* Floating Legend */}
                            <div className="absolute bottom-4 left-4 z-[1000]">
                                {renderLegend()}
                            </div>

                            {/* Floating Donation Cards */}
                            <div className="absolute top-4 left-4 z-[1000] w-72 max-h-[calc(100%-100px)] overflow-y-auto space-y-2 pr-1" style={{ scrollbarWidth: 'thin' }}>
                                {sortedDonations.filter(d => d.status === 'available').map((donation) => (
                                    <div key={donation._id}
                                        onClick={() => setStreetViewDonation(donation)}
                                        className={`bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg border cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] ${streetViewDonation?._id === donation._id ? 'ring-2 ring-emerald-500 border-emerald-300' : 'border-white/50'
                                            }`}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-sm text-gray-900">{donation.title}</h4>
                                                <p className="text-xs text-gray-500 mt-0.5">{donation.donor.name}</p>
                                            </div>
                                            {isUrgent(donation.expiryTime) && (
                                                <span className="px-2 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold rounded-full">
                                                    URGENT
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500">
                                            <span className="flex items-center gap-1">📍 {donation.location.distance} km</span>
                                            <span className={`flex items-center gap-1 ${isUrgent(donation.expiryTime) ? 'text-red-600 font-semibold' : ''}`}>
                                                ⏰ {getTimeRemaining(donation.expiryTime)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Street View Panel */}
                        {streetViewDonation ? (
                            <div className="w-[55%] flex flex-col bg-gray-900 border-l border-white/10" style={{ animation: 'slideIn 0.4s ease-out' }}>
                                {/* Street View Header */}
                                <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-b border-white/10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                                            <Eye className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-xs">360° Street View</p>
                                            <p className="text-blue-300 text-[10px]">{streetViewDonation.location.address}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a href={getStreetViewUrl(streetViewDonation.location.coordinates[1], streetViewDonation.location.coordinates[0])}
                                            target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-1 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-[11px] font-medium transition-all">
                                            <ExternalLink className="w-3 h-3" /> Open Full
                                        </a>
                                        <a href={getDirectionsUrl(streetViewDonation.location.coordinates[1], streetViewDonation.location.coordinates[0])}
                                            target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg text-emerald-300 text-[11px] font-medium transition-all">
                                            <Navigation className="w-3 h-3" /> Navigate
                                        </a>
                                        <button onClick={() => setStreetViewDonation(null)}
                                            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-all">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Street View Iframe */}
                                <div className="flex-1 relative bg-black">
                                    <iframe
                                        key={streetViewDonation._id}
                                        src={getStreetViewIframeUrl(streetViewDonation.location.coordinates[1], streetViewDonation.location.coordinates[0])}
                                        style={{ width: '100%', height: '100%', border: 'none' }}
                                        allowFullScreen
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Google Street View 360°"
                                    />
                                    {/* Loading overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 pointer-events-none" style={{ animation: 'fadeOut 2s ease-out forwards' }}>
                                        <div className="text-center">
                                            <div className="w-10 h-10 border-3 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                            <p className="text-white text-sm font-medium">Loading 360° Street View...</p>
                                            <p className="text-gray-400 text-xs mt-1">Drag to look around • Scroll to zoom</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Street View Footer - Donation Details */}
                                <div className="px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 border-t border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-white font-bold text-sm">{streetViewDonation.title}</h4>
                                            <p className="text-gray-400 text-xs mt-0.5">
                                                🍽️ {streetViewDonation.servingsCount} servings • 📍 {streetViewDonation.location.distance} km •
                                                <span className={isUrgent(streetViewDonation.expiryTime) ? ' text-orange-400 font-semibold' : ''}>
                                                    {' '}⏰ {getTimeRemaining(streetViewDonation.expiryTime)}
                                                </span>
                                            </p>
                                        </div>
                                        {streetViewDonation.status === 'available' && (
                                            <button onClick={() => handleClaim(streetViewDonation._id)} disabled={claimingId === streetViewDonation._id}
                                                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-emerald-900/30 transition-all disabled:opacity-50">
                                                {claimingId === streetViewDonation._id ? '⏳ Claiming...' : '✅ Claim Now'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* No donation selected - show instruction panel */
                            <div className="hidden lg:flex w-[55%] flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 border-l border-white/10">
                                <div className="text-center px-8">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center mx-auto mb-6">
                                        <Eye className="w-10 h-10 text-blue-400" />
                                    </div>
                                    <h3 className="text-white text-xl font-bold mb-2">360° Street View</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                                        Click on any donation card on the left to see a <span className="text-blue-400 font-semibold">360° panoramic view</span> of the pickup location — just like Google Maps!
                                    </p>
                                    <div className="mt-6 flex flex-wrap gap-3 justify-center text-xs text-gray-500">
                                        <span className="px-3 py-1.5 bg-white/5 rounded-lg">🖱️ Drag to rotate</span>
                                        <span className="px-3 py-1.5 bg-white/5 rounded-lg">🔍 Scroll to zoom</span>
                                        <span className="px-3 py-1.5 bg-white/5 rounded-lg">🚶 Click arrows to walk</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ==================== NORMAL VIEW ==================== */}
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b shadow-sm">
                <div className="max-w-6xl mx-auto p-4">
                    {successMessage && (
                        <div className="mb-4 p-4 bg-emerald-100 text-emerald-700 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
                            <CheckCircle2 className="w-5 h-5" />
                            {successMessage}
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link to="/ngo/dashboard" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Available Donations</h1>
                                <p className="text-sm text-gray-500">{donations.filter(d => d.status === 'available').length} donations near you</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm"
                                onClick={() => setViewMode('list')}
                                className={viewMode === 'list' ? 'bg-emerald-600' : ''}>
                                <List className="w-4 h-4 mr-1" /> List
                            </Button>
                            <Button variant={viewMode === 'map' ? 'default' : 'outline'} size="sm"
                                onClick={() => setViewMode('map')}
                                className={viewMode === 'map' ? 'bg-emerald-600' : ''}>
                                <Map className="w-4 h-4 mr-1" /> Map
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-4">
                {viewMode === 'map' ? (
                    /* ============ MAP VIEW ============ */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Map Container */}
                        <div className="lg:col-span-2 rounded-2xl overflow-hidden border relative z-0 shadow-xl bg-white">
                            {/* Top Controls Bar */}
                            <div className="absolute top-3 left-3 right-3 z-[1000] flex justify-between items-start pointer-events-none">
                                <div className="pointer-events-auto">
                                    {renderLegend()}
                                </div>
                                <div className="flex items-center gap-2 pointer-events-auto">
                                    {renderLayerSwitcher()}
                                    <button onClick={() => {
                                        const firstAvailable = sortedDonations.find(d => d.status === 'available');
                                        if (firstAvailable) setStreetViewDonation(firstAvailable);
                                        setIsExpanded(true);
                                    }}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white backdrop-blur-md rounded-xl shadow-xl border border-blue-400/30 text-xs font-bold hover:from-blue-600 hover:to-indigo-700 transition-all">
                                        <Maximize2 className="w-3.5 h-3.5" /> 🏙️ Expand + Street View
                                    </button>
                                </div>
                            </div>

                            <div className="h-[550px]">
                                {renderMap('100%')}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-3 max-h-[550px] overflow-y-auto relative z-10" style={{ scrollbarWidth: 'thin' }}>
                            {/* Sticky Header */}
                            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 p-4 rounded-2xl shadow-lg z-10 text-white">
                                <p className="font-bold text-sm">📍 {sortedDonations.filter(d => d.status === 'available').length} donations nearby</p>
                                <p className="text-emerald-100 text-xs mt-0.5">Click a donation or expand for 360° view</p>
                            </div>

                            {sortedDonations
                                .filter(donation => donation.status === 'available')
                                .map((donation) => {
                                    const coords = donation.location.coordinates;
                                    return (
                                        <Card key={donation._id}
                                            className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${selectedDonation?._id === donation._id ? 'ring-2 ring-emerald-500 shadow-lg' : ''
                                                } ${donation.status === 'claimed' ? 'opacity-50' : ''}`}
                                            onClick={() => setSelectedDonation(donation)}>
                                            <CardContent className="p-3">
                                                <div className="flex gap-3">
                                                    {/* Thumbnail */}
                                                    <div className="w-16 h-16 rounded-md overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
                                                        <img
                                                            src={donation.imageUrl?.startsWith('http') ? donation.imageUrl : (donation.imageUrl ? `http://localhost:5001${donation.imageUrl}` : "https://placehold.co/600x400?text=Food")}
                                                            alt={donation.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = "https://placehold.co/600x400?text=Food";
                                                                target.onerror = null; // Prevent infinite loop
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{donation.title}</h4>
                                                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{donation.donor.name}</p>
                                                            </div>
                                                            {isUrgent(donation.expiryTime) && donation.status === 'available' && (
                                                                <span className="px-2 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                                                                    URGENT
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {donation.location.distance} km</span>
                                                            <span className={`flex items-center gap-1 ${isUrgent(donation.expiryTime) ? 'text-red-600 font-medium' : ''}`}>
                                                                <Clock className="w-3 h-3" /> {getTimeRemaining(donation.expiryTime)}
                                                            </span>
                                                        </div>
                                                        {/* Quick Action Buttons */}
                                                        <div className="flex gap-2 mt-3">
                                                            <button onClick={(e) => { e.stopPropagation(); setStreetViewDonation(donation); setIsExpanded(true); }}
                                                                className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold rounded-lg transition-all">
                                                                <Eye className="w-3 h-3" /> 360° View
                                                            </button>
                                                            <a href={getDirectionsUrl(coords[1], coords[0])} target="_blank" rel="noopener noreferrer"
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-semibold rounded-lg transition-all no-underline">
                                                                <Navigation className="w-3 h-3" /> Directions
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                        </div>
                    </div>
                ) : (
                    /* ============ LIST VIEW ============ */
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
                            </div>
                        ) : sortedDonations.length === 0 ? (
                            <Card className="bg-white">
                                <CardContent className="text-center py-12">
                                    <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-600 font-medium">No donations available nearby</p>
                                    <p className="text-sm text-gray-400 mt-2">Check back later or expand your search radius</p>
                                </CardContent>
                            </Card>
                        ) : (
                            sortedDonations.map((donation) => (
                                <Card key={donation._id}
                                    className={`bg-white transition-all hover:shadow-lg ${donation.status === 'claimed' ? 'opacity-60 bg-gray-50' : ''
                                        } ${isUrgent(donation.expiryTime) && donation.status === 'available' ? 'border-l-4 border-l-orange-500' : ''}`}>
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row h-full">
                                            {/* Image Section */}
                                            <div className="w-full md:w-48 h-48 md:h-auto relative shrink-0 bg-gray-100 flex items-center justify-center">
                                                <img
                                                    src={donation.imageUrl?.startsWith('http') ? donation.imageUrl : (donation.imageUrl ? `http://localhost:5001${donation.imageUrl}` : "https://placehold.co/600x400?text=Food")}
                                                    alt={donation.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = "https://placehold.co/600x400?text=Food";
                                                        target.onerror = null; // Prevent infinite loop
                                                    }}
                                                />
                                                <div className="absolute top-2 left-2 block md:hidden">
                                                    {isUrgent(donation.expiryTime) && donation.status === 'available' && (
                                                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" /> Urgent
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Content Section */}
                                            <div className="flex-1 p-5 flex flex-col justify-between">
                                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <h3 className="font-semibold text-lg text-gray-900">{donation.title}</h3>
                                                                    <span className="hidden md:flex gap-2">
                                                                        {isUrgent(donation.expiryTime) && donation.status === 'available' && (
                                                                            <span className={`px-2 py-0.5 ${donation.emergencyMode ? 'bg-red-600 text-white' : 'bg-orange-100 text-orange-700'} text-xs font-bold rounded-full flex items-center gap-1`}>
                                                                                <AlertCircle className="w-3 h-3" /> {donation.emergencyMode ? 'Emergency Mode' : 'Urgent'}
                                                                            </span>
                                                                        )}
                                                                        {donation.riskScore !== undefined && (
                                                                            <span className={`px-2 py-0.5 ${donation.riskScore > 75 ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700'} text-[10px] font-bold rounded-full flex items-center gap-1`}>
                                                                                Safety Risk: {donation.riskScore}%
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                    {donation.status === 'claimed' && (
                                                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                                                                            <CheckCircle2 className="w-3 h-3" /> Claimed
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-gray-600 text-sm mt-1">{donation.description}</p>
                                                                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                                                                    <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                                                                        <Users className="w-4 h-4" /> {donation.servingsCount} servings
                                                                    </span>
                                                                    <span className="flex items-center gap-1 text-gray-600">
                                                                        <MapPin className="w-4 h-4" /> {donation.location.address} ({donation.location.distance} km)
                                                                    </span>
                                                                    <span className={`flex items-center gap-1 ${isUrgent(donation.expiryTime) ? 'text-orange-600 font-medium' : 'text-gray-600'}`}>
                                                                        <Clock className="w-4 h-4" /> {getTimeRemaining(donation.expiryTime)}
                                                                    </span>
                                                                </div>
                                                                <div className="mt-3 text-sm text-gray-500">
                                                                    <span className="font-medium">From:</span> {donation.donor?.name || 'Unknown Donor'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2 md:items-end">
                                                        {donation.status === 'available' ? (
                                                            <Button onClick={() => handleClaim(donation._id)} disabled={claimingId === donation._id}
                                                                className="bg-emerald-600 hover:bg-emerald-700 min-w-[120px]">
                                                                {claimingId === donation._id ? (
                                                                    <span className="flex items-center gap-2">
                                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                                        Claiming...
                                                                    </span>
                                                                ) : 'Claim Now'}
                                                            </Button>
                                                        ) : (
                                                            <Button disabled variant="outline" className="min-w-[120px]">Claimed</Button>
                                                        )}
                                                        {donation.pickupWindow?.end && (
                                                            <p className="text-xs text-gray-400">
                                                                Pickup: {new Date(donation.pickupWindow.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    0% { opacity: 1; }
                    70% { opacity: 1; }
                    100% { opacity: 0; visibility: hidden; }
                }
            `}</style>
        </div>
    );
}
