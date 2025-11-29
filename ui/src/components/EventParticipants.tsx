import { useEffect, useState } from 'react';
import { InviteOut } from '../types/invite';
import { fetchInvites } from '../services/inviteService';

interface EventParticipantsProps {
    eventId: string | undefined;
}

export function EventParticipants({ eventId }: EventParticipantsProps) {
    // Component state
    const [participants, setParticipants] = useState<InviteOut[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Fetch accepted invite details
    const fetchData = async () => {
        try {
            if (!eventId) {
                setError('No event ID provided.');
                return;
            }
            const data = await fetchInvites('accepted', parseInt(eventId));
            setParticipants(data);
        } catch (err) {
            setError('Failed to load participants');
        }
    };

    // Run the fetchData function on component mount
    useEffect(() => {
        fetchData();
    }, []);

    // Render alternative content based on state
    if (error) return <div className="text-red-500">{error}</div>;
    if (participants.length === 0)
        return <div>No accepted participants found.</div>;

    return (
        <div className="w-4/5 mb-6">
            <h3 className="text-2xl font-bold mb-2">Participants</h3>
            <table className="w-full bg-white rounded-lg shadow-sm">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="py-2 px-4">Name</th>
                        <th className="py-2 px-4">Role</th>
                    </tr>
                </thead>
                <tbody>
                    {participants.map((invite) => (
                        <tr
                            key={invite.id}
                            className="border-b last:border-b-0 border-gray-200"
                        >
                            <td className="py-2 px-4">{invite.user_name}</td>
                            <td className="py-2 px-4">{invite.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
