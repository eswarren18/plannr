const baseUrl = import.meta.env.VITE_API_HOST || 'http://localhost:9000';

export async function fetchHostingEvents() {
    try {
        const response = await fetch(`${baseUrl}/api/events/hosting`, {
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch hosting events');
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function fetchParticipatingEvents() {
    try {
        const response = await fetch(`${baseUrl}/api/events/participating`, {
            credentials: 'include',
        });
        if (!response.ok)
            throw new Error('Failed to fetch participating events');
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// TODO: Add service for creating an event
