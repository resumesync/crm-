import { Note } from '@/types/crm';
import { supabase } from '@/lib/supabase';

export const notesApi = {
    // Get all notes for a lead
    getLeadNotes: async (leadId: string): Promise<Note[]> => {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('lead_id', leadId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Failed to fetch notes:', error);
            throw new Error('Failed to fetch notes');
        }

        return data || [];
    },

    // Create a new note
    createNote: async (leadId: string, content: string): Promise<Note> => {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('notes')
            .insert({
                lead_id: leadId,
                content,
                created_by: user?.id,
            })
            .select()
            .single();

        if (error) {
            console.error('Failed to create note:', error);
            throw new Error('Failed to create note');
        }

        return data;
    },

    // Update a note
    updateNote: async (noteId: string, content: string): Promise<Note> => {
        const { data, error } = await supabase
            .from('notes')
            .update({ content, updated_at: new Date().toISOString() })
            .eq('id', noteId)
            .select()
            .single();

        if (error) {
            console.error('Failed to update note:', error);
            throw new Error('Failed to update note');
        }

        return data;
    },

    // Delete a note
    deleteNote: async (noteId: string): Promise<void> => {
        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', noteId);

        if (error) {
            console.error('Failed to delete note:', error);
            throw new Error('Failed to delete note');
        }
    },
};
