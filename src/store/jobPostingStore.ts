import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Job } from '../types';

interface JobPostingStore {
  currentJob: Partial<Job> | null;
  step: number;
  isSubmitting: boolean;
  errors: Record<string, string>;
  lastSaved: string | null;
  
  // Actions
  setJobData: (data: Partial<Job>) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  saveDraft: () => void;
  loadDraft: () => boolean;
  submitJob: () => Promise<{ success: boolean; job?: Job; error?: string }>;
  resetForm: () => void;
  setErrors: (errors: Record<string, string>) => void;
  clearErrors: () => void;
  setSubmitting: (submitting: boolean) => void;
}

export const useJobPostingStore = create<JobPostingStore>()(
  persist(
    (set, get) => ({
      currentJob: null,
      step: 1,
      isSubmitting: false,
      errors: {},
      lastSaved: null,

      setJobData: (data) => {
        const currentJob = get().currentJob;
        const updatedJob = { ...currentJob, ...data };
        set({ currentJob: updatedJob });
        
        // Auto-save draft
        get().saveDraft();
      },

      nextStep: () => {
        const currentStep = get().step;
        if (currentStep < 4) {
          set({ step: currentStep + 1 });
        }
      },

      prevStep: () => {
        const currentStep = get().step;
        if (currentStep > 1) {
          set({ step: currentStep - 1 });
        }
      },

      setStep: (step) => {
        set({ step });
      },

      saveDraft: () => {
        const { currentJob } = get();
        if (currentJob) {
          localStorage.setItem('job-draft', JSON.stringify(currentJob));
          set({ lastSaved: new Date().toISOString() });
        }
      },

      loadDraft: () => {
        try {
          const draft = localStorage.getItem('job-draft');
          if (draft) {
            const parsedDraft = JSON.parse(draft);
            set({ currentJob: parsedDraft });
            return true;
          }
        } catch (error) {
          console.error('Failed to load draft:', error);
        }
        return false;
      },

      submitJob: async () => {
        const { currentJob } = get();
        if (!currentJob) {
          return { success: false, error: 'No job data to submit' };
        }

        set({ isSubmitting: true, errors: {} });

        try {
          // TODO: Replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Mock successful submission
          const submittedJob: Job = {
            id: `job-${Date.now()}`,
            title: currentJob.title || '',
            type: currentJob.type || 'PHOTOGRAPHY' as any,
            professionalTypesNeeded: currentJob.professionalTypesNeeded || [],
            date: currentJob.date || '',
            timeSlots: currentJob.timeSlots || [],
            location: currentJob.location || {
              city: '',
              state: '',
              coordinates: { lat: 0, lng: 0 }
            },
            budgetRange: currentJob.budgetRange || {
              min: 0,
              max: 0,
              currency: 'INR',
              type: 'FIXED' as any,
              isNegotiable: false
            },
            description: currentJob.description || '',
            urgency: currentJob.urgency || 'NORMAL' as any,
            postedBy: {
              id: 'current-user',
              name: 'Current User',
              rating: 4.5,
              totalJobs: 1
            },
            applicants: [],
            status: 'ACTIVE' as any,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            isExpired: false,
            viewCount: 0
          };

          // Clear draft after successful submission
          localStorage.removeItem('job-draft');
          get().resetForm();

          set({ isSubmitting: false });
          return { success: true, job: submittedJob };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to submit job';
          set({ 
            isSubmitting: false, 
            errors: { submit: errorMessage } 
          });
          return { success: false, error: errorMessage };
        }
      },

      resetForm: () => {
        set({
          currentJob: null,
          step: 1,
          isSubmitting: false,
          errors: {},
          lastSaved: null
        });
        localStorage.removeItem('job-draft');
      },

      setErrors: (errors) => {
        set({ errors });
      },

      clearErrors: () => {
        set({ errors: {} });
      },

      setSubmitting: (submitting) => {
        set({ isSubmitting: submitting });
      }
    }),
    {
      name: 'job-posting-store',
      partialize: (state) => ({
        currentJob: state.currentJob,
        step: state.step,
        lastSaved: state.lastSaved
      }),
    }
  )
);