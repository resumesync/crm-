/**
 * Services Index - Export all API services
 */

export { default as api, ApiError, setAuthToken, clearAuthToken } from '@/lib/api';

// Services
export { default as leadsService } from './leadsService';
export { default as campaignsService } from './campaignsService';
export { default as whatsappService } from './whatsappService';
export { default as groupsService } from './groupsService';
export { default as statusesService } from './statusesService';
export { default as clinicsService } from './clinicsService';
export { default as authService } from './authService';
export { default as notesService, notesApi } from './notesService';
export { default as dashboardService } from './dashboardService';

// Re-export types
export type * from '@/types/api';
