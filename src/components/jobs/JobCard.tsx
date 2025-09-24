import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Stack,
  Chip,
  Avatar,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import { Job } from '../../types';
import { ProfessionalCategory } from '../../types/enums';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { StatusChip } from '../common/StatusChip';
import { DistanceIndicator } from '../common/DistanceIndicator';
import { RatingDisplay } from '../common/RatingDisplay';

interface JobCardProps {
  job: Job;
  showDistance?: boolean;
  showApplicantCount?: boolean;
  onViewDetails: (jobId: string) => void;
  onApply: (jobId: string) => void;
  actionLabel?: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.2s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const getCategoryIcon = (category: ProfessionalCategory) => {
  switch (category) {
    case ProfessionalCategory.PHOTOGRAPHY:
      return <PhotoCameraOutlinedIcon />;
    case ProfessionalCategory.VIDEOGRAPHY:
      return <VideocamOutlinedIcon />;
    default:
      return <PeopleOutlineOutlinedIcon />;
  }
};

export const JobCard: React.FC<JobCardProps> = ({
  job,
  showDistance = true,
  showApplicantCount = true,
  onViewDetails,
  onApply,
  actionLabel,
}) => {
  const handleCardClick = () => {
    onViewDetails(job.id);
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApply(job.id);
  };

  return (
    <StyledCard onClick={handleCardClick}>
      <CardContent>
        <Stack spacing={2}>
          {/* Header */}
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {getCategoryIcon(job.type)}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                {job.title}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <StatusChip status={job.urgency} />
                {job.professionalTypesNeeded.map((type, index) => (
                  <Chip
                    key={index}
                    label={type}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          </Stack>

          {/* Job Details */}
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              {job.description.length > 120
                ? `${job.description.substring(0, 120)}...`
                : job.description}
            </Typography>
            
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" fontWeight="medium">
                {formatCurrency(job.budgetRange.min)} - {formatCurrency(job.budgetRange.max)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDateTime(new Date(job.date))}
              </Typography>
            </Stack>

            {showDistance && job.distance && (
              <DistanceIndicator
                distance={job.distance}
                location={job.location.city}
              />
            )}
          </Stack>

          {/* Posted By */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Posted by {job.postedBy.name}
            </Typography>
            <RatingDisplay
              rating={job.postedBy.rating}
              totalReviews={job.postedBy.totalJobs}
              showReviewCount={false as any}
            />
          </Stack>
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          {showApplicantCount && job.applicants && (
            <Typography variant="caption" color="text.secondary">
              {job.applicants.length} applicants
            </Typography>
          )}
        </Stack>
        <Button
          variant="contained"
          size="small"
          onClick={handleApplyClick}
        >
          {actionLabel || 'Apply Now'}
        </Button>
      </CardActions>
    </StyledCard>
  );
};