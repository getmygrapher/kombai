import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Skeleton,
  Fab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { JobCard } from './JobCard';
import { Job } from '../../types';
import { useJobDiscoveryStore } from '../../store/jobDiscoveryStore';
import { useNearbyJobs } from '../../hooks/useJobs';

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
  overflow: 'auto',
}));

const JobSkeleton = () => (
  <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
    <Stack spacing={2}>
      <Skeleton variant="text" width="80%" height={24} />
      <Skeleton variant="text" width="60%" height={20} />
      <Skeleton variant="rectangular" height={100} />
      <Stack direction="row" spacing={1}>
        <Skeleton variant="rectangular" width={80} height={24} />
        <Skeleton variant="rectangular" width={100} height={24} />
      </Stack>
    </Stack>
  </Box>
);

export const JobFeed: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    jobs,
    isLoading,
    hasMore,
    searchQuery,
    setSearchQuery,
    loadJobs,
    loadMoreJobs,
    refreshJobs
  } = useJobDiscoveryStore();

  // Load jobs on mount
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const threshold = 100; // Load more when 100px from bottom

    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      loadMoreJobs();
    }
  }, [isLoading, hasMore, loadMoreJobs]);

  // Attach scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Pull to refresh handler
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refreshJobs();
    setIsRefreshing(false);
  }, [refreshJobs]);

  const handleJobDetails = (jobId: string) => {
    console.log('View job details:', jobId);
  };

  const handleJobApply = (jobId: string) => {
    console.log('Apply to job:', jobId);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <StyledContainer ref={containerRef}>
      <Stack spacing={3}>
        {/* Search and Filters */}
        <Stack spacing={2}>
          <TextField
            fullWidth
            placeholder="Search jobs by title, description, or type..."
            value={searchQuery}
            onChange={handleSearchChange}
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
              {jobs.length} jobs found
            </Typography>
          </Stack>
        </Stack>

        {/* Job List */}
        {jobs.length === 0 && !isLoading ? (
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
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                showDistance={true as any}
                showApplicantCount={true as any}
                onViewDetails={handleJobDetails}
                onApply={handleJobApply}
              />
            ))}
            
            {/* Loading skeletons */}
            {isLoading && (
              <>
                <JobSkeleton />
                <JobSkeleton />
                <JobSkeleton />
              </>
            )}
            
            {/* Load more indicator */}
            {hasMore && !isLoading && (
              <Box textAlign="center" py={2}>
                <Typography variant="body2" color="text.secondary">
                  Scroll down to load more jobs
                </Typography>
              </Box>
            )}
          </Stack>
        )}
      </Stack>

      {/* Refresh FAB */}
      <Fab
        color="primary"
        onClick={handleRefresh}
        disabled={isRefreshing}
        sx={{
          position: 'fixed',
          bottom: isMobile ? 80 : 24,
          right: 16,
          zIndex: 1000,
        }}
      >
        {isRefreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
      </Fab>
    </StyledContainer>
  );
};