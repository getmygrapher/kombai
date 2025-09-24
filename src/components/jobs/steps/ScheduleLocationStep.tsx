import React from 'react';
import {
  Stack,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Job } from '../../../types';

interface ScheduleLocationStepProps {
  jobData: Partial<Job> | null;
  errors: Record<string, string>;
  onChange: (data: Partial<Job>) => void;
}

export const ScheduleLocationStep: React.FC<ScheduleLocationStepProps> = ({
  jobData,
  errors,
  onChange,
}) => {
  const handleDateChange = (date: Date | null) => {
    if (date) {
      onChange({ date: date.toISOString() });
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      onChange({ endDate: date.toISOString() });
    }
  };

  const handleLocationChange = (field: string, value: string) => {
    const currentLocation = jobData?.location || {
      city: '',
      state: '',
      coordinates: { lat: 9.9312, lng: 76.2673 }
    };
    onChange({
      location: {
        ...currentLocation,
        [field]: value,
      },
    });
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h6">Schedule & Location</Typography>
      
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Job Schedule
        </Typography>
        <Stack spacing={2}>
          <DateTimePicker
            label="Start Date & Time *"
            value={jobData?.date ? new Date(jobData.date) : null}
            onChange={handleDateChange}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors.date,
                helperText: errors.date,
              },
            }}
          />
          
          <DateTimePicker
            label="End Date & Time (Optional)"
            value={jobData?.endDate ? new Date(jobData.endDate) : null}
            onChange={handleEndDateChange}
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />
        </Stack>
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Job Location
        </Typography>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Venue/Address *"
            value={jobData?.location?.address || ''}
            onChange={(e) => handleLocationChange('address', e.target.value)}
            error={!!errors.location}
            helperText={errors.location}
            placeholder="e.g., Bolgatty Palace, Marine Drive"
          />
          
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="City"
              value={jobData?.location?.city || ''}
              onChange={(e) => handleLocationChange('city', e.target.value)}
              placeholder="e.g., Kochi"
            />
            
            <TextField
              fullWidth
              label="State"
              value={jobData?.location?.state || ''}
              onChange={(e) => handleLocationChange('state', e.target.value)}
              placeholder="e.g., Kerala"
            />
          </Stack>
          
          <TextField
            fullWidth
            label="PIN Code *"
            value={jobData?.location?.pinCode || ''}
            onChange={(e) => handleLocationChange('pinCode', e.target.value)}
            error={!!errors.pinCode}
            helperText={errors.pinCode}
            placeholder="e.g., 682001"
          />
          
          <TextField
            fullWidth
            label="Venue Details (Optional)"
            multiline
            rows={2}
            value={jobData?.location?.venueDetails || ''}
            onChange={(e) => handleLocationChange('venueDetails', e.target.value)}
            placeholder="Additional details about the venue, parking, access instructions..."
          />
        </Stack>
      </Box>
    </Stack>
  );
};