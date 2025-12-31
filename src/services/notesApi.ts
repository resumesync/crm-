import { Note } from '@/types/crm';
import { supabase } from '@/lib/supabase';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Get auth token from Supabase session
const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};

export const notesApi = {
    // Get all notes for a lead
    getLeadNotes: async (leadId: string): Promise<Note[]> => {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/notes/lead/${leadId}`, {
            headers,
        });

        if (!response.ok) {
            throw new Error('Failed to fetch notes');
        }

        return response.json();
    },

    // Create a new note
    createNote: async (leadId: string, content: string): Promise<Note> => {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/notes`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                lead_id: leadId,
                content,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to create note');
        }

        return response.json();
    },

    // Update a note
    updateNote: async (noteId: string, content: string): Promise<Note> => {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ content }),
        });

        if (!response.ok) {
            throw new Error('Failed to update note');
        }

        return response.json();
    },

    // Delete a note
    deleteNote: async (noteId: string): Promise<void> => {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
            method: 'DELETE',
            headers,
        });

        if (!response.ok) {
            throw new Error('Failed to delete note');
        }
    },
};
