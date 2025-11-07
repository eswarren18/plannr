import { EventOut, EventCreate } from '../types/event';

export const baseUrl = import.meta.env.VITE_API_HOST;
if (!baseUrl) {
    throw new Error('VITE_API_HOST was not defined');
}

export async function fetchHostingEvents(): Promise<EventOut[]> {
    try {
        const response = await fetch(`${baseUrl}/api/events/hosting`, {
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch hosting events');

        // Transform Response object to JSON
        const data = await response.json();

        // Transform from snake_case to camelCase
        const events: EventOut[] = data.map((event: any) => ({
            id: event.id,
            title: event.title,
            description: event.description,
            hostId: event.host_id,
        }));
        return events;
    } catch (error) {
        console.error('Error in fetchHostingEvents:', error);
        throw error;
    }
}

export async function fetchParticipatingEvents(): Promise<EventOut[]> {
    try {
        const response = await fetch(`${baseUrl}/api/events/participating`, {
            credentials: 'include',
        });
        if (!response.ok)
            throw new Error('Failed to fetch participating events');

        // Transform Response object to JSON
        const data = await response.json();

        // Transform from snake_case to camelCase
        const events: EventOut[] = data.map((event: any) => ({
            id: event.id,
            title: event.title,
            description: event.description,
            hostId: event.host_id,
        }));
        return events;
    } catch (error) {
        throw error;
    }
}

export async function createEvent(
    eventData: EventCreate
): Promise<EventOut | Error> {
    try {
        const response = await fetch(`${baseUrl}/api/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to create event');

        // Transform Response object to JSON
        const data = await response.json();

        // Transform from snake_case to camelCase
        const event: EventOut = {
            id: data.id,
            title: data.title,
            description: data.description,
            hostId: data.host_id,
        };
        return event;
    } catch (error) {
        throw error;
    }
}

export async function fetchEventById(
    eventId: number
): Promise<EventOut | Error> {
    try {
        const response = await fetch(`${baseUrl}/api/events/${eventId}`, {
            credentials: 'include',
        });
        if (!response.ok) {
            const errorMsg =
                response.status === 404
                    ? 'Event not found'
                    : 'Failed to fetch event';
            throw new Error(errorMsg);
        }

        // Transform Response object to JSON
        const data = await response.json();

        // Transform from snake_case to camelCase
        const event: EventOut = {
            id: data.id,
            title: data.title,
            description: data.description,
            hostId: data.host_id,
        };
        return event;
    } catch (error) {
        return error instanceof Error ? error : new Error('Unknown error');
    }
}

export async function updateEvent(
    eventId: number,
    eventData: { title: string; description: string }
): Promise<EventOut | Error> {
    try {
        const response = await fetch(`${baseUrl}/api/events/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData),
            credentials: 'include',
        });
        if (!response.ok) {
            const errorMsg =
                response.status === 404
                    ? 'Event not found'
                    : 'Failed to update event';
            throw new Error(errorMsg);
        }
        const data = await response.json();
        const event: EventOut = {
            id: data.id,
            title: data.title,
            description: data.description,
            hostId: data.host_id,
        };
        return event;
    } catch (error) {
        return error instanceof Error ? error : new Error('Unknown error');
    }
}
