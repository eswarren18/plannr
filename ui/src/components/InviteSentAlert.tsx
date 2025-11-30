import { useEffect, useState } from 'react';

interface InviteSentAlertProps {
    message?: string;
    duration?: number;
}

export function InviteSentAlert({
    message = 'Success!',
    duration = 5000,
}: InviteSentAlertProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), duration);
        return () => clearTimeout(timer);
    }, [duration]);

    if (!visible) return null;

    return (
        <div
            className={`fixed bottom-10 left-10 z-50 min-w-[200px] flex items-center gap-3 p-4 rounded-lg border border-green-300 bg-green-50 text-green-700 shadow-md animate-alert-in`}
            role="alert"
        >
            <svg
                className="w-6 h-6 text-green-500 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <span className="font-semibold">Success:</span>
            <span>{message}</span>
            <style>{`
                @keyframes alert-in {
                    0% { transform: translateX(-100%); opacity: 0; }
                    20% { opacity: 1; transform: translateX(0); }
                    80% { opacity: 1; transform: translateX(0); }
                    100% { transform: translateX(-100%); opacity: 0; }
                }
                .animate-alert-in {
                    animation: alert-in ${duration}ms forwards;
                }
            `}</style>
        </div>
    );
}
