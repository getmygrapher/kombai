import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CalendarEntry, 
  RecurringPattern, 
  BookingConflict, 
  AvailabilityStats,
  TimeSlot,
  CalendarPrivacySettings,
  DateRange
} from '../types/availability';
import { mockQuery } from '../data/availabilityMockData';

// Query hooks for availability data
export const useCalendarEntries = (userId: string, dateRange?: DateRange) => {
  return useQuery({
    queryKey: ['calendarEntries', userId, dateRange],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockQuery.calendarEntries;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRecurringPatterns = (userId: string) => {
  return useQuery({
    queryKey: ['recurringPatterns', userId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockQuery.recurringPatterns;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useBookingConflicts = (userId: string) => {
  return useQuery({
    queryKey: ['bookingConflicts', userId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockQuery.bookingConflicts;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAvailabilityStats = (userId: string) => {
  return useQuery({
    queryKey: ['availabilityStats', userId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 400));
      return mockQuery.availabilityStats;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Mutation hooks for availability updates
export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { 
      userId: string; 
      date: string; 
      timeSlots: TimeSlot[]; 
      status: string;
    }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['calendarEntries', variables.userId] 
      });
    },
  });
};

export const useCreateRecurringPattern = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pattern: Omit<RecurringPattern, 'id' | 'createdAt' | 'updatedAt'>) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { 
        ...pattern, 
        id: `pattern_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['recurringPatterns', variables.userId] 
      });
    },
  });
};

export const useApplyRecurringPattern = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { 
      patternId: string; 
      userId: string; 
      dateRange: DateRange; 
    }) => {
      await new Promise(resolve => setTimeout(resolve, 1200));
      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['calendarEntries', variables.userId] 
      });
    },
  });
};

export const useResolveBookingConflict = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { 
      conflictId: string; 
      userId: string; 
      resolution: string; 
    }) => {
      await new Promise(resolve => setTimeout(resolve, 600));
      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['bookingConflicts', variables.userId] 
      });
    },
  });
};

export const useUpdatePrivacySettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: CalendarPrivacySettings) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['privacySettings', variables.userId] 
      });
    },
  });
};