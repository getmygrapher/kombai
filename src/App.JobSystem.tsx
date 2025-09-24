import React from 'react';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAppStore } from './store/appStore';
import { AppBottomNavigation } from './components/navigation/BottomNavigation';
import { HomePage } from './components/home/HomePage';
import { SearchPage } from './components/search/SearchPage';
import { JobsPage } from './components/jobs/JobsPage';
import { CalendarPage } from './components/calendar/CalendarPage';
import { MessagesPage } from './components/messages/MessagesPage';
import { ProfilePage } from './components/profile/ProfilePage';
import theme from './theme';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  const { currentTab, setCurrentTab } = useAppStore();

  // Handler functions for HomePage
  const handleJobDetails = (jobId: string) => {
    // Navigate to jobs tab and show job details
    setCurrentTab('jobs');
    // Additional logic to show specific job details can be added
    console.log('View job details:', jobId);
  };

  const handleJobApply = (jobId: string) => {
    // Handle job application
    console.log('Apply to job:', jobId);
  };

  const handleCreateJob = () => {
    // Navigate to jobs tab to create new job
    setCurrentTab('jobs');
  };

  // Handler functions for SearchPage
  const handleViewProfile = (professionalId: string) => {
    // Handle viewing professional profile
    console.log('View profile:', professionalId);
  };

  const handleSendMessage = (professionalId: string) => {
    // Navigate to messages tab
    setCurrentTab('messages');
    console.log('Send message to:', professionalId);
  };

  const renderCurrentPage = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomePage 
            onJobDetails={handleJobDetails}
            onJobApply={handleJobApply}
            onCreateJob={handleCreateJob}
          />
        );
      case 'search':
        return (
          <SearchPage 
            onViewProfile={handleViewProfile}
            onSendMessage={handleSendMessage}
          />
        );
      case 'jobs':
        return <JobsPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'messages':
        return <MessagesPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return (
          <HomePage 
            onJobDetails={handleJobDetails}
            onJobApply={handleJobApply}
            onCreateJob={handleCreateJob}
          />
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              backgroundColor: 'background.default',
            }}
          >
            {/* Main Content */}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                pb: 8, // Space for bottom navigation
                overflow: 'hidden',
              }}
            >
              {renderCurrentPage()}
            </Box>

            {/* Bottom Navigation */}
            <AppBottomNavigation
              value={currentTab}
              onChange={setCurrentTab}
            />
          </Box>
        </ThemeProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
};

export default App;