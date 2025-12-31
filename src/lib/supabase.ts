import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types (auto-generated from Supabase)
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            organizations: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    logo_url: string | null
                    subscription_tier: 'free' | 'pro' | 'enterprise'
                    subscription_status: 'trial' | 'active' | 'cancelled'
                    trial_ends_at: string | null
                    created_at: string
                    settings: Json | null
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    logo_url?: string | null
                    subscription_tier?: 'free' | 'pro' | 'enterprise'
                    subscription_status?: 'trial' | 'active' | 'cancelled'
                    trial_ends_at?: string | null
                    created_at?: string
                    settings?: Json | null
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    logo_url?: string | null
                    subscription_tier?: 'free' | 'pro' | 'enterprise'
                    subscription_status?: 'trial' | 'active' | 'cancelled'
                    trial_ends_at?: string | null
                    created_at?: string
                    settings?: Json | null
                }
            }
            organization_members: {
                Row: {
                    id: string
                    organization_id: string
                    user_id: string
                    role: 'owner' | 'admin' | 'manager' | 'agent'
                    invited_by: string | null
                    joined_at: string
                }
                Insert: {
                    id?: string
                    organization_id: string
                    user_id: string
                    role?: 'owner' | 'admin' | 'manager' | 'agent'
                    invited_by?: string | null
                    joined_at?: string
                }
                Update: {
                    id?: string
                    organization_id?: string
                    user_id?: string
                    role?: 'owner' | 'admin' | 'manager' | 'agent'
                    invited_by?: string | null
                    joined_at?: string
                }
            }
        }
    }
}
