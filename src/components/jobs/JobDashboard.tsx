import React, { useState, useEffect } from 'react';
import {
  Stack,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Box,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { JobCard } from './JobCard';
import { Job } from '../../types';
import { JobStatus } from '../../types/enums';
import { useMyJobs } from '../../hooks/useJobs';

const TabPanel = (props: { children?: React.ReactNode; value: number; index: number }) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
};

export const JobDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [jobs, setJobs] = useState<Job[]>([]);

  const {
    data: jobsData,
    isLoading,
    error,
    refetch,
  } = useMyJobs();

  useEffect(() => {
    if (jobsData?.jobs) {
      setJobs(jobsData.jobs);
    }
  }, [jobsData]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleJobDetails = (jobId: string) => {
    console.log('View job details:', jobId);
  };

  const handleJobEdit = (jobId: string) => {
    console.log('Edit job:', jobId);
  };

  const handleRefresh = () => {
    refetch();
  };

  const getJobsByStatus = (status?: JobStatus) => {
    if (!status) return jobs;
    return jobs.filter(job => job.status === status);
  };

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.ACTIVE:
        return 'success';
      case JobStatus.DRAFT:
        return 'warning';
      case JobStatus.CLOSED:
        return 'info';
      case JobStatus.EXPIRED:
        return 'error';
      case JobStatus.COMPLETED:
        return 'primary';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" action={
        <Button color="inherit" size="small" onClick={handleRefresh}>
          Retry
        </Button>
      }>
        Failed to load your jobs. Please try again.
      </Alert>
    );
  }

  const activeJobs = getJobsByStatus(JobStatus.ACTIVE);
  const draftJobs = getJobsByStatus(JobStatus.DRAFT);
  const closedJobs = getJobsByStatus(JobStatus.CLOSED);
  const allJobs = jobs;

  const tabs = [
    { label: `All (${allJobs.length})`, jobs: allJobs },
    { label: `Active (${activeJobs.length})`, jobs: activeJobs },
    { label: `Drafts (${draftJobs.length})`, jobs: draftJobs },
    { label: `Closed (${closedJobs.length})`, jobs: closedJobs },
  ];

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box>
        <Typography variant="h6" gutterBottom>
          My Posted Jobs
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and track your job postings
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      {/* Tab Content */}
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={selectedTab} index={index}>
          {tab.jobs.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No jobs found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {index === 0 ? 'You haven\'t posted any jobs yet' : 
                 index === 1 ? 'No active jobs at the moment' :
                 index === 2 ? 'No draft jobs saved' :
                 'No closed jobs'}
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {tab.jobs.map((job) => (
                <Box key={job.id} sx={{ position: 'relative' }}>
                  <Chip
                    label={job.status}
                    size="small"
                    color={getStatusColor(job.status) as any}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 1,
                    }}
                  />
                  <JobCard
                    job={job}
                    showDistance={false as any}
                    showApplicantCount={true as any}
                    onViewDetails={handleJobDetails}
                    onApply={handleJobEdit}
                    actionLabel="Manage"
                  />
                </Box>
              ))}
            </Stack>
          )}
        </TabPanel>
      ))}
    </Stack>
  );
};