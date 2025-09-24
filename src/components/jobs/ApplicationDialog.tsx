import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Typography,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applicationSchema, ApplicationFormData } from '../../utils/validationSchemas';
import { Job, Professional } from '../../types';
import { useApplicationStore } from '../../store/applicationStore';

interface ApplicationDialogProps {
  job: Job;
  open: boolean;
  onClose: () => void;
  onSuccess?: (applicationId: string) => void;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: '500px',
    width: '100%',
    margin: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1),
      maxHeight: 'calc(100vh - 16px)'
    }
  }
}));

const JobInfoCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  marginBottom: theme.spacing(2)
}));

export const ApplicationDialog: React.FC<ApplicationDialogProps> = ({
  job,
  open,
  onClose,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const { submitApplication } = useApplicationStore();

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      message: '',
      proposedRate: undefined
    }
  });

  const { register, handleSubmit, formState: { errors }, reset, watch } = form;
  const watchedValues = watch();

  const handleClose = () => {
    reset();
    setSubmitError(null);
    onClose();
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitApplication({
        jobId: job.id,
        message: data.message,
        proposedRate: data.proposedRate
      });

      if (result.success) {
        handleClose();
        if (onSuccess && result.applicationId) {
          onSuccess(result.applicationId);
        }
      } else {
        setSubmitError(result.error || 'Failed to submit application');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatBudget = (min: number, max: number) => {
    return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Apply to Job
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Submit your application for this opportunity
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          {/* Job Information */}
          <JobInfoCard>
            <Typography variant="h6" gutterBottom>
              {job.title}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
              {job.professionalTypesNeeded.map((type, index) => (
                <Chip key={index} label={type} size="small" variant="outlined" />
              ))}
            </Stack>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Budget: {formatBudget(job.budgetRange.min, job.budgetRange.max)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Date: {new Date(job.date).toLocaleDateString()}
            </Typography>
          </JobInfoCard>

          {/* Error Alert */}
          {submitError && (
            <Alert severity="error" onClose={() => setSubmitError(null)}>
              {submitError}
            </Alert>
          )}

          {/* Application Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                {...register('message')}
                label="Application Message"
                multiline
                rows={4}
                fullWidth
                required
                error={!!errors.message}
                helperText={errors.message?.message || 'Tell the client why you\'re the right fit for this job'}
                placeholder="Hi! I'm interested in this opportunity. I have [X years] of experience in [relevant skills] and have worked on similar projects before..."
              />

              <TextField
                {...register('proposedRate', { valueAsNumber: true })}
                label="Proposed Rate (Optional)"
                type="number"
                fullWidth
                error={!!errors.proposedRate}
                helperText={errors.proposedRate?.message || 'Leave blank to use the client\'s budget range'}
                placeholder="Enter your proposed rate in INR"
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
                }}
              />

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Application Tips:
                </Typography>
                <Typography variant="caption" color="text.secondary" component="div">
                  • Be specific about your relevant experience<br/>
                  • Mention any unique skills or equipment you bring<br/>
                  • Show enthusiasm for the project<br/>
                  • Keep it professional but personable
                </Typography>
              </Box>
            </Stack>
          </form>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};