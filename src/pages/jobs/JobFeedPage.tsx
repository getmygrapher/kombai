import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { JobFeed } from '../../components/jobs/JobFeed';
import { JobFilters } from '../../components/jobs/JobFilters';
import { useJobDiscoveryStore } from '../../store/jobDiscoveryStore';

export const JobFeedPage: React.FC = () => {
  const { jobs, isLoading, loadJobs } = useJobDiscoveryStore();

  React.useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Browse Jobs
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Discover opportunities near you
        </Typography>
      </Box>

      {/* Filters */}
      <Box sx={{ px: 2, pb: 2 }}>
        <JobFilters />
      </Box>

      {/* Job Feed */}
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <JobFeed />
      </Box>
    </Box>
  );
};