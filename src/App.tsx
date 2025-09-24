import React, { useState, useEffect, Suspense } from 'react';
import { Box, ThemeProvider, CssBaseline, Button, CircularProgress, Stack, Typography, Alert } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Routes, Route, useNavigate, useLocation, Navigate, useParams, Outlet } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppStore } from './store/appStore';
import { useOnboardingStore } from './store/onboardingStore';
import { useProfileViewStore } from './store/profileViewStore';
import { AppBottomNavigation } from './components/navigation/BottomNavigation';
import { EnhancedHomePage } from './components/homepage/EnhancedHomePage';
import { SearchPage } from './components/search/SearchPage';
import { JobsPage } from './components/jobs/JobsPage';
import { JobFeedPage } from './pages/jobs/JobFeedPage';
import { JobDetailPage } from './pages/jobs/JobDetailPage';
import { JobCreationPage } from './pages/jobs/JobCreationPage';
import { JobManagementPage } from './pages/jobs/JobManagementPage';
import { CalendarPage } from './components/calendar/CalendarPage';
import { EnhancedMessagesPage } from './components/messages/EnhancedMessagesPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { EnhancedProfileViewContainer } from './components/profile/EnhancedProfileViewContainer';
// Remove old landing component import and switch to routed pages
// import { CommunityPosingLibrary } from './components/community/CommunityPosingLibrary';
const CommunityFeedPage = React.lazy(() => import('./pages/community/CommunityFeedPage').then(m => ({ default: m.CommunityFeedPage })));
const CommunityLibraryPage = React.lazy(() => import('./pages/community/CommunityLibraryPage').then(m => ({ default: m.CommunityLibraryPage })));
const PoseDetailPage = React.lazy(() => import('./pages/community/PoseDetailPage').then(m => ({ default: m.PoseDetailPage })));
const ContributionWizard = React.lazy(() => import('./pages/community/ContributionWizard').then(m => ({ default: m.ContributionWizard })));
const ModerationDashboard = React.lazy(() => import('./pages/community/ModerationDashboard').then(m => ({ default: m.ModerationDashboard })));
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { User } from './types';
import { OnboardingStep } from './types/onboarding';
import theme from './theme';
import { mockRootProps } from './data/communityPosingLibraryMockData';
import { WelcomeScreen } from './components/welcome/WelcomeScreen';
import { AuthenticationScreen } from './components/auth/AuthenticationScreen';
import { sessionManager } from './services/auth/session';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Profile view handlers
const handleContactProfessional = (professionalId: string, method: string) => {
  console.log('Contact professional:', professionalId, 'via', method);
};

const handleBookProfessional = (professionalId: string) => {
  console.log('Book professional:', professionalId);
};

const handleSaveProfile = (professionalId: string) => {
  console.log('Save profile:', professionalId);
};

const handleShareProfile = (professionalId: string) => {
  console.log('Share profile:', professionalId);
};

const handleReportProfile = (professionalId: string) => {
  console.log('Report profile:', professionalId);
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentTab, isAuthenticated, setUser, setAuthenticated } = useAppStore();
  const { loadDraft, setCurrentStep, registrationData, updateRegistrationData, addCompletedStep } = useOnboardingStore();
  const { setCurrentlyViewingProfile, clearProfileViewState } = useProfileViewStore();
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  
  // Derive moderator flag (mock)
  const isModerator = mockRootProps.isModerator;

  // Initialize auth state from persisted session on app start to avoid unwanted redirects on reload
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (sessionManager.isSessionValid()) {
          const session = sessionManager.getSession();
          if (session) {
            setUser(session.user);
            setAuthenticated(true);
          }
        } else {
          setAuthenticated(false);
        }
      } finally {
        setAuthInitialized(true);
      }
    };
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load draft on app start without overriding current deep link route
  useEffect(() => {
    if (!authInitialized) return; // wait until auth is initialized to prevent premature redirects
    if (!isAuthenticated) {
      const hasDraft = loadDraft();
      const path = location.pathname;
      const isPublicPath = path === '/welcome' || path === '/auth' || path === '/';
      // Only redirect to welcome from root; do not override existing deep links
      if (hasDraft && path === '/' && !isPublicPath) {
        navigate('/welcome');
      }
    }
  }, [authInitialized, isAuthenticated, loadDraft, navigate, location.pathname]);

  // Handle successful registration completion
  const handleRegistrationComplete = (user: User) => {
    setUser(user);
    setAuthenticated(true);
    setCurrentTab('home');
    navigate('/home');
  };

  const handleAuthSuccessTopLevel = (user: User) => {
    updateRegistrationData({
      authMethod: 'google',
      email: user.email,
      isEmailVerified: true,
      basicProfile: {
        ...registrationData.basicProfile,
        fullName: user.name || '',
        primaryMobile: user.phone || '',
      },
    } as any);
    addCompletedStep(OnboardingStep.AUTHENTICATION);
    navigate('/onboarding/category');
  };

  // Route mapping for onboarding steps
  const getStepFromPath = (path: string): OnboardingStep => {
    const stepMap: Record<string, OnboardingStep> = {
      '/onboarding/category': OnboardingStep.CATEGORY_SELECTION,
      '/onboarding/type': OnboardingStep.TYPE_SELECTION,
      '/onboarding/location': OnboardingStep.LOCATION_SETUP,
      '/onboarding/basic-profile': OnboardingStep.BASIC_PROFILE,
      '/onboarding/professional-details': OnboardingStep.PROFESSIONAL_DETAILS,
      '/onboarding/availability': OnboardingStep.AVAILABILITY_SETUP,
      '/onboarding/complete': OnboardingStep.REGISTRATION_COMPLETE
    };
    return stepMap[path] || OnboardingStep.WELCOME;
  };

  // Sync URL with onboarding step
  useEffect(() => {
    if (!isAuthenticated && location.pathname.startsWith('/onboarding')) {
      const step = getStepFromPath(location.pathname);
      setCurrentStep(step);
    }
  }, [location.pathname, isAuthenticated, setCurrentStep]);

  // Handler functions for HomePage
  const handleJobDetails = (jobId: string) => {
    navigate('/jobs');
    console.log('View job details:', jobId);
  };

  const handleJobApply = (jobId: string) => {
    console.log('Apply to job:', jobId);
  };

  const handleCreateJob = () => {
    navigate('/jobs');
  };

  // Handler functions for SearchPage and Profile Navigation
  const handleViewProfile = (professionalId: string) => {
    setSelectedProfessionalId(professionalId);
    setCurrentlyViewingProfile(professionalId);
    navigate(`/profile-view/${professionalId}`);
  };

  const handleSendMessage = (professionalId: string) => {
    navigate('/messages');
    console.log('Send message to:', professionalId);
  };

  // Inline route wrapper to read pose id param for PoseDetailPage
  const PoseDetailRoute: React.FC = () => {
    const { id } = useParams();
    return (
      <MainAppLayout currentTab="community" setCurrentTab={setCurrentTab}>
        <PoseDetailPage poseId={id || ''} onClose={() => navigate('/community/browse')} />
      </MainAppLayout>
    );
  };

  // Wrapper for EnhancedProfileViewContainer to handle params and user context
  const EnhancedProfileViewRoute: React.FC = () => {
    const { id } = useParams();
    const { user } = useAppStore();
    
    if (!id) {
      return <div>Error: No profile ID provided</div>;
    }
    
    return (
      <EnhancedProfileViewContainer 
        professionalId={id}
        viewMode="detailed"
        currentUserId={user?.id}
        onContactProfessional={handleContactProfessional}
        onBookProfessional={handleBookProfessional}
        onSaveProfile={handleSaveProfile}
        onShareProfile={handleShareProfile}
        onReportProfile={handleReportProfile}
      />
    );
  };

  // Profile tab route components with lazy loading
  const ProfileViewContainer = React.lazy(() => 
    import('./components/profile/ProfileViewContainer').then(module => ({
      default: module.ProfileViewContainer
    }))
  );

  const ProfileOverview = React.lazy(() => 
    import('./components/profile/ProfileOverview').then(module => ({
      default: module.ProfileOverview
    }))
  );

  const PortfolioGallery = React.lazy(() => 
    import('./components/profile/PortfolioGallery').then(module => ({
      default: module.PortfolioGallery
    }))
  );

  const EquipmentShowcase = React.lazy(() => 
    import('./components/profile/EquipmentShowcase').then(module => ({
      default: module.EquipmentShowcase
    }))
  );

  const ReviewsSection = React.lazy(() => 
    import('./components/profile/ReviewsSection').then(module => ({
      default: module.ReviewsSection
    }))
  );

  const AvailabilityWidget = React.lazy(() => 
    import('./components/profile/AvailabilityWidget').then(module => ({
      default: module.AvailabilityWidget
    }))
  );

  // Tab skeleton loading component
  const TabSkeleton = () => (
    <Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4, minHeight: '300px' }}>
      <CircularProgress />
      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        Loading...
      </Typography>
    </Stack>
  );

  // If auth is not initialized yet, render a minimal splash to preserve current route without redirecting
  if (!authInitialized) {
    return (
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
              <CircularProgress />
            </Box>
          </ThemeProvider>
        </LocalizationProvider>
      </QueryClientProvider>
    );
  }

  // Not found profile component
  const NotFoundProfile = () => (
    <Stack sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '50vh',
      p: 4,
      textAlign: 'center'
    }}>
      <Alert severity="error" sx={{ maxWidth: 400 }}>
        <Typography variant="h6" gutterBottom>
          Profile Not Found
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          The profile you're looking for doesn't exist or has been removed.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/home')}
          sx={{ mt: 1 }}
        >
          Go Back Home
        </Button>
      </Alert>
    </Stack>
  );

  // Legacy redirect component
  const LegacyProfileRedirect = () => {
    const { id } = useParams<{ id: string }>();
    return <Navigate to={`/profile/${id}`} replace />;
  };

  // Route wrapper components with Suspense
  const ProfileOverviewRoute = () => (
    <Suspense fallback={<TabSkeleton />}>
      <ProfileOverview />
    </Suspense>
  );
  
  const PortfolioRoute = () => (
    <Suspense fallback={<TabSkeleton />}>
      <PortfolioGallery />
    </Suspense>
  );
  
  const EquipmentRoute = () => (
    <Suspense fallback={<TabSkeleton />}>
      <EquipmentShowcase />
    </Suspense>
  );
  
  const ReviewsRoute = () => (
    <Suspense fallback={<TabSkeleton />}>
      <ReviewsSection />
    </Suspense>
  );
  
  const AvailabilityRoute = () => (
    <Suspense fallback={<TabSkeleton />}>
      <AvailabilityWidget />
    </Suspense>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          
          <Routes>
            {/* Public Welcome and Authentication Routes */}
            <Route
              path="/welcome"
              element={
                isAuthenticated ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Box sx={{ minHeight: '100vh' }}>
                    <WelcomeScreen onContinue={() => navigate('/auth')} />
                  </Box>
                )
              }
            />
            <Route
              path="/auth"
              element={
                isAuthenticated ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Box sx={{ minHeight: '100vh' }}>
                    <AuthenticationScreen onAuthSuccess={handleAuthSuccessTopLevel} />
                  </Box>
                )
              }
            />

            {/* Onboarding Routes */}
            <Route path="/onboarding/*" element={
              !isAuthenticated ? (
                <OnboardingFlow onRegistrationComplete={handleRegistrationComplete} />
              ) : (
                <Navigate to="/home" replace />
              )
            } />
            
            {/* Protected Main App Routes */}
            <Route path="/home" element={
              isAuthenticated ? (
                <MainAppLayout currentTab="home" setCurrentTab={setCurrentTab}>
                  <EnhancedHomePage 
                    onJobDetails={handleJobDetails}
                    onJobApply={handleJobApply}
                    onCreateJob={handleCreateJob}
                    onViewProfile={handleViewProfile}
                    onSendMessage={handleSendMessage}
                  />
                </MainAppLayout>
              ) : (
                <Navigate to="/welcome" replace />
              )
            } />
            
            <Route path="/search" element={
              isAuthenticated ? (
                <MainAppLayout currentTab="search" setCurrentTab={setCurrentTab}>
                  <SearchPage 
                    onViewProfile={handleViewProfile}
                    onSendMessage={handleSendMessage}
                  />
                </MainAppLayout>
              ) : (
                <Navigate to="/welcome" replace />
              )
            } />
            
            {/* Job Routes */}
            <Route path="/jobs" element={
              isAuthenticated ? (
                <MainAppLayout currentTab="jobs" setCurrentTab={setCurrentTab}>
                  <JobFeedPage />
                </MainAppLayout>
              ) : (
                <Navigate to="/welcome" replace />
              )
            } />
            
            <Route path="/jobs/new" element={
              isAuthenticated ? (
                <MainAppLayout currentTab="jobs" setCurrentTab={setCurrentTab}>
                  <JobCreationPage />
                </MainAppLayout>
              ) : (
                <Navigate to="/welcome" replace />
              )
            } />
            
            <Route path="/jobs/:jobId" element={
              isAuthenticated ? (
                <MainAppLayout currentTab="jobs" setCurrentTab={setCurrentTab}>
                  <JobDetailPage />
                </MainAppLayout>
              ) : (
                <Navigate to="/welcome" replace />
              )
            } />
            
            <Route path="/jobs/manage" element={
              isAuthenticated ? (
                <MainAppLayout currentTab="jobs" setCurrentTab={setCurrentTab}>
                  <JobManagementPage />
                </MainAppLayout>
              ) : (
                <Navigate to="/welcome" replace />
              )
            } />
            
            <Route path="/calendar" element={
              <Navigate to="/availability/calendar" replace />
            } />
            
            <Route path="/availability" element={
              isAuthenticated ? (
                <Navigate to="/availability/calendar" replace />
              ) : (
                <Navigate to="/welcome" replace />
              )
            } />
            
            <Route path="/availability/calendar" element={
              isAuthenticated ? (
                <MainAppLayout currentTab="calendar" setCurrentTab={setCurrentTab}>
                  <CalendarPage />
                </MainAppLayout>
              ) : (
                <Navigate to="/welcome" replace />
              )
            } />
            
            <Route path="/messages" element={
              isAuthenticated ? (
                <MainAppLayout currentTab="messages" setCurrentTab={setCurrentTab}>
                  <EnhancedMessagesPage />
                </MainAppLayout>
              ) : (
                <Navigate to="/welcome" replace />
              )
            } />
            
            {/* Profile View Routes - PUBLIC ACCESS (must come before /profile) */}
            <Route path="/profile/:id" element={<EnhancedProfileViewRoute />} />
            
            <Route path="/profile" element={
              isAuthenticated ? (
                <MainAppLayout currentTab="profile" setCurrentTab={setCurrentTab}>
                  <ProfilePage />
                </MainAppLayout>
              ) : (
                <Navigate to="/welcome" replace />
              )
            } />
            
            {/* Community nested routes */}
            <Route path="/community" element={
              isAuthenticated ? (
                <MainAppLayout currentTab="community" setCurrentTab={setCurrentTab}>
                  <CommunityFeedPage />
                </MainAppLayout>
              ) : (
                <Navigate to="/welcome" replace />
              )
            } />
            
            <Route path="/community/browse" element={
              isAuthenticated ? (
                <MainAppLayout currentTab="community" setCurrentTab={setCurrentTab}>
                  <CommunityLibraryPage onPoseSelect={(poseId) => navigate(`/community/pose/${poseId}`)} />
                </MainAppLayout>
              ) : (
                <Navigate to="/welcome" replace />
              )
            } />

            <Route path="/community/pose/:id" element={
              isAuthenticated ? (
                <PoseDetailRoute />
              ) : (
                <Navigate to="/welcome" replace />
              )
            } />

            <Route path="/community/contribute" element={
              isAuthenticated ? (
                <MainAppLayout currentTab="community" setCurrentTab={setCurrentTab}>
                  <ContributionWizard onComplete={() => navigate('/community/browse')} onCancel={() => navigate('/community/browse')} />
                </MainAppLayout>
              ) : (
                <Navigate to="/welcome" replace />
              )
            } />

            <Route path="/community/moderation" element={
              isAuthenticated ? (
                isModerator ? (
                  <MainAppLayout currentTab="community" setCurrentTab={setCurrentTab}>
                    <ModerationDashboard isModerator={true} onNavigateBack={() => navigate('/community/browse')} />
                  </MainAppLayout>
                ) : (
                  <Navigate to="/community/browse" replace />
                )
              ) : (
                <Navigate to="/welcome" replace />
              )
            } />
            
            {/* Test route */}
            <Route path="/test-profile" element={
              <Box sx={{ p: 4 }}>
                <div>Test Profile Route Working!</div>
              </Box>
            } />

            {/* Legacy profile-view route redirect */}
            <Route path="/profile-view/:id" element={<LegacyProfileRedirect />} />
            
            {/* Default redirect */}
            <Route path="/" element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/welcome" replace />
              )
            } />
            <Route path="/onboarding/welcome" element={<Navigate to="/welcome" replace />} />
            <Route path="/onboarding/auth" element={<Navigate to="/auth" replace />} />
          </Routes>
        </ThemeProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
};

// Main App Layout Component
interface MainAppLayoutProps {
  children: React.ReactNode;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const MainAppLayout: React.FC<MainAppLayoutProps> = ({ children, currentTab, setCurrentTab }) => {
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    if (tab === 'calendar') {
      navigate('/availability/calendar');
    } else {
      navigate(`/${tab}`);
    }
  };

  return (
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
        {children}
      </Box>

      {/* Bottom Navigation */}
      <AppBottomNavigation
        value={currentTab}
        onChange={handleTabChange}
      />
    </Box>
  );
};

export default App;