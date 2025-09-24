import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Job, Application } from '../types';

interface JobStore {
  currentJob: Job | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  getJob: (jobId: string) => Promise<void>;
  setCurrentJob: (job: Job | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useJobStore = create<JobStore>()(
  persist(
    (set, get) => ({
      currentJob: null,
      isLoading: false,
      error: null,

      getJob: async (jobId: string) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual API call
          // For now, simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock job data - in real implementation, this would come from API
          const mockJob: Job = {
            id: jobId,
            title: 'Wedding Photography - Outdoor Ceremony',
            type: 'PHOTOGRAPHY' as any,
            professionalTypesNeeded: ['Wedding Photographer'],
            date: '2024-02-15',
            timeSlots: [{ start: '09:00', end: '18:00', status: 'AVAILABLE' as any }],
            location: {
              city: 'Mumbai',
              state: 'Maharashtra',
              pinCode: '400001',
              address: 'Taj Hotel, Colaba',
              coordinates: { lat: 18.9220, lng: 72.8347 }
            },
            budgetRange: {
              min: 15000,
              max: 25000,
              currency: 'INR',
              type: 'FIXED' as any,
              isNegotiable: true
            },
            description: 'Looking for an experienced wedding photographer for an outdoor ceremony in Mumbai.',
            urgency: 'NORMAL' as any,
            postedBy: {
              id: '1',
              name: 'John Doe',
              rating: 4.5,
              totalJobs: 12
            },
            applicants: [],
            status: 'ACTIVE' as any,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
            expiresAt: '2024-02-15T18:00:00Z',
            isExpired: false,
            viewCount: 45
          };
          
          set({ currentJob: mockJob, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load job',
            isLoading: false 
          });
        }
      },

      setCurrentJob: (job) => set({ currentJob: job }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'job-store',
      partialize: (state) => ({ currentJob: state.currentJob }),
    }
  )
);