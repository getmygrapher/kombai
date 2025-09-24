import { create } from 'zustand';
import { Job, JobFilters, JobSortOption } from '../types';
import { mockJobs } from '../data/jobPostingMockData';
import { sortJobsByDistance, filterJobsByRadius, getCurrentLocation, getDefaultLocation } from '../utils/locationUtils';

interface JobDiscoveryStore {
  jobs: Job[];
  filters: JobFilters;
  searchQuery: string;
  sortBy: JobSortOption;
  isLoading: boolean;
  hasMore: boolean;
  currentPage: number;
  userLocation: { lat: number; lng: number } | null;
  
  // Actions
  setFilters: (filters: Partial<JobFilters>) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: JobSortOption) => void;
  setUserLocation: (location: { lat: number; lng: number } | null) => void;
  loadJobs: () => Promise<void>;
  loadMoreJobs: () => Promise<void>;
  refreshJobs: () => Promise<void>;
  clearFilters: () => void;
}

const defaultFilters: JobFilters = {
  categories: [],
  urgency: [],
  budgetRange: { min: 0, max: 100000 },
  distance: 'TWENTY_FIVE_KM' as any,
  dateRange: { start: '', end: '' }
};

// Helper function to convert distance filter to kilometers
const getRadiusFromFilter = (distance: string): number => {
  const radiusMap: Record<string, number> = {
    'FIVE_KM': 5,
    'TEN_KM': 10,
    'TWENTY_FIVE_KM': 25,
    'FIFTY_KM': 50,
    'HUNDRED_KM': 100,
    'FIVE_HUNDRED_KM': 500
  };
  return radiusMap[distance] || 25;
};

export const useJobDiscoveryStore = create<JobDiscoveryStore>((set, get) => ({
  jobs: [],
  filters: defaultFilters,
  searchQuery: '',
  sortBy: 'DISTANCE' as any,
  isLoading: false,
  hasMore: true,
  currentPage: 1,
  userLocation: null,

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
    get().loadJobs();
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().loadJobs();
  },

  setSortBy: (sort) => {
    set({ sortBy: sort });
    get().loadJobs();
  },

  setUserLocation: (location) => {
    set({ userLocation: location });
  },

  loadJobs: async () => {
    set({ isLoading: true });
    try {
      // Get user location if not already set
      const { userLocation } = get();
      if (!userLocation) {
        const location = await getCurrentLocation();
        if (location) {
          set({ userLocation: location });
        } else {
          set({ userLocation: getDefaultLocation() });
        }
      }

      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock implementation - filter and sort jobs
      let filteredJobs = [...mockJobs];
      const { filters, searchQuery, sortBy, userLocation: currentLocation } = get();
      
      // Apply search query
      if (searchQuery) {
        filteredJobs = filteredJobs.filter(job => 
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply category filters
      if (filters.categories.length > 0) {
        filteredJobs = filteredJobs.filter(job => 
          filters.categories.includes(job.type)
        );
      }
      
      // Apply urgency filters
      if (filters.urgency.length > 0) {
        filteredJobs = filteredJobs.filter(job => 
          filters.urgency.includes(job.urgency)
        );
      }
      
      // Apply budget filters
      filteredJobs = filteredJobs.filter(job => 
        job.budgetRange.min >= filters.budgetRange.min &&
        job.budgetRange.max <= filters.budgetRange.max
      );
      
      // Apply distance filtering and sorting
      if (currentLocation) {
        // Filter by distance radius
        const radiusKm = getRadiusFromFilter(filters.distance);
        filteredJobs = filterJobsByRadius(filteredJobs, currentLocation, radiusKm);
        
        // Sort by distance first, then apply other sorting
        filteredJobs = sortJobsByDistance(filteredJobs, currentLocation);
      }
      
      // Apply additional sorting
      switch (sortBy) {
        case 'DATE': {
          filteredJobs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          break;
        }
        case 'BUDGET': {
          filteredJobs.sort((a, b) => b.budgetRange.max - a.budgetRange.max);
          break;
        }
        case 'URGENCY': {
          const urgencyOrder = { 'EMERGENCY': 3, 'URGENT': 2, 'NORMAL': 1 } as const;
          filteredJobs.sort((a, b) => 
            (urgencyOrder[b.urgency as keyof typeof urgencyOrder] || 0) - (urgencyOrder[a.urgency as keyof typeof urgencyOrder] || 0)
          );
          break;
        }
        // DISTANCE is already handled above
      }
      
      set({ 
        jobs: filteredJobs, 
        isLoading: false, 
        currentPage: 1,
        hasMore: filteredJobs.length > 0 
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to load jobs:', error);
    }
  },

  loadMoreJobs: async () => {
    const { currentPage, hasMore, isLoading } = get();
    if (!hasMore || isLoading) return;
    
    set({ isLoading: true });
    try {
      // TODO: Implement pagination with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just simulate loading more jobs
      set({ 
        currentPage: currentPage + 1,
        isLoading: false,
        hasMore: false // No more jobs to load
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to load more jobs:', error);
    }
  },

  refreshJobs: async () => {
    set({ currentPage: 1, hasMore: true });
    await get().loadJobs();
  },

  clearFilters: () => {
    set({ filters: defaultFilters, searchQuery: '' });
    get().loadJobs();
  }
}));