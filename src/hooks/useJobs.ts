import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Job, Coordinates, DistanceRadius, JobFilters } from '../types';
import { JobStatus } from '../types/enums';
import { mockQuery } from '../data/jobPostingMockData';

export const useNearbyJobs = (
  location: Coordinates,
  radius: DistanceRadius,
  filters?: JobFilters
) => {
  return useQuery({
    queryKey: ['nearbyJobs', location, radius, filters],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        jobs: mockQuery.nearbyJobs,
        total: mockQuery.nearbyJobs.length,
        hasMore: false
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useJobDetails = (jobId: string) => {
  return useQuery({
    queryKey: ['jobDetails', jobId],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockQuery.nearbyJobs.find(job => job.id === jobId);
    },
    enabled: !!jobId,
  });
};

export const useMyJobs = (status?: JobStatus) => {
  return useQuery({
    queryKey: ['myJobs', status],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      let jobs = mockQuery.myPostedJobs;
      if (status) {
        jobs = jobs.filter(job => job.status === status);
      }
      return {
        jobs,
        total: jobs.length,
        hasMore: false
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (jobData: Partial<Job>) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newJob: Job = {
        id: `job_${Date.now()}`,
        title: jobData.title || '',
        type: jobData.type!,
        professionalTypesNeeded: jobData.professionalTypesNeeded || [],
        date: jobData.date || new Date().toISOString(),
        location: jobData.location!,
        budgetRange: jobData.budgetRange!,
        description: jobData.description || '',
        urgency: jobData.urgency!,
        postedBy: {
          id: 'user_123',
          name: 'Current User',
          rating: 4.3,
          totalJobs: 6
        },
        applicants: [],
        status: JobStatus.ACTIVE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: jobData.date || new Date().toISOString(),
        isExpired: false,
        viewCount: 0,
        ...jobData
      };

      // Persist to in-memory mock store so the UI reflects the new job immediately
      try {
        // Add to "My Jobs"
        mockQuery.myPostedJobs.unshift(newJob);
        // Also add to nearby jobs so Home feed shows it
        mockQuery.nearbyJobs.unshift(newJob);
      } catch {
        // no-op: in case mockQuery is immutable in future, we still return success
      }

      return { job: newJob, success: true, message: 'Job posted successfully!' };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myJobs'] });
      queryClient.invalidateQueries({ queryKey: ['nearbyJobs'] });
    },
  });
};

export const useJobApplications = (jobId: string) => {
  return useQuery({
    queryKey: ['jobApplications', jobId],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      const job = mockQuery.nearbyJobs.find(j => j.id === jobId) || 
                  mockQuery.myPostedJobs.find(j => j.id === jobId);
      return {
        applications: job?.applicants || [],
        total: job?.applicants.length || 0
      };
    },
    enabled: !!jobId,
  });
};

export const useApplyToJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (applicationData: {
      jobId: string;
      message: string;
      proposedRate?: number;
    }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new application
      const newApplication = {
        id: `app_${Date.now()}`,
        jobId: applicationData.jobId,
        applicantId: 'current_user_id',
        applicant: {
          id: 'current_user_id',
          name: 'Current User',
          profilePhoto: '',
          professionalType: 'Photographer',
          specializations: ['Portrait', 'Wedding'],
          experience: 'MID' as any,
          location: {
            city: 'Kochi',
            state: 'Kerala',
            coordinates: { lat: 9.9312, lng: 76.2673 }
          },
          pricing: {
            type: 'PER_DAY' as any,
            rate: 5000,
            isNegotiable: true
          },
          rating: 4.2,
          totalReviews: 15,
          isVerified: true,
          tier: 'FREE' as any
        },
        message: applicationData.message,
        proposedRate: applicationData.proposedRate,
        status: 'PENDING' as any,
        appliedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add application to the job in mock data
      const job = mockQuery.nearbyJobs.find(j => j.id === applicationData.jobId) ||
                  mockQuery.myPostedJobs.find(j => j.id === applicationData.jobId);
      if (job) {
        job.applicants.push(newApplication);
      }

      return { success: true, application: newApplication };
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobDetails', variables.jobId] });
      queryClient.invalidateQueries({ queryKey: ['jobApplications', variables.jobId] });
      queryClient.invalidateQueries({ queryKey: ['nearbyJobs'] });
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      applicationId: string;
      status: string;
    }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update application status in mock data
      for (const job of [...mockQuery.nearbyJobs, ...mockQuery.myPostedJobs]) {
        const application = job.applicants.find(app => app.id === data.applicationId);
        if (application) {
          application.status = data.status as any;
          application.updatedAt = new Date().toISOString();
          break;
        }
      }
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobApplications'] });
    },
  });
};