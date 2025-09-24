import React from 'react';
import {
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import { ProfessionalCategory } from '../../../types/enums';
import { Job } from '../../../types';

interface BasicInfoStepProps {
  jobData: Partial<Job> | null;
  errors: Record<string, string>;
  onChange: (data: Partial<Job>) => void;
}

const professionalTypes = {
  [ProfessionalCategory.PHOTOGRAPHY]: [
    'Wedding Photographer',
    'Portrait Photographer',
    'Event Photographer',
    'Commercial Photographer',
    'Real Estate Photographer',
  ],
  [ProfessionalCategory.VIDEOGRAPHY]: [
    'Wedding Videographer',
    'Commercial Videographer',
    'Music Videographer',
    'Content Creator',
  ],
  [ProfessionalCategory.AUDIO]: [
    'Mixing Engineer',
    'Mastering Engineer',
    'Live Sound Engineer',
  ],
  [ProfessionalCategory.DESIGN]: [
    'Graphic Designer',
    'Social Media Designer',
    'Illustrator',
    'Creative Director',
  ],
};

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  jobData,
  errors,
  onChange,
}) => {
  const handleTypeChange = (type: ProfessionalCategory) => {
    onChange({
      type,
      professionalTypesNeeded: [], // Reset when category changes
    });
  };

  const handleProfessionalTypeToggle = (professionalType: string) => {
    const current = jobData?.professionalTypesNeeded || [];
    const updated = current.includes(professionalType)
      ? current.filter(t => t !== professionalType)
      : [...current, professionalType];
    
    onChange({ professionalTypesNeeded: updated });
  };

  const availableTypes = jobData?.type ? professionalTypes[jobData.type] || [] : [];

  return (
    <Stack spacing={3}>
      <Typography variant="h6">Basic Job Information</Typography>
      
      <TextField
        fullWidth
        label="Job Title"
        value={jobData?.title || ''}
        onChange={(e) => onChange({ title: e.target.value })}
        error={!!errors.title}
        helperText={errors.title}
        placeholder="e.g., Wedding Photography - Traditional Kerala Wedding"
      />

      <FormControl fullWidth error={!!errors.type}>
        <InputLabel>Work Category</InputLabel>
        <Select
          value={jobData?.type || ''}
          onChange={(e) => handleTypeChange(e.target.value as ProfessionalCategory)}
          label="Work Category"
        >
          {Object.values(ProfessionalCategory).map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
        {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
      </FormControl>

      {jobData?.type && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Professional Types Needed *
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
            {availableTypes.map((type) => (
              <Chip
                key={type}
                label={type}
                clickable
                color={jobData.professionalTypesNeeded?.includes(type) ? 'primary' : 'default'}
                variant={jobData.professionalTypesNeeded?.includes(type) ? 'filled' : 'outlined'}
                onClick={() => handleProfessionalTypeToggle(type)}
              />
            ))}
          </Stack>
          {errors.professionalTypesNeeded && (
            <FormHelperText error>{errors.professionalTypesNeeded}</FormHelperText>
          )}
        </Box>
      )}

      <TextField
        fullWidth
        label="Job Description"
        multiline
        rows={4}
        value={jobData?.description || ''}
        onChange={(e) => onChange({ description: e.target.value })}
        error={!!errors.description}
        helperText={errors.description}
        placeholder="Describe your job requirements, expectations, and any special instructions..."
      />
    </Stack>
  );
};