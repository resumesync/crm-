/**
 * Notes Service - API calls for lead notes (migrated from Supabase to backend API)
 */
import api from '@/lib/api';
import type { ApiNote, ApiNoteCreate } from '@/types/api';

export const notesService = {
    /**
     * Get all notes for a lead
     */
    getLeadNotes: (leadId: number): Promise<ApiNote[]> => {
        return api.get<ApiNote[]>(`/notes/lead/${leadId}`);
    },

    /**
     * Create a new note for a lead
     */
    createNote: (leadId: number, content: string, userId?: number): Promise<ApiNote> => {
        const body: ApiNoteCreate = { content };
        return api.post<ApiNote>(`/notes/lead/${leadId}`, body, { user_id: userId });
    },

    /**
     * Update a note
     */
    updateNote: (noteId: number, content: string): Promise<ApiNote> => {
        return api.put<ApiNote>(`/notes/${noteId}`, { content });
    },

    /**
     * Delete a note
     */
    deleteNote: (noteId: number): Promise<{ status: string; note_id: number }> => {
        return api.delete(`/notes/${noteId}`);
    },
};

// Re-export for backward compatibility
export const notesApi = notesService;

export default notesService;
