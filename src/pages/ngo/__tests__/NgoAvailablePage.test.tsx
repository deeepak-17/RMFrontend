
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NgoAvailablePage from '../NgoAvailablePage';
import { donationsApi } from '@/lib/api';
import { MemoryRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('@/lib/api', () => ({
    donationsApi: {
        getNearby: vi.fn(),
        accept: vi.fn(),
    }
}));

// Mock Leaflet components to avoid rendering issues in JSDOM
vi.mock('react-leaflet', () => ({
    MapContainer: ({ children }: any) => <div data-testid="map-container">{children}</div>,
    TileLayer: () => <div data-testid="tile-layer" />,
    Marker: ({ children }: any) => <div data-testid="marker">{children}</div>,
    Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
}));

// Mock Leaflet L.icon and L.divIcon
vi.mock('leaflet', () => {
    return {
        default: {
            divIcon: vi.fn(),
            Icon: vi.fn(),
        },
        Icon: vi.fn(),
    };
});

describe('NgoAvailablePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock geolocation
        const mockGeolocation = {
            getCurrentPosition: vi.fn()
                .mockImplementationOnce((success) => success({
                    coords: {
                        latitude: 10,
                        longitude: 10
                    }
                }))
        };
        (global as any).navigator.geolocation = mockGeolocation;
    });

    it('renders loading state initially', async () => {
        // Return a promise that never resolves to keep loading state active
        (donationsApi.getNearby as any).mockReturnValue(new Promise(() => { }));

        render(
            <MemoryRouter>
                <NgoAvailablePage />
            </MemoryRouter>
        );
        expect(screen.getByText(/Finding active donations/i)).toBeInTheDocument();
    });

    it('renders donations after fetching', async () => {
        const mockDonations = [
            {
                _id: '1',
                title: 'Test Donation',
                quantity: '5kg',
                user: { name: 'Donor 1' },
                location: { coordinates: [0, 0], address: 'Test Address', distance: 5 },
                status: 'available',
                expiryTime: new Date(Date.now() + 10000).toISOString(),
                donorId: { name: 'Donor Name' } // Adjusted based on likely population
            }
        ];

        (donationsApi.getNearby as any).mockResolvedValue({
            data: { donations: mockDonations, count: 1 }
        });

        render(
            <MemoryRouter>
                <NgoAvailablePage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Test Donation')).toBeInTheDocument();
            // The address might be in the card
            expect(screen.getByText('Test Address')).toBeInTheDocument();
        });
    });

    it('handles accept donation action', async () => {
        const mockDonations = [
            {
                _id: '1',
                title: 'Test Donation',
                quantity: '5kg',
                location: { coordinates: [0, 0], address: 'Test Address', distance: 5 },
                status: 'available',
                expiryTime: new Date(Date.now() + 10000).toISOString(),
                donorId: { name: 'Donor Name' }
            }
        ];

        (donationsApi.getNearby as any).mockResolvedValue({
            data: { donations: mockDonations, count: 1 }
        });

        (donationsApi.accept as any).mockResolvedValue({});

        render(
            <MemoryRouter>
                <NgoAvailablePage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('✅ Claim Now')).toBeInTheDocument();
        });

        const claimButtons = screen.getAllByText('✅ Claim Now');
        fireEvent.click(claimButtons[0]);

        await waitFor(() => {
            // Expect confirm dialog or direct call depending on implementation
            // Assuming direct call or confirm via window.confirm (need to mock window.confirm if used)
            // Check if API was called
            expect(donationsApi.accept).toHaveBeenCalledWith('1');
        });
    });
});
