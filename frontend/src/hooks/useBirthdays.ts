import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface BirthdayLead {
    id: number;
    lead_id: string;
    full_name: string;
    phone_number: string;
    birthday: string;
    clinic_name?: string;
    days_until?: number;
}

interface TodayBirthdaysResponse {
    count: number;
    leads: BirthdayLead[];
}

interface UpcomingBirthdaysResponse {
    count: number;
    upcoming: BirthdayLead[];
}

export function useTodayBirthdays() {
    return useQuery<TodayBirthdaysResponse>({
        queryKey: ['birthdays', 'today'],
        queryFn: async () => {
            const response = await api.get('/api/birthdays/today');
            return response.data;
        },
    });
}

export function useUpcomingBirthdays(days: number = 7) {
    return useQuery<UpcomingBirthdaysResponse>({
        queryKey: ['birthdays', 'upcoming', days],
        queryFn: async () => {
            const response = await api.get(`/api/birthdays/upcoming?days=${days}`);
            return response.data;
        },
    });
}

// Service function to send birthday message
export async function sendBirthdayMessage(leadId: number, templateId?: number) {
    const url = templateId
        ? `/api/birthdays/send/${leadId}?template_id=${templateId}`
        : `/api/birthdays/send/${leadId}`;
    const response = await api.post(url);
    return response.data;
}
