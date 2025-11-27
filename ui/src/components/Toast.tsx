import { useEffect, useState } from 'react';

interface ToastProps {
    message?: string;
    duration?: number;
}

export function Toast({ message = 'Success!', duration = 5000 }: ToastProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), duration);
        return () => clearTimeout(timer);
    }, [duration]);

    if (!visible) return null;

    return (
        <div
            className="fixed bottom-10 left-10 z-50 px-6 py-3 bg-green-500 text-white rounded shadow-lg font-medium animate-toast-in"
            style={{ minWidth: '180px' }}
        >
            {message}
            <style>{`
                @keyframes toast-in {
                    0% { transform: translateX(-100%); opacity: 0; }
                    20% { opacity: 1; transform: translateX(0); }
                    80% { opacity: 1; transform: translateX(0); }
                    100% { transform: translateX(-100%); opacity: 0; }
                }
                .animate-toast-in {
                    animation: toast-in ${duration}ms forwards;
                }
            `}</style>
        </div>
    );
}
