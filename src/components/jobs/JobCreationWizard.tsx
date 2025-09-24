import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Stack,
  IconButton,
  Typography,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { useAppStore } from '../../store/appStore';
import { useCreateJob } from '../../hooks/useJobs';
import { Job } from '../../types';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { ScheduleLocationStep } from './steps/ScheduleLocationStep';
import { BudgetRequirementsStep } from './steps/BudgetRequirementsStep';
import { ReviewPublishStep } from './steps/ReviewPublishStep';

interface JobCreationWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete?: (job: Job) => void;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: '800px',
    width: '100%',
    margin: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1),
      maxHeight: 'calc(100vh - 16px)'
    }
  }
}));

const steps = [
  'Basic Information',
  'Schedule & Location', 
  'Budget & Requirements',
  'Review & Publish'
];

export const JobCreationWizard: React.FC<JobCreationWizardProps> = ({
  open,
  onClose,
  onComplete
}) => {
  const {
    currentJobDraft,
    jobCreationStep,
    isSubmittingJob,
    jobCreationErrors,
    setJobDraft,
    setJobCreationStep,
    setIsSubmittingJob,
    setJobCreationErrors,
    clearJobDraft
  } = useAppStore();

  const createJobMutation = useCreateJob();
  
  const handleNext = () => {
    if (jobCreationStep < steps.length) {
      setJobCreationStep(jobCreationStep + 1);
    }
  };

  const handleBack = () => {
    if (jobCreationStep > 1) {
      setJobCreationStep(jobCreationStep - 1);
    }
  };

  const handleClose = () => {
    clearJobDraft();
    onClose();
  };

  const handleJobDataChange = (data: Partial<Job>) => {
    setJobDraft({ ...currentJobDraft, ...data });
    // Clear related errors
    const newErrors = { ...jobCreationErrors };
    Object.keys(data).forEach(key => {
      delete newErrors[key];
    });
    setJobCreationErrors(newErrors);
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!currentJobDraft?.title?.trim()) {
          errors.title = 'Job title is required';
        }
        if (!currentJobDraft?.type) {
          errors.type = 'Work type is required';
        }
        if (!currentJobDraft?.professionalTypesNeeded?.length) {
          errors.professionalTypesNeeded = 'At least one professional type is required';
        }
        break;
      case 2:
        if (!currentJobDraft?.date) {
          errors.date = 'Job date is required';
        }
        if (!currentJobDraft?.location?.address?.trim()) {
          errors.location = 'Job location is required';
        }
        if (!currentJobDraft?.location?.pinCode?.trim()) {
          errors.pinCode = 'PIN code is required';
        }
        break;
      case 3:
        if (!currentJobDraft?.budgetRange?.min || currentJobDraft.budgetRange.min <= 0) {
          errors.budgetMin = 'Minimum budget is required';
        }
        if (!currentJobDraft?.budgetRange?.max || currentJobDraft.budgetRange.max <= 0) {
          errors.budgetMax = 'Maximum budget is required';
        }
        if (currentJobDraft?.budgetRange?.min && currentJobDraft?.budgetRange?.max && 
            currentJobDraft.budgetRange.min >= currentJobDraft.budgetRange.max) {
          errors.budgetRange = 'Maximum budget must be greater than minimum';
        }
        if (!currentJobDraft?.description?.trim()) {
          errors.description = 'Job description is required';
        }
        if (!currentJobDraft?.urgency) {
          errors.urgency = 'Urgency level is required';
        }
        break;
    }

    setJobCreationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep(4) || !currentJobDraft) return;
    
    setIsSubmittingJob(true);
    try {
      const result = await createJobMutation.mutateAsync(currentJobDraft);
      if (result.success && onComplete) {
        onComplete(result.job);
      }
      handleClose();
    } catch (error) {
      setJobCreationErrors({ submit: 'Failed to create job. Please try again.' });
    } finally {
      setIsSubmittingJob(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 1:
        return (
          <BasicInfoStep
            jobData={currentJobDraft}
            errors={jobCreationErrors}
            onChange={handleJobDataChange}
          />
        );
      case 2:
        return (
          <ScheduleLocationStep
            jobData={currentJobDraft}
            errors={jobCreationErrors}
            onChange={handleJobDataChange}
          />
        );
      case 3:
        return (
          <BudgetRequirementsStep
            jobData={currentJobDraft}
            errors={jobCreationErrors}
            onChange={handleJobDataChange}
          />
        );
      case 4:
        return (
          <ReviewPublishStep
            jobData={currentJobDraft}
            onEdit={(step) => setJobCreationStep(step)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">
            Post New Job
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={4}>
          {/* Stepper */}
          <Stepper activeStep={jobCreationStep - 1} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Error Alert */}
          {jobCreationErrors.submit && (
            <Alert severity="error" onClose={() => setJobCreationErrors({ ...jobCreationErrors, submit: '' })}>
              {jobCreationErrors.submit}
            </Alert>
          )}

          {/* Step Content */}
          <Box sx={{ minHeight: 400 }}>
            {renderStepContent(jobCreationStep)}
          </Box>

          {/* Navigation Buttons */}
          <Stack direction="row" justifyContent="space-between" sx={{ pt: 2 }}>
            <Button
              onClick={handleBack}
              disabled={(jobCreationStep === 1) as any}
              variant="outlined"
            >
              Back
            </Button>

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={handleClose}
              >
                Save as Draft
              </Button>
              
              {jobCreationStep < steps.length ? (
                <Button
                  variant="contained"
                  onClick={() => {
                    if (validateStep(jobCreationStep)) {
                      handleNext();
                    }
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isSubmittingJob as any}
                >
                  {isSubmittingJob ? 'Publishing...' : 'Publish Job'}
                </Button>
              )}
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
    </StyledDialog>
  );
};