interface ConfirmDeleteProps {
    open: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDelete({
    open,
    title = 'Are you sure?',
    message = '',
    confirmText = 'Delete',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
}: ConfirmDeleteProps) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 min-w-[300px] flex flex-col items-center">
                <h2 className="text-xl font-bold mb-2 text-center">{title}</h2>
                {message && (
                    <p className="mb-4 text-center text-gray-700">{message}</p>
                )}
                <div className="flex gap-4 mt-2">
                    <button
                        className="px-4 py-2 rounded bg-gray-200 font-medium hover:bg-gray-300"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-red-600 text-white font-medium hover:bg-red-400"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
