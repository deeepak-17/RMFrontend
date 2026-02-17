import { io, Socket } from 'socket.io-client';

// @ts-ignore - Vite env
const SOCKET_URL = import.meta.env?.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';

class SocketService {
    private socket: Socket | null = null;

    connect(token: string) {
        if (this.socket?.connected) return;

        this.socket = io(SOCKET_URL, {
            auth: { token },
            autoConnect: true
        });

        console.log('🔌 Socket connecting to:', SOCKET_URL);

        this.socket.on('connect', () => {
            console.log('✅ Socket connected:', this.socket?.id);
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            console.log('Socket manually disconnected');
        }
    }

    on(event: string, callback: (...args: any[]) => void) {
        this.socket?.on(event, callback);
    }

    off(event: string, callback?: (...args: any[]) => void) {
        this.socket?.off(event, callback);
    }

    emit(event: string, data?: any) {
        this.socket?.emit(event, data);
    }

    getSocket() {
        return this.socket;
    }

    isConnected() {
        return this.socket?.connected || false;
    }
}

export const socketService = new SocketService();
