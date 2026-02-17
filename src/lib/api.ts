import axios from 'axios';

const api = axios.create({
    baseURL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

// Auth API
export const authApi = {
    register: (data: { name: string; email: string; password: string; role: string; organizationType?: string }) =>
        api.post('/auth/register', data),
    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
};

// Donations API
export const donationsApi = {
    create: (data: FormData) => api.post('/donations', data),
    getMyDonations: () => api.get('/donations/my'),
    getNearby: (lat: number, lng: number, radius?: number) =>
        api.get(`/ngo/donations/nearby?lat=${lat}&lng=${lng}&radius=${radius || 10}`),
    getById: (id: string) => api.get(`/donations/${id}`),
    update: (id: string, data: any) => api.put(`/donations/${id}`, data),
    delete: (id: string) => api.delete(`/donations/${id}`),
    accept: (id: string) => api.post(`/ngo/accept/${id}`),
    confirmPickup: (id: string) => api.post(`/ngo/confirm/${id}`),
};

// Tasks API (Volunteer)
export const tasksApi = {
    getMyTasks: () => api.get('/tasks/my'),
    accept: (id: string) => api.put(`/tasks/${id}/accept`),
    updateStatus: (id: string, status: 'picked' | 'delivered') =>
        api.put(`/tasks/${id}/status`, { status }),
};

// Admin API
export const adminApi = {
    getUsers: () => api.get('/admin/users'),
    verifyUser: (id: string) => api.put(`/admin/users/${id}/verify`),
    blockUser: (id: string) => api.put(`/admin/users/${id}/block`),
    getLogs: () => api.get('/admin/logs'),
};
