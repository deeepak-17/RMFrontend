
import { motion } from "framer-motion";

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

export const PageTransition = ({ children, className }: PageTransitionProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for premium feel
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const StaggerContainer = ({ children, className, delay = 0.1 }: { children: React.ReactNode, className?: string, delay?: number }) => {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={{
                animate: {
                    transition: {
                        staggerChildren: delay
                    }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const StaggerItem = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <motion.div
            variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};
