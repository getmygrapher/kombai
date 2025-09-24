import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  TextField,
  Divider,
  Box,
  Alert,
  Link,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import { User } from '../../types';
import { OnboardingStep } from '../../types/onboarding';
import { googleAuthAdapter } from '../../services/auth/googleAuth';
import { sessionManager } from '../../services/auth/session';
import { analyticsService } from '../../utils/analyticsEvents';

interface AuthenticationScreenProps {
  onAuthSuccess: (user: User) => void;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 400,
  margin: '0 auto',
  marginTop: theme.spacing(8),
}));

const GoogleButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#4285f4',
  color: 'white',
  '&:hover': {
    backgroundColor: '#357ae8',
  },
  padding: theme.spacing(1.5),
  fontSize: '1rem',
}));

export const AuthenticationScreen: React.FC<AuthenticationScreenProps> = ({
  onAuthSuccess,
}) => {
  const navigate = useNavigate();
  const [isEmailAuth, setIsEmailAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    analyticsService.trackStepViewed(OnboardingStep.AUTHENTICATION);
    // Initialize Google Auth
    googleAuthAdapter.initialize();
  }, []);

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    
    try {
      analyticsService.trackAuthMethod('google');
      const authResponse = await googleAuthAdapter.signIn();
      
      // Store session
      const sessionData = {
        user: authResponse.user,
        accessToken: authResponse.accessToken,
        refreshToken: authResponse.refreshToken,
        expiresAt: Date.now() + (authResponse.expiresIn * 1000)
      };
      
      sessionManager.storeSession(sessionData);
      
      analyticsService.trackStepCompleted(OnboardingStep.AUTHENTICATION, {
        method: 'google',
        email: authResponse.user.email
      });
      
      onAuthSuccess(authResponse.user);
      navigate('/onboarding/category');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to authenticate with Google';
      setError(errorMessage);
      analyticsService.trackValidationError(OnboardingStep.AUTHENTICATION, 'google_auth', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      analyticsService.trackAuthMethod('email');
      
      // Simulate email authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user for email auth
      const user: User = {
        id: `email_${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        phone: '',
        profilePhoto: 'https://i.pravatar.cc/150?img=2',
        professionalCategory: 'Photography' as any,
        professionalType: 'Portrait Photographer',
        location: {
          city: '',
          state: '',
          coordinates: { lat: 0, lng: 0 }
        },
        tier: 'Free' as any,
        rating: 0,
        totalReviews: 0,
        isVerified: false,
        joinedDate: new Date().toISOString()
      };

      // Store session
      const sessionData = {
        user,
        accessToken: `email_token_${Date.now()}`,
        refreshToken: `email_refresh_${Date.now()}`,
        expiresAt: Date.now() + (3600 * 1000) // 1 hour
      };
      
      sessionManager.storeSession(sessionData);
      
      analyticsService.trackStepCompleted(OnboardingStep.AUTHENTICATION, {
        method: 'email',
        email: email
      });
      
      onAuthSuccess(user);
      navigate('/onboarding/category');
    } catch (err) {
      const errorMessage = 'Invalid email or password';
      setError(errorMessage);
      analyticsService.trackValidationError(OnboardingStep.AUTHENTICATION, 'email_auth', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <StyledPaper elevation={3}>
        <Stack spacing={3} alignItems="center">
          {/* Logo and Title */}
          <Box textAlign="center">
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              <span className="text-gradient">GetMyGrapher</span>
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Find Creative Professionals Near You
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}

          {!isEmailAuth ? (
            <Stack spacing={2} sx={{ width: '100%' }}>
              {/* Google OAuth Button */}
              <GoogleButton
                fullWidth
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
                onClick={handleGoogleAuth}
                disabled={loading as any}
              >
                {loading ? 'Signing in...' : 'Sign in with Google'}
              </GoogleButton>

              <Divider>OR</Divider>

              {/* Email Option */}
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setIsEmailAuth(true)}
              >
                Continue with Email
              </Button>
            </Stack>
          ) : (
            <Stack spacing={2} sx={{ width: '100%' }} component="form" onSubmit={handleEmailAuth}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading as any}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              <Button
                fullWidth
                variant="text"
                onClick={() => setIsEmailAuth(false)}
              >
                Back to Google Sign In
              </Button>
            </Stack>
          )}

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={1}
            justifyContent="center"
            alignItems="center"
            sx={{ textAlign: 'center' }}
          >
            <Typography variant="caption" color="text.secondary">
              By signing in, you agree to our
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Link 
                href="#" 
                color="primary" 
                variant="caption"
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Terms of Service
              </Link>
              <Typography variant="caption" color="text.disabled">and</Typography>
              <Link 
                href="#" 
                color="primary" 
                variant="caption"
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Privacy Policy
              </Link>
            </Stack>
          </Stack>
        </Stack>
      </StyledPaper>
    </Container>
  );
};