import axios from 'axios';

const api = axios.create({
    baseURL: (import.meta as any).env.VITE_API_URL || 'http://localhost:5001/api',
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
    register: (data: { name: string; email: string; password: string; role: string; organizationType?: string } | FormData) =>
        api.post('/auth/register', data),
    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data: { name?: string; phone?: string }) =>
        api.put('/auth/profile', data),
    uploadAvatar: (formData: FormData) =>
        api.post('/auth/upload-avatar', formData),
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
        api.put('/auth/change-password', data),
};

// Donations API
export const donationsApi = {
    create: (data: FormData) => api.post('/donations', data),
    getMyDonations: () => api.get('/donations/my'),
    getNearby: (lat: number, lng: number, radius?: number) =>
        api.get(`/ngo/donations/nearby?lat=${lat}&lng=${lng}&radiusKm=${radius || 500}`),
    getById: (id: string) => api.get(`/donations/${id}`),
    update: (id: string, data: any) => api.put(`/donations/${id}`, data),
    delete: (id: string) => api.delete(`/donations/${id}`),
    accept: (id: string) => api.post(`/ngo/accept/${id}`),
    confirmPickup: (id: string) => api.post(`/ngo/confirm/${id}`),
    getNgoHistory: () => api.get('/ngo/history'),
    getNgoTasks: () => api.get('/ngo/tasks'),
    submitTaskFeedback: (taskId: string, rating: number, feedback: string) =>
        api.post(`/ngo/tasks/${taskId}/feedback`, { rating, feedback }),
};

// Tasks API (Volunteer)
export const tasksApi = {
    getMyTasks: () => api.get('/tasks/my'),
    accept: (id: string) => api.put(`/tasks/${id}/accept`),
    decline: (id: string) => api.put(`/tasks/${id}/decline`),
    updateStatus: (id: string, status: 'picked' | 'delivered', feedback?: string, rating?: number) =>
        api.put(`/tasks/${id}/status`, { status, feedback, rating }),
};

// Volunteer Profile API
export const volunteerApi = {
    toggleAvailability: (isAvailable: boolean) => api.put('/tasks/availability', { isAvailable }),
    updateLocation: (lat: number, lng: number, address?: string) =>
        api.put('/tasks/location', { lat, lng, address }),
};

// Admin API
export const adminApi = {
    getUsers: () => api.get('/admin/users'),
    verifyUser: (id: string) => api.put(`/admin/users/${id}/verify`),
    blockUser: (id: string) => api.put(`/admin/users/${id}/block`),
    getLogs: () => api.get('/admin/logs'),
    getDonations: (status?: string) => api.get(`/admin/donations${status && status !== 'all' ? `?status=${status}` : ''}`),
    getPredictions: () => api.get('/matching/predictions'),
};

// Matching & Predictions API
export const matchingApi = {
    getPredictions: () => api.get('/matching/predictions'),
    getMatchingStatus: (donationId: string) => api.get(`/matching/status/${donationId}`),
};
