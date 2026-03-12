
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import DonorDashboard from '../pages/donor/DonorDashboard';
import { donationsApi } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { socketService } from '../lib/socket';
import { BrowserRouter } from 'react-router-dom';

// Mock the dependencies
vi.mock('../lib/api', () => ({
    donationsApi: {
        getMyDonations: vi.fn(),
    },
}));

vi.mock('../hooks/useAuth', () => ({
    useAuth: vi.fn(),
}));

vi.mock('../lib/socket', () => ({
    socketService: {
        on: vi.fn(),
        off: vi.fn(),
    },
}));

// Helper to render with Router
const renderWithRouter = (ui: React.ReactElement) => {
    return render(ui, { wrapper: BrowserRouter });
};

describe('DonorDashboard Integration', () => {
    const mockUser = { name: 'Test Donor', email: 'donor@test.com' };
    const mockDonations = [
        { _id: '1', title: 'Pasta', quantity: '5', unit: 'plates', status: 'available', location: { address: '123 Street' } },
        { _id: '2', title: 'Salad', quantity: '10', unit: 'bowls', status: 'collected', location: { address: '456 Road' } },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({ user: mockUser });
        (donationsApi.getMyDonations as any).mockResolvedValue({ data: { data: mockDonations } });
    });

    it('renders welcome message and stats correctly', async () => {
        renderWithRouter(<DonorDashboard />);

        expect(screen.getByText(/Welcome, Test!/i)).toBeDefined();

        await waitFor(() => {
            // Impact Stats: Meals = 10 (from collected donation), CO2 = 25 (10 * 2.5), Credits = 10 (1 collected * 10)
            const tenElements = screen.getAllByText('10');
            expect(tenElements.length).toBeGreaterThanOrEqual(2); // One for Meals, one for Credits
            expect(screen.getByText('25 kg')).toBeDefined(); // CO2
        });
    });

    it('renders recent donations list', async () => {
        renderWithRouter(<DonorDashboard />);

        await waitFor(() => {
            expect(screen.getByText('Pasta')).toBeDefined();
            expect(screen.getByText('Salad')).toBeDefined();
            expect(screen.getByText('5 plates')).toBeDefined();
            expect(screen.getByText('123 Street')).toBeDefined();
        });
    });

    it('displays empty state when no donations are found', async () => {
        (donationsApi.getMyDonations as any).mockResolvedValue({ data: { data: [] } });

        renderWithRouter(<DonorDashboard />);

        await waitFor(() => {
            expect(screen.getByText(/No donations yet/i)).toBeDefined();
        });
    });

    it('sets up and tears down socket listeners', () => {
        const { unmount } = renderWithRouter(<DonorDashboard />);

        expect(socketService.on).toHaveBeenCalledWith('donation:reserved', expect.any(Function));
        expect(socketService.on).toHaveBeenCalledWith('donation:collected', expect.any(Function));

        unmount();

        expect(socketService.off).toHaveBeenCalledWith('donation:reserved', expect.any(Function));
        expect(socketService.off).toHaveBeenCalledWith('donation:collected', expect.any(Function));
    });
});
