import * as React from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

export interface ToastProps {
    id: string;
    message: string;
    variant?: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    onClose: (id: string) => void;
}

export const Toast = ({ id, message, variant = 'info', onClose }: ToastProps) => {
    const icons = {
        success: <CheckCircle className="h-5 w-5" />,
        error: <AlertCircle className="h-5 w-5" />,
        info: <Info className="h-5 w-5" />,
        warning: <AlertTriangle className="h-5 w-5" />,
    }

    const variants = {
        success: "bg-success text-success-foreground",
        error: "bg-destructive text-destructive-foreground",
        info: "bg-info text-info-foreground",
        warning: "bg-warning text-warning-foreground",
    }

    return (
        <div className={`flex items-center gap-3 min-w-[300px] rounded-md px-4 py-3 shadow-lg animate-slide-in-right ${variants[variant]}`}>
            {icons[variant]}
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={() => onClose(id)}
                className="text-current hover:opacity-80 transition-opacity"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}

interface ToastContainerProps {
    toasts: ToastProps[];
    onClose: (id: string) => void;
}

export const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} onClose={onClose} />
            ))}
        </div>
    )
}

// Hook to manage toasts
export const useToast = () => {
    const [toasts, setToasts] = React.useState<ToastProps[]>([]);

    const addToast = React.useCallback((message: string, variant: ToastProps['variant'] = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substring(7);
        const newToast: ToastProps = { id, message, variant, duration, onClose: removeToast };

        setToasts((prev) => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = React.useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return {
        toasts,
        addToast,
        removeToast,
    };
}
