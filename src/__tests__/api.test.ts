import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Mock axios.create to return a mock instance
vi.mock('axios', () => {
    const mockAxios = {
        create: vi.fn(),
        interceptors: {
            request: { use: vi.fn() },
            response: { use: vi.fn() },
        },
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    };
    // create returns the same mock
    mockAxios.create.mockReturnValue(mockAxios);
    return { default: mockAxios };
});

describe('API Module', () => {
    let api: any;
    let authApi: any;
    let donationsApi: any;
    let tasksApi: any;
    let adminApi: any;

    beforeEach(async () => {
        vi.resetModules();
        const module = await import('../lib/api');
        api = module.default;
        authApi = module.authApi;
        donationsApi = module.donationsApi;
        tasksApi = module.tasksApi;
        adminApi = module.adminApi;
    });

    describe('API instance creation', () => {
        it('should export a default api instance', () => {
            expect(api).toBeDefined();
        });

        it('should export authApi', () => {
            expect(authApi).toBeDefined();
        });

        it('should export donationsApi', () => {
            expect(donationsApi).toBeDefined();
        });

        it('should export tasksApi', () => {
            expect(tasksApi).toBeDefined();
        });

        it('should export adminApi', () => {
            expect(adminApi).toBeDefined();
        });
    });

    describe('authApi methods', () => {
        it('should have register method', () => {
            expect(typeof authApi.register).toBe('function');
        });

        it('should have login method', () => {
            expect(typeof authApi.login).toBe('function');
        });

        it('should have getMe method', () => {
            expect(typeof authApi.getMe).toBe('function');
        });

        it('should call post with correct URL for register', () => {
            const data = { name: 'Test', email: 'test@test.com', password: '123456', role: 'donor' };
            authApi.register(data);
            expect(api.post).toHaveBeenCalledWith('/auth/register', data);
        });

        it('should call post with correct URL for login', () => {
            const data = { email: 'test@test.com', password: '123456' };
            authApi.login(data);
            expect(api.post).toHaveBeenCalledWith('/auth/login', data);
        });

        it('should call get for getMe', () => {
            authApi.getMe();
            expect(api.get).toHaveBeenCalledWith('/auth/me');
        });
    });

    describe('donationsApi methods', () => {
        it('should have all CRUD methods', () => {
            expect(typeof donationsApi.create).toBe('function');
            expect(typeof donationsApi.getMyDonations).toBe('function');
            expect(typeof donationsApi.getNearby).toBe('function');
            expect(typeof donationsApi.getById).toBe('function');
            expect(typeof donationsApi.update).toBe('function');
            expect(typeof donationsApi.delete).toBe('function');
            expect(typeof donationsApi.accept).toBe('function');
            expect(typeof donationsApi.confirmPickup).toBe('function');
        });

        it('should call post for create', () => {
            const formData = new FormData();
            donationsApi.create(formData);
            expect(api.post).toHaveBeenCalledWith('/donations', formData);
        });

        it('should call get for getMyDonations', () => {
            donationsApi.getMyDonations();
            expect(api.get).toHaveBeenCalledWith('/donations/my');
        });

        it('should call get with coords for getNearby', () => {
            donationsApi.getNearby(13.0, 80.2, 5);
            expect(api.get).toHaveBeenCalledWith('/ngo/donations/nearby?lat=13&lng=80.2&radius=5');
        });

        it('should default radius to 10 for getNearby', () => {
            donationsApi.getNearby(13.0, 80.2);
            expect(api.get).toHaveBeenCalledWith('/ngo/donations/nearby?lat=13&lng=80.2&radius=10');
        });

        it('should call get with id for getById', () => {
            donationsApi.getById('abc123');
            expect(api.get).toHaveBeenCalledWith('/donations/abc123');
        });

        it('should call put with id for update', () => {
            donationsApi.update('abc123', { quantity: 10 });
            expect(api.put).toHaveBeenCalledWith('/donations/abc123', { quantity: 10 });
        });

        it('should call delete with id', () => {
            donationsApi.delete('abc123');
            expect(api.delete).toHaveBeenCalledWith('/donations/abc123');
        });

        it('should call post for accept', () => {
            donationsApi.accept('abc123');
            expect(api.post).toHaveBeenCalledWith('/ngo/accept/abc123');
        });

        it('should call post for confirmPickup', () => {
            donationsApi.confirmPickup('abc123');
            expect(api.post).toHaveBeenCalledWith('/ngo/confirm/abc123');
        });

        it('should call get for getNgoHistory', () => {
            donationsApi.getNgoHistory();
            expect(api.get).toHaveBeenCalledWith('/ngo/history');
        });
    });

    describe('tasksApi methods', () => {
        it('should have all task methods', () => {
            expect(typeof tasksApi.getMyTasks).toBe('function');
            expect(typeof tasksApi.accept).toBe('function');
            expect(typeof tasksApi.updateStatus).toBe('function');
        });

        it('should call get for getMyTasks', () => {
            tasksApi.getMyTasks();
            expect(api.get).toHaveBeenCalledWith('/tasks/my');
        });

        it('should call put for accept', () => {
            tasksApi.accept('task123');
            expect(api.put).toHaveBeenCalledWith('/tasks/task123/accept');
        });

        it('should call put with status for updateStatus', () => {
            tasksApi.updateStatus('task123', 'picked');
            expect(api.put).toHaveBeenCalledWith('/tasks/task123/status', { status: 'picked' });
        });

        it('should call put with delivered status', () => {
            tasksApi.updateStatus('task123', 'delivered');
            expect(api.put).toHaveBeenCalledWith('/tasks/task123/status', { status: 'delivered' });
        });
    });

    describe('adminApi methods', () => {
        it('should have all admin methods', () => {
            expect(typeof adminApi.getUsers).toBe('function');
            expect(typeof adminApi.verifyUser).toBe('function');
            expect(typeof adminApi.blockUser).toBe('function');
            expect(typeof adminApi.getLogs).toBe('function');
        });

        it('should call get for getUsers', () => {
            adminApi.getUsers();
            expect(api.get).toHaveBeenCalledWith('/admin/users');
        });

        it('should call put for verifyUser', () => {
            adminApi.verifyUser('user123');
            expect(api.put).toHaveBeenCalledWith('/admin/users/user123/verify');
        });

        it('should call put for blockUser', () => {
            adminApi.blockUser('user123');
            expect(api.put).toHaveBeenCalledWith('/admin/users/user123/block');
        });

        it('should call get for getLogs', () => {
            adminApi.getLogs();
            expect(api.get).toHaveBeenCalledWith('/admin/logs');
        });

        it('should call get for getDonations without status filter', () => {
            adminApi.getDonations();
            expect(api.get).toHaveBeenCalledWith('/admin/donations');
        });

        it('should call get for getDonations with status filter', () => {
            adminApi.getDonations('available');
            expect(api.get).toHaveBeenCalledWith('/admin/donations?status=available');
        });

        it('should call get for getDonations with "all" status (no filter)', () => {
            adminApi.getDonations('all');
            expect(api.get).toHaveBeenCalledWith('/admin/donations');
        });
    });
});
