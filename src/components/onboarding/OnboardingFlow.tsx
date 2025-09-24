import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { OnboardingStep, RegistrationStatus, LocationPermission } from '../../types/onboarding';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useAppStore } from '../../store/appStore';
import { OnboardingLayout } from './OnboardingLayout';
import { CategorySelectionScreen } from './CategorySelectionScreen';
import { ProfessionalTypeSelectionScreen } from './ProfessionalTypeSelectionScreen';
import { LocationSetupScreen } from './LocationSetupScreen';
import { BasicProfileSetupScreen } from './BasicProfileSetupScreen';
import { ProfessionalDetailsScreen } from './ProfessionalDetailsScreen';
import { AvailabilitySetupScreen } from './AvailabilitySetupScreen';
import { RegistrationCompleteScreen } from './RegistrationCompleteScreen';
import { User } from '../../types';
import { analyticsService } from '../../utils/analyticsEvents';

interface OnboardingFlowProps {
  onRegistrationComplete: (user: User) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onRegistrationComplete,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    currentStep,
    completedSteps,
    registrationData,
    isLoading,
    locationPermission,
    uploadProgress,
    setCurrentStep,
    addCompletedStep,
    updateRegistrationData,
    setLocationPermission,
    setRegistrationStatus,
    canProceed
  } = useOnboardingStore();

  const { setUser, setAuthenticated } = useAppStore();

  useEffect(() => {
    setRegistrationStatus(RegistrationStatus.IN_PROGRESS);
  }, [setRegistrationStatus]);

  // Navigation helpers
  const navigateToStep = (step: OnboardingStep) => {
    const stepRoutes: Record<OnboardingStep, string> = {
      [OnboardingStep.WELCOME]: '/welcome',
      [OnboardingStep.AUTHENTICATION]: '/auth',
      [OnboardingStep.CATEGORY_SELECTION]: '/onboarding/category',
      [OnboardingStep.TYPE_SELECTION]: '/onboarding/type',
      [OnboardingStep.LOCATION_SETUP]: '/onboarding/location',
      [OnboardingStep.BASIC_PROFILE]: '/onboarding/basic-profile',
      [OnboardingStep.PROFESSIONAL_DETAILS]: '/onboarding/professional-details',
      [OnboardingStep.AVAILABILITY_SETUP]: '/onboarding/availability',
      [OnboardingStep.REGISTRATION_COMPLETE]: '/onboarding/complete'
    };
    
    setCurrentStep(step);
    navigate(stepRoutes[step]);
  };

  const goToNextStep = () => {
    const stepOrder = [
      OnboardingStep.CATEGORY_SELECTION,
      OnboardingStep.TYPE_SELECTION,
      OnboardingStep.LOCATION_SETUP,
      OnboardingStep.BASIC_PROFILE,
      OnboardingStep.PROFESSIONAL_DETAILS,
      OnboardingStep.AVAILABILITY_SETUP,
      OnboardingStep.REGISTRATION_COMPLETE
    ];
    
    const currentIndex = stepOrder.indexOf(currentStep);
    const nextIndex = Math.min(currentIndex + 1, stepOrder.length - 1);
    const nextStep = stepOrder[nextIndex];
    
    analyticsService.trackStepNavigation(currentStep, nextStep, 'next');
    navigateToStep(nextStep);
  };

  const goToPreviousStep = () => {
    const stepOrder = [
      OnboardingStep.CATEGORY_SELECTION,
      OnboardingStep.TYPE_SELECTION,
      OnboardingStep.LOCATION_SETUP,
      OnboardingStep.BASIC_PROFILE,
      OnboardingStep.PROFESSIONAL_DETAILS,
      OnboardingStep.AVAILABILITY_SETUP,
      OnboardingStep.REGISTRATION_COMPLETE
    ];
    
    const currentIndex = stepOrder.indexOf(currentStep);
    const prevIndex = Math.max(currentIndex - 1, 0);
    const prevStep = stepOrder[prevIndex];
    
    analyticsService.trackStepNavigation(currentStep, prevStep, 'back');
    navigateToStep(prevStep);
  };

  const handleStepComplete = (stepData?: any) => {
    addCompletedStep(currentStep);
    if (stepData) {
      updateRegistrationData(stepData);
    }
    goToNextStep();
  };

  const handleCategorySelect = (category: any) => {
    updateRegistrationData({ selectedCategory: category });
    addCompletedStep(OnboardingStep.CATEGORY_SELECTION);
    navigateToStep(OnboardingStep.TYPE_SELECTION);
  };

  const handleTypeSelect = (type: string) => {
    updateRegistrationData({ selectedType: type });
    addCompletedStep(OnboardingStep.TYPE_SELECTION);
    navigateToStep(OnboardingStep.LOCATION_SETUP);
  };

  const handleLocationUpdate = (locationData: any) => {
    updateRegistrationData({ location: locationData });
    addCompletedStep(OnboardingStep.LOCATION_SETUP);
    navigateToStep(OnboardingStep.BASIC_PROFILE);
  };

  const handleProfileUpdate = (profileData: any) => {
    updateRegistrationData({ basicProfile: profileData });
    addCompletedStep(OnboardingStep.BASIC_PROFILE);
    navigateToStep(OnboardingStep.PROFESSIONAL_DETAILS);
  };

  const handleDetailsUpdate = (detailsData: any) => {
    updateRegistrationData({ professionalDetails: detailsData });
    addCompletedStep(OnboardingStep.PROFESSIONAL_DETAILS);
    navigateToStep(OnboardingStep.AVAILABILITY_SETUP);
  };

  const handleAvailabilityUpdate = (availabilityData: any) => {
    updateRegistrationData({ availability: availabilityData });
    addCompletedStep(OnboardingStep.AVAILABILITY_SETUP);
    navigateToStep(OnboardingStep.REGISTRATION_COMPLETE);
  };

  const handlePhotoUpload = (file: File) => {
    // Handle photo upload logic here
    console.log('Uploading photo:', file);
  };

  const handleRequestLocation = () => {
    // Request location permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission(LocationPermission.GRANTED);
          updateRegistrationData({
            location: {
              ...registrationData.location,
              coordinates: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
            },
          });
        },
        () => {
          setLocationPermission(LocationPermission.DENIED);
        }
      );
    } else {
      setLocationPermission(LocationPermission.NOT_SUPPORTED);
    }
  };

  const handleRegistrationComplete = () => {
    // Create user object from registration data
    const user: User = {
      id: 'user_' + Date.now(),
      name: registrationData.basicProfile.fullName,
      email: registrationData.email,
      phone: registrationData.basicProfile.primaryMobile,
      profilePhoto: registrationData.basicProfile.profilePhotoUrl,
      professionalCategory: registrationData.selectedCategory!,
      professionalType: registrationData.selectedType,
      location: {
        city: registrationData.location.city,
        state: registrationData.location.state,
        pinCode: registrationData.location.pinCode,
        coordinates: registrationData.location.coordinates || { lat: 0, lng: 0 },
      },
      tier: 'Free' as any,
      rating: 0,
      totalReviews: 0,
      isVerified: false,
      joinedDate: new Date().toISOString(),
      experience: registrationData.professionalDetails.experienceLevel,
      gender: registrationData.basicProfile.gender,
      about: registrationData.basicProfile.about,
      specializations: registrationData.professionalDetails.specializations,
      pricing: registrationData.professionalDetails.pricing,
      equipment: registrationData.professionalDetails.equipment,
      instagramHandle: registrationData.professionalDetails.instagramHandle,
    };

    // Now set user as authenticated after completing onboarding
    setUser(user);
    setAuthenticated(true);
    setRegistrationStatus(RegistrationStatus.COMPLETED);
    onRegistrationComplete(user);
  };

  return (
    <Routes>
      {/* Screens with Layout (Onboarding-only) */}
      <Route path="/category" element={
        <OnboardingLayout
          currentStep={OnboardingStep.CATEGORY_SELECTION}
          completedSteps={completedSteps}
          onExit={() => navigate('/welcome')}
        >
          <CategorySelectionScreen
            selectedCategory={registrationData.selectedCategory}
            onCategorySelect={handleCategorySelect}
            onNext={() => handleCategorySelect(registrationData.selectedCategory!)}
            onBack={goToPreviousStep}
          />
        </OnboardingLayout>
      } />

      <Route path="/type" element={
        <OnboardingLayout
          currentStep={OnboardingStep.TYPE_SELECTION}
          completedSteps={completedSteps}
          onExit={() => navigate('/welcome')}
        >
          <ProfessionalTypeSelectionScreen
            selectedCategory={registrationData.selectedCategory!}
            selectedType={registrationData.selectedType}
            onTypeSelect={handleTypeSelect}
            onNext={() => handleTypeSelect(registrationData.selectedType)}
            onBack={goToPreviousStep}
          />
        </OnboardingLayout>
      } />

      <Route path="/location" element={
        <OnboardingLayout
          currentStep={OnboardingStep.LOCATION_SETUP}
          completedSteps={completedSteps}
          onExit={() => navigate('/welcome')}
        >
          <LocationSetupScreen
            locationData={registrationData.location}
            onLocationUpdate={(data) => updateRegistrationData({ location: { ...registrationData.location, ...data } })}
            locationPermission={locationPermission}
            onRequestLocation={handleRequestLocation}
            onNext={() => handleLocationUpdate(registrationData.location)}
            onBack={goToPreviousStep}
          />
        </OnboardingLayout>
      } />

      <Route path="/basic-profile" element={
        <OnboardingLayout
          currentStep={OnboardingStep.BASIC_PROFILE}
          completedSteps={completedSteps}
          onExit={() => navigate('/welcome')}
        >
          <BasicProfileSetupScreen
            profileData={registrationData.basicProfile}
            onProfileUpdate={(data) => updateRegistrationData({ basicProfile: { ...registrationData.basicProfile, ...data } })}
            onPhotoUpload={handlePhotoUpload}
            uploadProgress={uploadProgress}
            onNext={() => handleProfileUpdate(registrationData.basicProfile)}
            onBack={goToPreviousStep}
          />
        </OnboardingLayout>
      } />

      <Route path="/professional-details" element={
        <OnboardingLayout
          currentStep={OnboardingStep.PROFESSIONAL_DETAILS}
          completedSteps={completedSteps}
          onExit={() => navigate('/welcome')}
        >
          <ProfessionalDetailsScreen
            selectedCategory={registrationData.selectedCategory!}
            detailsData={registrationData.professionalDetails}
            onDetailsUpdate={(data) => updateRegistrationData({ professionalDetails: { ...registrationData.professionalDetails, ...data } })}
            onNext={() => handleDetailsUpdate(registrationData.professionalDetails)}
            onBack={goToPreviousStep}
          />
        </OnboardingLayout>
      } />

      <Route path="/availability" element={
        <OnboardingLayout
          currentStep={OnboardingStep.AVAILABILITY_SETUP}
          completedSteps={completedSteps}
          onExit={() => navigate('/welcome')}
        >
          <AvailabilitySetupScreen
            availabilityData={registrationData.availability}
            onAvailabilityUpdate={(data) => updateRegistrationData({ availability: { ...registrationData.availability, ...data } })}
            onNext={() => handleAvailabilityUpdate(registrationData.availability)}
            onBack={goToPreviousStep}
          />
        </OnboardingLayout>
      } />

      {/* Registration Complete - No Layout */}
      <Route path="/complete" element={
        <RegistrationCompleteScreen
          user={{
            id: 'user_123',
            name: registrationData.basicProfile.fullName || 'Professional User',
            email: registrationData.email,
            phone: registrationData.basicProfile.primaryMobile,
            profilePhoto: registrationData.basicProfile.profilePhotoUrl,
            professionalCategory: registrationData.selectedCategory!,
            professionalType: registrationData.selectedType,
            location: {
              city: registrationData.location.city,
              state: registrationData.location.state,
              coordinates: registrationData.location.coordinates || { lat: 0, lng: 0 },
            },
            tier: 'Free' as any,
            rating: 0,
            totalReviews: 0,
            isVerified: false,
            joinedDate: new Date().toISOString(),
            experience: registrationData.professionalDetails.experienceLevel,
          }}
          onContinue={handleRegistrationComplete}
        />
      } />

      {/* Default redirect to first onboarding step */}
      <Route path="*" element={<Navigate to="/onboarding/category" replace />} />
    </Routes>
  );
};