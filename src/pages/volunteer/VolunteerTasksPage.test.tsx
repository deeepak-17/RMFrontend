import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import VolunteerTasksPage from './VolunteerTasksPage';
import { tasksApi } from '@/lib/api';
import { BrowserRouter } from 'react-router-dom';

// Mock the API
vi.mock('@/lib/api', () => ({
    tasksApi: {
        getMyTasks: vi.fn(),
        accept: vi.fn(),
        updateStatus: vi.fn(),
        decline: vi.fn(),
    },
}));

const mockTasks = [
    {
        _id: '1',
        status: 'assigned',
        donationId: {
            title: 'Fresh Bread',
            location: { address: 'Bakery Street 5' },
            quantity: '10 loaves',
            expiryTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        },
        ngoId: {
            name: 'Helping Hands',
            address: 'Main NGO Hub',
        },
    },
    {
        _id: '2',
        status: 'accepted',
        donationId: {
            title: 'Vegetable Stew',
            location: { address: 'Community Kitchen' },
            quantity: '5 kg',
            expiryTime: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
        },
        ngoId: {
            name: 'Food For All',
            address: 'Ngo Center',
        },
    },
];

const renderPage = () => {
    return render(
        <BrowserRouter>
            <VolunteerTasksPage />
        </BrowserRouter>
    );
};

describe('VolunteerTasksPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the page and shows loading state initially', async () => {
        (tasksApi.getMyTasks as any).mockResolvedValue({ data: [] });
        renderPage();
        expect(screen.getByText(/My Tasks/i)).toBeInTheDocument();
        expect(screen.getByText(/Loading tasks.../i)).toBeInTheDocument();
    });

    it('renders tasks when fetched successfully', async () => {
        (tasksApi.getMyTasks as any).mockResolvedValue({ data: mockTasks });
        renderPage();

        await waitFor(() => {
            expect(screen.getByText('Fresh Bread')).toBeInTheDocument();
            expect(screen.getByText('Vegetable Stew')).toBeInTheDocument();
        });

        // Check for Priority badge on first task
        expect(screen.getByText('HIGH PRIORITY')).toBeInTheDocument();

        // Check for status badges
        expect(screen.getByText('ASSIGNED')).toBeInTheDocument();
        expect(screen.getByText('ACCEPTED')).toBeInTheDocument();
    });

    it('handles task acceptance', async () => {
        (tasksApi.getMyTasks as any).mockResolvedValue({ data: mockTasks });
        (tasksApi.accept as any).mockResolvedValue({});

        renderPage();

        const acceptButton = await screen.findByRole('button', { name: /Accept Task/i });
        fireEvent.click(acceptButton);

        expect(tasksApi.accept).toHaveBeenCalledWith('1');
        await waitFor(() => {
            expect(tasksApi.getMyTasks).toHaveBeenCalledTimes(2); // Initial + after accept
        });
    });

    it('handles marking as picked', async () => {
        (tasksApi.getMyTasks as any).mockResolvedValue({ data: mockTasks });
        (tasksApi.updateStatus as any).mockResolvedValue({});

        renderPage();

        const pickedButton = await screen.findByRole('button', { name: /Mark as Picked/i });
        fireEvent.click(pickedButton);

        expect(tasksApi.updateStatus).toHaveBeenCalledWith('2', 'picked');
    });

    it('shows empty state when no tasks are returned', async () => {
        (tasksApi.getMyTasks as any).mockResolvedValue({ data: [] });
        renderPage();

        await waitFor(() => {
            expect(screen.getByText(/No tasks assigned yet/i)).toBeInTheDocument();
        });
    });
});
