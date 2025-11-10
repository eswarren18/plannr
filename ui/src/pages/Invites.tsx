import { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { AuthContext } from '../providers/AuthProvider';
import { fetchInvites, respondToInvite } from '../services/inviteService';
import { InviteOut } from '../types/invite';

export default function Invites() {
    // Redirect to home if not logged in
    const auth = useContext(AuthContext);
    if (!auth?.user) {
        return <Navigate to="/" />;
    }

    // State for events and loading status
    const navigate = useNavigate();
    const [invites, setInvites] = useState<InviteOut[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch the user's invites
    const fetchData = async () => {
        try {
            const data = await fetchInvites();
            setInvites(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleResponse = async (
        inviteId: number,
        response: 'accepted' | 'declined'
    ) => {
        const invite = invites.find((i) => i.id === inviteId);
        if (!invite) return;
        try {
            await respondToInvite(invite.token, response);
            await fetchData();
        } catch (error) {
            alert('Failed to respond to invite.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="w-2/3 mx-auto mt-8">
            <button
                className="mb-4 bg-gray-200 px-3 py-1 rounded"
                onClick={() => navigate('/dashboard')}
            >
                Back to Dashboard
            </button>
            <h2 className="text-xl font-bold mb-2">Invitations</h2>
            {loading ? (
                <div>Loading...</div>
            ) : invites.length === 0 ? (
                <div>No invites found.</div>
            ) : (
                <table className="w-full border">
                    <thead>
                        <tr>
                            <th className="border px-2 py-1">Title</th>
                            <th className="border px-2 py-1">Description</th>
                            <th className="border px-2 py-1">Invited By</th>
                            <th className="border px-2 py-1">Your Role</th>
                            <th className="border px-2 py-1">Response</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invites.map((invite: InviteOut) => (
                            <tr key={invite.id}>
                                <td className="border px-2 py-1">
                                    {invite.event.title}
                                </td>
                                <td className="border px-2 py-1">
                                    {invite.event.description}
                                </td>
                                <td className="border px-2 py-1">
                                    {invite.event.hostName}
                                </td>
                                <td className="border px-2 py-1">
                                    {invite.role}
                                </td>
                                <td className="border px-2 py-1">
                                    <button
                                        className="bg-green-200 px-2 py-1 rounded mr-2"
                                        onClick={() =>
                                            handleResponse(
                                                invite.id,
                                                'accepted'
                                            )
                                        }
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="bg-red-200 px-2 py-1 rounded"
                                        onClick={() =>
                                            handleResponse(
                                                invite.id,
                                                'declined'
                                            )
                                        }
                                    >
                                        Decline
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
