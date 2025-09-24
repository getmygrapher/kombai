import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Application, ApplicationStatus } from '../types';

interface ApplicationStore {
  applications: Application[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  submitApplication: (data: {
    jobId: string;
    message: string;
    proposedRate?: number;
  }) => Promise<{ success: boolean; applicationId?: string; error?: string }>;
  
  getApplications: (jobId?: string) => Application[];
  updateApplicationStatus: (applicationId: string, status: ApplicationStatus) => Promise<boolean>;
  withdrawApplication: (applicationId: string) => Promise<boolean>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set, get) => ({
      applications: [],
      isLoading: false,
      error: null,

      submitApplication: async (data) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Mock successful application submission
          const newApplication: Application = {
            id: `app-${Date.now()}`,
            jobId: data.jobId,
            applicantId: 'current-user',
            applicant: {
              id: 'current-user',
              name: 'Current User',
              profilePhoto: '/placeholder-avatar.jpg',
              professionalType: 'Photographer',
              specializations: ['Wedding Photography', 'Portrait Photography'],
              experience: 'INTERMEDIATE' as any,
              location: {
                city: 'Kochi',
                state: 'Kerala',
                coordinates: { lat: 9.9312, lng: 76.2673 }
              },
              pricing: {
                type: 'HOURLY' as any,
                rate: data.proposedRate || 2000,
                isNegotiable: true
              },
              rating: 4.5,
              totalReviews: 12,
              isVerified: true,
              tier: 'FREE' as any,
              distance: 0
            },
            message: data.message,
            proposedRate: data.proposedRate,
            status: 'PENDING' as any,
            appliedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          set((state) => ({
            applications: [...state.applications, newApplication],
            isLoading: false
          }));

          return { success: true, applicationId: newApplication.id };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to submit application';
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          return { success: false, error: errorMessage };
        }
      },

      getApplications: (jobId) => {
        const { applications } = get();
        if (jobId) {
          return applications.filter(app => app.jobId === jobId);
        }
        return applications;
      },

      updateApplicationStatus: async (applicationId, status) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set((state) => ({
            applications: state.applications.map(app =>
              app.id === applicationId
                ? { ...app, status, updatedAt: new Date().toISOString() }
                : app
            ),
            isLoading: false
          }));

          return true;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update application status',
            isLoading: false 
          });
          return false;
        }
      },

      withdrawApplication: async (applicationId) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set((state) => ({
            applications: state.applications.map(app =>
              app.id === applicationId
                ? { ...app, status: 'WITHDRAWN' as any, updatedAt: new Date().toISOString() }
                : app
            ),
            isLoading: false
          }));

          return true;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to withdraw application',
            isLoading: false 
          });
          return false;
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'application-store',
      partialize: (state) => ({ applications: state.applications }),
    }
  )
);