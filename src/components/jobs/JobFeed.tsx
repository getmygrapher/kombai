import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { JobCard } from './JobCard';
import { Job } from '../../types';
import { useAppStore } from '../../store/appStore';
import { useNearbyJobs } from '../../hooks/useJobs';

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  overflow: 'auto',
}));

export const JobFeed: React.FC = () => {
  const { currentLocation, selectedRadius, jobFilters, searchQuery, setSearchQuery } = useAppStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const {
    data: jobsData,
    isLoading,
    error,
    refetch,
  } = useNearbyJobs(
    currentLocation || { lat: 9.9312, lng: 76.2673 },
    selectedRadius,
    jobFilters
  );

  useEffect(() => {
    if (jobsData?.jobs) {
      setJobs(jobsData.jobs);
    }
  }, [jobsData]);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.professionalTypesNeeded.some(type =>
      type.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleJobDetails = (jobId: string) => {
    console.log('View job details:', jobId);
  };

  const handleJobApply = (jobId: string) => {
    console.log('Apply to job:', jobId);
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <StyledContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={handleRefresh}>
            Retry
          </Button>
        }>
          Failed to load jobs. Please try again.
        </Alert>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <Stack spacing={3}>
        {/* Search and Filters */}
        <Stack spacing={2}>
          <TextField
            fullWidth
            placeholder="Search jobs by title, description, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="outlined"
              startIcon={<FilterAltOutlinedIcon />}
              onClick={() => setShowFilters(true)}
              size="small"
            >
              Filters
            </Button>
            <Typography variant="body2" color="text.secondary">
              {filteredJobs.length} jobs found
            </Typography>
          </Stack>
        </Stack>

        {/* Job List */}
        {filteredJobs.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchQuery ? 'No jobs match your search' : 'No jobs found in your area'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? 'Try different search terms' : 'Try expanding your search radius or check back later'}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                showDistance={true as any}
              showApplicantCount={true as any}
                onViewDetails={handleJobDetails}
                onApply={handleJobApply}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </StyledContainer>
  );
};