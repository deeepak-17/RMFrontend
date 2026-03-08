import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api';
import { socketService } from '@/lib/socket';
import type { User } from '@/types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, role: string, organizationType?: string, verificationFile?: File | null, documentType?: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const savedToken = localStorage.getItem('token');
            if (savedToken) {
                try {
                    const response = await authApi.getMe();
                    setUser(response.data.data);
                    setToken(savedToken);
                    // Connect Socket.io after successful auth
                    socketService.connect(savedToken);
                } catch {
                    localStorage.removeItem('token');
                    setToken(null);
                    socketService.disconnect();
                }
            }
            setIsLoading(false);
        };
        initAuth();

        // Cleanup: disconnect socket on unmount
        return () => socketService.disconnect();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authApi.login({ email, password });
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
        // Connect Socket.io on login
        socketService.connect(token);
    };

    const register = async (name: string, email: string, password: string, role: string, organizationType?: string, verificationFile?: File | null, documentType?: string) => {
        setIsLoading(true);
        // setError(null); // Removed: setError not defined in context
        try {
            let response;

            // If file is present, use FormData
            if (verificationFile) {
                const formData = new FormData();
                formData.append('name', name);
                formData.append('email', email);
                formData.append('password', password);
                formData.append('role', role);
                if (organizationType) formData.append('organizationType', organizationType);
                if (documentType) formData.append('documentType', documentType);
                formData.append('verificationDocument', verificationFile);

                response = await authApi.register(formData);
            } else {
                // Otherwise use JSON
                response = await authApi.register({ name, email, password, role, organizationType });
            }

            // NOTE: We don't auto-login here anymore based on RegisterPage logic
            // but if we did, we'd handle token here.
            return response.data;
        } catch (error: any) {
            // setError(error.response?.data?.message || 'Registration failed'); // Removed
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        // Disconnect Socket.io on logout
        socketService.disconnect();
    };

    const refreshUser = async () => {
        try {
            const response = await authApi.getMe();
            setUser(response.data.data);
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
