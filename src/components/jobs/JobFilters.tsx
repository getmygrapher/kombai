import React from 'react';
import {
  Stack,
  Typography,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Box,
  Chip,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { JobFilters as JobFiltersType } from '../../types';
import { ProfessionalCategory, UrgencyLevel } from '../../types/enums';
import { formatCurrency } from '../../utils/formatters';

interface JobFiltersProps {
  filters: JobFiltersType;
  onFiltersChange: (filters: Partial<JobFiltersType>) => void;
  onClearFilters: () => void;
}

const FilterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const BudgetSlider = styled(Slider)(({ theme }) => ({
  '& .MuiSlider-thumb': {
    height: 20,
    width: 20,
  },
  '& .MuiSlider-track': {
    height: 6,
  },
  '& .MuiSlider-rail': {
    height: 6,
  },
}));

const categoryOptions = [
  { value: ProfessionalCategory.PHOTOGRAPHY, label: 'Photography' },
  { value: ProfessionalCategory.VIDEOGRAPHY, label: 'Videography & Film' },
  { value: ProfessionalCategory.AUDIO, label: 'Audio Production' },
  { value: ProfessionalCategory.DESIGN, label: 'Design & Creative' },
  { value: ProfessionalCategory.MULTI_DISCIPLINARY, label: 'Multi-Disciplinary' },
];

const urgencyOptions = [
  { value: UrgencyLevel.NORMAL, label: 'Normal' },
  { value: UrgencyLevel.URGENT, label: 'Urgent' },
  { value: UrgencyLevel.EMERGENCY, label: 'Emergency' },
];

export const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const handleCategoryChange = (category: ProfessionalCategory, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    onFiltersChange({ categories: newCategories });
  };

  const handleUrgencyChange = (urgency: UrgencyLevel, checked: boolean) => {
    const newUrgency = checked
      ? [...filters.urgency, urgency]
      : filters.urgency.filter(u => u !== urgency);
    onFiltersChange({ urgency: newUrgency });
  };

  const handleBudgetChange = (event: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    onFiltersChange({
      budgetRange: { min, max }
    });
  };

  const handleDateRangeChange = (field: 'start' | 'end', date: Date | null) => {
    onFiltersChange({
      dateRange: {
        ...filters.dateRange,
        [field]: date ? date.toISOString() : ''
      }
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.urgency.length > 0) count += filters.urgency.length;
    if (filters.budgetRange.min > 0 || filters.budgetRange.max < 100000) count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={2}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {activeFiltersCount > 0 && `${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} applied`}
          </Typography>
          {activeFiltersCount > 0 && (
            <Button size="small" onClick={onClearFilters}>
              Clear All
            </Button>
          )}
        </Stack>

        {/* Category Filter */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2" fontWeight={600}>
              Category
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {categoryOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={filters.categories.includes(option.value)}
                      onChange={(e) => handleCategoryChange(option.value, e.target.checked)}
                    />
                  }
                  label={option.label}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>

        {/* Urgency Filter */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2" fontWeight={600}>
              Urgency Level
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {urgencyOptions.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  variant={filters.urgency.includes(option.value) ? 'filled' : 'outlined'}
                  color={filters.urgency.includes(option.value) ? 'primary' : 'default'}
                  onClick={() => handleUrgencyChange(
                    option.value,
                    !filters.urgency.includes(option.value)
                  )}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Budget Filter */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2" fontWeight={600}>
              Budget Range
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Box sx={{ px: 2 }}>
                <BudgetSlider
                  value={[filters.budgetRange.min, filters.budgetRange.max]}
                  onChange={handleBudgetChange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => formatCurrency(value)}
                  min={0}
                  max={100000}
                  step={1000}
                />
              </Box>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">
                  {formatCurrency(filters.budgetRange.min)}
                </Typography>
                <Typography variant="body2">
                  {formatCurrency(filters.budgetRange.max)}
                </Typography>
              </Stack>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Date Range Filter */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2" fontWeight={600}>
              Date Range
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <DatePicker
                label="From Date"
                value={filters.dateRange.start ? new Date(filters.dateRange.start) : null}
                onChange={(date) => handleDateRangeChange('start', date)}
                slotProps={{
                  textField: { fullWidth: true, size: 'small' }
                }}
              />
              <DatePicker
                label="To Date"
                value={filters.dateRange.end ? new Date(filters.dateRange.end) : null}
                onChange={(date) => handleDateRangeChange('end', date)}
                minDate={filters.dateRange.start ? new Date(filters.dateRange.start) : undefined}
                slotProps={{
                  textField: { fullWidth: true, size: 'small' }
                }}
              />
            </Stack>
          </AccordionDetails>
        </Accordion>

        <Divider />

        {/* Apply Button */}
        <Button
          variant="contained"
          fullWidth
          disabled={(activeFiltersCount === 0) as any}
        >
          Apply Filters
        </Button>
      </Stack>
    </LocalizationProvider>
  );
};