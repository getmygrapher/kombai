// Availability service with mocked API calls
import { 
  CalendarEntry, 
  TimeSlot, 
  RecurringPattern, 
  BookingReference, 
  BookingConflict,
  CalendarPrivacySettings,
  DateRange,
  AvailabilityStats
} from '../types/availability';

// Mock latency for realistic API simulation
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export class AvailabilityService {
  // Calendar operations
  static async getAvailability(userId: string, dateRange: DateRange): Promise<CalendarEntry[]> {
    await mockDelay();
    
    // Mock implementation - return sample data
    return [
      {
        id: 'cal_001',
        userId,
        date: '2024-01-15',
        status: 'available' as any,
        timeSlots: [
          {
            id: 'slot_001',
            start: '09:00',
            end: '12:00',
            status: 'available' as any,
            isBooked: false
          }
        ],
        isRecurring: false,
        bookings: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  static async updateAvailability(availability: Partial<CalendarEntry>): Promise<CalendarEntry> {
    await mockDelay();
    
    // Mock implementation - simulate update
    return {
      id: availability.id || 'new_cal_id',
      userId: availability.userId || 'user_123',
      date: availability.date || new Date().toISOString().split('T')[0],
      status: availability.status || 'available' as any,
      timeSlots: availability.timeSlots || [],
      isRecurring: availability.isRecurring || false,
      bookings: availability.bookings || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Time slot operations
  static async setTimeSlots(date: Date, timeSlots: TimeSlot[]): Promise<void> {
    await mockDelay();
    
    // Mock implementation - simulate saving time slots
    console.log('Setting time slots for', date, timeSlots);
  }

  static async getTimeSlots(date: Date): Promise<TimeSlot[]> {
    await mockDelay();
    
    // Mock implementation - return sample time slots
    return [
      {
        id: 'slot_001',
        start: '09:00',
        end: '12:00',
        status: 'available' as any,
        isBooked: false
      },
      {
        id: 'slot_002',
        start: '14:00',
        end: '17:00',
        status: 'booked' as any,
        isBooked: true,
        jobTitle: 'Wedding Photography'
      }
    ];
  }

  // Pattern operations
  static async saveRecurringPattern(pattern: RecurringPattern): Promise<RecurringPattern> {
    await mockDelay();
    
    // Mock implementation - simulate saving pattern
    return {
      ...pattern,
      id: pattern.id || 'new_pattern_id',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static async applyPattern(patternId: string, dateRange: DateRange): Promise<CalendarEntry[]> {
    await mockDelay();
    
    // Mock implementation - simulate applying pattern
    const entries: CalendarEntry[] = [];
    const currentDate = new Date(dateRange.start);
    
    while (currentDate <= dateRange.end) {
      entries.push({
        id: `pattern_entry_${currentDate.getTime()}`,
        userId: 'user_123',
        date: currentDate.toISOString().split('T')[0],
        status: 'available' as any,
        timeSlots: [
          {
            id: `slot_${currentDate.getTime()}`,
            start: '09:00',
            end: '17:00',
            status: 'available' as any,
            isBooked: false
          }
        ],
        isRecurring: true,
        recurringPatternId: patternId,
        bookings: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return entries;
  }

  static async getRecurringPatterns(userId: string): Promise<RecurringPattern[]> {
    await mockDelay();
    
    // Mock implementation - return sample patterns
    return [
      {
        id: 'pattern_001',
        userId,
        name: 'Standard Work Week',
        type: 'weekly' as any,
        schedule: {} as any,
        dateRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31')
        },
        exceptions: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  // Booking integration
  static async syncBookings(): Promise<BookingReference[]> {
    await mockDelay();
    
    // Mock implementation - return sample bookings
    return [
      {
        id: 'booking_001',
        jobId: 'job_001',
        jobTitle: 'Wedding Photography',
        clientId: 'client_001',
        clientName: 'John & Sarah Wedding',
        status: 'confirmed_booked' as any,
        timeSlots: [
          {
            id: 'slot_booking_1',
            start: '14:00',
            end: '17:00',
            status: 'booked' as any,
            isBooked: true
          }
        ],
        confirmedAt: new Date()
      }
    ];
  }

  static async handleBookingConflict(conflict: BookingConflict): Promise<void> {
    await mockDelay();
    
    // Mock implementation - simulate conflict resolution
    console.log('Handling booking conflict:', conflict);
  }

  static async getBookingConflicts(userId: string): Promise<BookingConflict[]> {
    await mockDelay();
    
    // Mock implementation - return sample conflicts
    return [
      {
        id: 'conflict_001',
        conflictType: 'double_booking' as any,
        affectedTimeSlots: [
          {
            id: 'slot_conflict_1',
            start: '15:00',
            end: '18:00',
            status: 'available' as any,
            isBooked: false
          }
        ],
        resolutionOptions: ['auto_decline', 'manual_review', 'flexible_booking']
      }
    ];
  }

  // Privacy operations
  static async updatePrivacySettings(settings: CalendarPrivacySettings): Promise<CalendarPrivacySettings> {
    await mockDelay();
    
    // Mock implementation - simulate saving privacy settings
    return {
      ...settings,
      userId: settings.userId || 'user_123'
    };
  }

  static async getPrivacySettings(userId: string): Promise<CalendarPrivacySettings> {
    await mockDelay();
    
    // Mock implementation - return sample privacy settings
    return {
      userId,
      isVisible: true,
      visibilityLevel: 'professional_network' as any,
      allowedUsers: [],
      hiddenDates: [],
      hiddenTimeSlots: [],
      showPartialAvailability: true,
      allowBookingRequests: true,
      autoDeclineConflicts: false
    };
  }

  // Analytics
  static async getAvailabilityStats(userId: string, dateRange: DateRange): Promise<AvailabilityStats> {
    await mockDelay();
    
    // Mock implementation - return sample analytics
    return {
      totalAvailableHours: 160,
      bookedHours: 80,
      utilizationRate: 50,
      averageBookingDuration: 4,
      mostBookedTimeSlot: '14:00-18:00',
      weeklyAvailabilityTrend: [40, 45, 38, 42, 50, 35, 48]
    };
  }

  // Export/Import operations
  static async exportCalendar(userId: string, format: 'ics' | 'csv'): Promise<Blob> {
    await mockDelay();
    
    // Mock implementation - return mock blob
    const mockData = format === 'ics' 
      ? 'BEGIN:VCALENDAR\nVERSION:2.0\nEND:VCALENDAR'
      : 'Date,Status,Start Time,End Time\n2024-01-15,Available,09:00,17:00';
    
    return new Blob([mockData], { 
      type: format === 'ics' ? 'text/calendar' : 'text/csv' 
    });
  }

  static async importCalendar(file: File): Promise<CalendarEntry[]> {
    await mockDelay();
    
    // Mock implementation - simulate import
    return [
      {
        id: 'imported_001',
        userId: 'user_123',
        date: '2024-01-20',
        status: 'available' as any,
        timeSlots: [
          {
            id: 'imported_slot_001',
            start: '10:00',
            end: '16:00',
            status: 'available' as any,
            isBooked: false
          }
        ],
        isRecurring: false,
        bookings: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
}

// Convenience hooks for React Query integration
export const availabilityQueries = {
  getAvailability: (userId: string, dateRange: DateRange) => ({
    queryKey: ['availability', userId, dateRange],
    queryFn: () => AvailabilityService.getAvailability(userId, dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
  }),
  
  getTimeSlots: (date: Date) => ({
    queryKey: ['timeSlots', date.toISOString()],
    queryFn: () => AvailabilityService.getTimeSlots(date),
    staleTime: 2 * 60 * 1000, // 2 minutes
  }),
  
  getRecurringPatterns: (userId: string) => ({
    queryKey: ['recurringPatterns', userId],
    queryFn: () => AvailabilityService.getRecurringPatterns(userId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  }),
  
  getBookings: (userId: string) => ({
    queryKey: ['bookings', userId],
    queryFn: () => AvailabilityService.syncBookings(),
    staleTime: 1 * 60 * 1000, // 1 minute
  }),
  
  getPrivacySettings: (userId: string) => ({
    queryKey: ['privacySettings', userId],
    queryFn: () => AvailabilityService.getPrivacySettings(userId),
    staleTime: 15 * 60 * 1000, // 15 minutes
  }),
  
  getAvailabilityStats: (userId: string, dateRange: DateRange) => ({
    queryKey: ['availabilityStats', userId, dateRange],
    queryFn: () => AvailabilityService.getAvailabilityStats(userId, dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
};