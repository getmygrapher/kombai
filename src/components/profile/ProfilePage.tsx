import React, { useState } from 'react';
import {
  Container,
  Typography,
  Stack,
  Paper,
  Avatar,
  Button,
  Chip,
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import VerifiedIcon from '@mui/icons-material/Verified';
import InstagramIcon from '@mui/icons-material/Instagram';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import { TierType, ProfileSection } from '../../types/enums';
import { useAppStore } from '../../store/appStore';
import { RatingDisplay } from '../common/RatingDisplay';
import { StatusChip } from '../common/StatusChip';
import { formatCurrency } from '../../utils/formatters';
import { ProfileManagementContainer } from './ProfileManagementContainer';
import { mockUserProfile } from '../../data/profileManagementMockData';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(10), // Space for bottom navigation
}));

const ProfileHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  position: 'relative',
}));

const ProBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  padding: '4px 12px',
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.875rem',
  fontWeight: theme.typography.fontWeightMedium,
}));

export const ProfilePage: React.FC = () => {
  const { user } = useAppStore();
  const [showProfileManagement, setShowProfileManagement] = useState(false);
  const [initialSection, setInitialSection] = useState<ProfileSection | null>(null);

  // Use mock user if no user in store (for preview purposes)
  const currentUser = user || mockUserProfile;

  const handleEditProfile = () => {
    setInitialSection(ProfileSection.BASIC_INFO);
    setShowProfileManagement(true);
  };

  const handleManageProfile = (section?: ProfileSection) => {
    setInitialSection(section || null);
    setShowProfileManagement(true);
  };

  const handleBackToProfile = () => {
    setShowProfileManagement(false);
    setInitialSection(null);
  };

  const handleProfileUpdated = (updatedUser: any) => {
    // In a real app, this would update the user in the store
    console.log('Profile updated:', updatedUser);
  };

  const handleTierUpgraded = () => {
    // In a real app, this would update the user's tier
    console.log('Tier upgraded to Pro');
  };

  if (showProfileManagement) {
    return (
      <ProfileManagementContainer
        user={currentUser}
        onNavigateBack={handleBackToProfile}
        onProfileUpdated={handleProfileUpdated}
        onTierUpgraded={handleTierUpgraded}
      />
    );
  }

  if (!currentUser) {
    return (
      <StyledContainer>
        <Typography variant="h6" textAlign="center">
          Please sign in to view your profile
        </Typography>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <Stack spacing={3}>
        {/* Profile Header */}
        <ProfileHeader>
          {currentUser.tier === TierType.PRO && (
            <ProBadge>PRO MEMBER</ProBadge>
          )}
          
          <Stack spacing={2} alignItems="center">
            <Avatar
              src={currentUser.profilePhoto}
              sx={{ width: 100, height: 100 }}
            >
              {currentUser.name.charAt(0)}
            </Avatar>
            
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                <Typography variant="h5" fontWeight="bold">
                  {currentUser.name}
                </Typography>
                {currentUser.isVerified && (
                  <VerifiedIcon color="primary" />
                )}
              </Stack>
              
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {currentUser.professionalType}
              </Typography>
              
              <RatingDisplay
                rating={currentUser.rating}
                totalReviews={currentUser.totalReviews}
                size="medium"
              />
            </Box>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                size="small"
                onClick={handleEditProfile}
              >
                Edit Profile
              </Button>
              <IconButton 
                size="small" 
                onClick={() => handleManageProfile(ProfileSection.TIER)}
              >
                <SettingsIcon />
              </IconButton>
            </Stack>
          </Stack>
        </ProfileHeader>

        {/* Professional Details */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Professional Information
          </Typography>
          
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Category
              </Typography>
              <Typography variant="body1">
                {currentUser.professionalCategory}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Experience
              </Typography>
              <Typography variant="body1">
                {currentUser.experience || 'Not specified'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Location
              </Typography>
              <Typography variant="body1">
                {currentUser.location.city}, {currentUser.location.state}
              </Typography>
            </Box>

            {currentUser.pricing && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Pricing
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body1" fontWeight="medium">
                    {formatCurrency(currentUser.pricing.rate)} {currentUser.pricing.type}
                  </Typography>
                  {currentUser.pricing.isNegotiable && (
                    <Chip label="Negotiable" size="small" color="success" />
                  )}
                </Stack>
              </Box>
            )}

            {currentUser.instagramHandle && currentUser.tier === TierType.PRO && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Instagram
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <InstagramIcon sx={{ fontSize: 20 }} />
                  <Typography variant="body1">
                    {currentUser.instagramHandle}
                  </Typography>
                </Stack>
              </Box>
            )}
          </Stack>
        </Paper>

        {/* Equipment */}
        {currentUser.equipment && (
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6">
                Equipment
              </Typography>
              <Button
                size="small"
                onClick={() => handleManageProfile(ProfileSection.EQUIPMENT)}
              >
                Manage
              </Button>
            </Stack>
            
            <Stack spacing={2}>
              {currentUser.equipment.cameras && currentUser.equipment.cameras.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Cameras
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {currentUser.equipment.cameras.map((camera, index) => (
                      <Chip key={index} label={camera} size="small" />
                    ))}
                  </Stack>
                </Box>
              )}

              {currentUser.equipment.lenses && currentUser.equipment.lenses.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Lenses
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {currentUser.equipment.lenses.map((lens, index) => (
                      <Chip key={index} label={lens} size="small" />
                    ))}
                  </Stack>
                </Box>
              )}

              {currentUser.equipment.lighting && currentUser.equipment.lighting.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Lighting
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {currentUser.equipment.lighting.map((light, index) => (
                      <Chip key={index} label={light} size="small" />
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </Paper>
        )}

        {/* Profile Management Actions */}
        <Paper>
          <List>
            <ListItemButton onClick={() => handleManageProfile(ProfileSection.BASIC_INFO)}>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText
                primary="Edit Profile"
                secondary="Update your basic information and professional details"
              />
            </ListItemButton>
            
            <Divider />
            
            <ListItemButton onClick={() => handleManageProfile(ProfileSection.EQUIPMENT)}>
              <ListItemIcon>
                <PhotoCameraOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primary="Manage Equipment"
                secondary="Add and organize your photography equipment"
              />
            </ListItemButton>

            <Divider />
            
            <ListItemButton onClick={() => handleManageProfile(ProfileSection.PRICING)}>
              <ListItemIcon>
                <PhotoCameraOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primary="Pricing Setup"
                secondary="Configure your rates and pricing structure"
              />
            </ListItemButton>
            
            <Divider />
            
            <ListItemButton onClick={() => handleManageProfile(ProfileSection.TIER)}>
              <ListItemIcon>
                <VerifiedIcon />
              </ListItemIcon>
              <ListItemText
                primary={currentUser.tier === TierType.PRO ? "Manage Pro Subscription" : "Upgrade to Pro"}
                secondary={currentUser.tier === TierType.PRO ? "Manage your premium features" : "Unlock unlimited features"}
              />
              {currentUser.tier === TierType.FREE && (
                <StatusChip status="Upgrade" />
              )}
            </ListItemButton>

            <Divider />
            
            <ListItemButton onClick={() => handleManageProfile(ProfileSection.PRIVACY)}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Privacy & Notifications"
                secondary="Manage your privacy settings and notifications"
              />
            </ListItemButton>
          </List>
        </Paper>
      </Stack>
    </StyledContainer>
  );
};