import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface User {
    id: number;
    email: string;
    username: string;
    full_name?: string;
    is_active: boolean;
    is_superuser: boolean;
    role_id?: number;
    role_name?: string;
    sub_team_id?: number;
    sub_team_name?: string;
}

interface UsersResponse {
    count: number;
    users: User[];
}

export function useUsers(includeInactive: boolean = false) {
    return useQuery<UsersResponse>({
        queryKey: ['users', includeInactive],
        queryFn: async () => {
            const response = await api.get(`/api/users?include_inactive=${includeInactive}`);
            return response.data;
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userId: number) => {
            const response = await api.delete(`/api/users/${userId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}
