import { useContext, useEffect, useState } from 'react';
import { data, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { Navigate } from 'react-router-dom';

import { fetchHostingEvents } from '../services/eventService';
import { fetchPendingInvites } from '../services/inviteService';
import { fetchParticipatingEvents } from '../services/eventService';
import { EventSummaryOut } from '../types/event';
import { InviteOut } from '../types/invite';
import { ProfileCard } from '../components/ProfileCard';

export default function Dashboard() {
    // Redirect to home if not logged in
    const auth = useContext(AuthContext);
    if (!auth?.user) {
        return <Navigate to="/" />;
    }

    const navigate = useNavigate();
    const [participatingEvents, setParticipatingEvents] = useState<
        EventSummaryOut[]
    >([]);
    const [hostingEvents, setHostingEvents] = useState<EventSummaryOut[]>([]);
    const [invites, setInvites] = useState<InviteOut[]>([]);

    // Fetch events and invites events
    const fetchData = async () => {
        try {
            const participatingData = await fetchParticipatingEvents();
            const hostingData = await fetchHostingEvents();
            const invitesData = await fetchPendingInvites();
            setParticipatingEvents(participatingData);
            setHostingEvents(hostingData);
            setInvites(invitesData);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flex bg-gray-50 min-h-screen z-10">
            {/* Left: Profile Card */}
            <ProfileCard />
            {/* Right: Main Content */}
            <div
                className="fixed right-0 w-3/4 pt-20 pb-8 flex flex-col items-center overflow-y-auto"
                style={{
                    height: 'calc(100vh - 4rem)',
                    maxHeight: 'calc(100vh - 4rem)',
                }}
            >
                <div className="flex flex-col w-4/5 gap-4">
                    {/* Upcoming Events */}
                    <section className="w-full mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold">
                                Upcoming Events
                            </h2>
                            <button
                                className="cursor-pointer bg-cyan-600 text-white px-3 py-1 rounded font-medium hover:bg-cyan-400 transition"
                                onClick={() =>
                                    navigate('/participating-events')
                                }
                            >
                                See All Events
                            </button>
                        </div>
                        {participatingEvents.length === 0 ? (
                            <div className="text-gray-500 py-2 text-center">
                                No upcoming events found.
                            </div>
                        ) : (
                            <table className="w-full bg-white rounded-lg shadow-sm">
                                <thead>
                                    <tr className="bg-gray-100 text-left">
                                        <th className="py-2 px-4 w-2/3">
                                            Title
                                        </th>
                                        <th className="py-2 px-4 w-1/3">
                                            Host
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {participatingEvents.map((event, idx) => (
                                        <tr
                                            key={event.id || idx}
                                            className="border-b last:border-b-0 border-gray-200"
                                        >
                                            <td className="py-2 px-4 w-2/3">
                                                {event.title}
                                            </td>
                                            <td className="py-2 px-4 w-1/3 border-l border-gray-200">
                                                {event.hostName}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </section>
                    {/* My Events */}
                    <section className="w-full mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold">My Events</h2>
                            <button
                                className="cursor-pointer bg-cyan-600 text-white px-3 py-1 rounded font-medium hover:bg-cyan-400 transition"
                                onClick={() => navigate('/hosting-events')}
                            >
                                See All Events
                            </button>
                        </div>
                        {hostingEvents.length === 0 ? (
                            <div className="text-gray-500 py-2 text-center">
                                No hosted events found.
                            </div>
                        ) : (
                            <table className="w-full bg-white rounded-lg shadow-sm">
                                <thead>
                                    <tr className="bg-gray-100 text-left">
                                        <th className="py-2 px-4 w-2/3">
                                            Title
                                        </th>
                                        <th className="py-2 px-4 w-1/3">
                                            Host
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hostingEvents.map((event, idx) => (
                                        <tr
                                            key={event.id || idx}
                                            className="border-b last:border-b-0 border-gray-200"
                                        >
                                            <td className="py-2 px-4 w-2/3">
                                                {event.title}
                                            </td>
                                            <td className="py-2 px-4 w-1/3 border-l border-gray-200">
                                                {event.hostName}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </section>
                    {/* My Invites */}
                    <section className="w-full mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-bold">My Invites</h2>
                            <button
                                className="cursor-pointer bg-cyan-600 text-white px-3 py-1 rounded font-medium hover:bg-cyan-400 transition"
                                onClick={() => navigate('/invites')}
                            >
                                See Details
                            </button>
                        </div>
                        {invites.length === 0 ? (
                            <div className="text-gray-500 py-2">
                                No new invites.
                            </div>
                        ) : (
                            <table className="w-full bg-white rounded-lg shadow-sm">
                                <thead>
                                    <tr className="bg-gray-100 text-left">
                                        <th className="py-2 px-4 w-2/3">
                                            Title
                                        </th>
                                        <th className="py-2 px-4 w-1/3">
                                            Host
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invites.map((invite, idx) => (
                                        <tr
                                            key={invite.id || idx}
                                            className="border-b last:border-b-0 border-gray-200"
                                        >
                                            <td className="py-2 px-4 w-2/3">
                                                {invite.event.title}
                                            </td>
                                            <td className="py-2 px-4 w-1/3 border-l border-gray-200">
                                                {invite.event.hostName}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
