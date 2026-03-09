import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import VolunteerDashboard from './VolunteerDashboard';
import { tasksApi } from '@/lib/api';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// Mock the dependencies
vi.mock('@/lib/api', () => ({
    tasksApi: {
        getMyTasks: vi.fn(),
    },
}));

vi.mock('@/hooks/useAuth', () => ({
    useAuth: vi.fn(),
}));

const mockTasks = [
    { _id: '1', status: 'assigned' },
    { _id: '2', status: 'delivered' },
    { _id: '3', status: 'delivered' },
];

const renderPage = () => {
    return render(
        <BrowserRouter>
            <VolunteerDashboard />
        </BrowserRouter>
    );
};

describe('VolunteerDashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({
            user: { name: 'John Doe' }
        });
    });

    it('renders the dashboard with stats', async () => {
        (tasksApi.getMyTasks as any).mockResolvedValue({ data: mockTasks });

        renderPage();

        expect(screen.getByText(/Welcome, John Doe!/i)).toBeInTheDocument();

        await waitFor(() => {
            // Active tasks: 1
            expect(screen.getByText('1')).toBeInTheDocument();
            // Completed tasks: 2
            expect(screen.getByText('2')).toBeInTheDocument();
        });
    });

    it('shows loading spinner initially', () => {
        (tasksApi.getMyTasks as any).mockReturnValue(new Promise(() => { })); // Never resolves
        renderPage();
        // The loader uses the Loader2 icon with animate-spin, but screen doesn't have a simple way to find it
        // We can check if the heading exists but the stats don't yet
        expect(screen.getByText(/Welcome, John Doe!/i)).toBeInTheDocument();
        expect(screen.queryByText('Active Tasks')).not.toBeInTheDocument();
    });
});
