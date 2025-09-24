import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined';
import WorkOutlinedIcon from '@mui/icons-material/WorkOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import { useAppStore } from '../../store/appStore';

interface AppBottomNavigationProps {
  value: string;
  onChange: (newValue: string) => void;
}

const StyledBottomNavigation = styled(BottomNavigation)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  '& .MuiBottomNavigationAction-root': {
    minWidth: 'auto',
    padding: '6px 12px 8px',
    '&.Mui-selected': {
      color: theme.palette.primary.main,
    },
  },
}));

export const AppBottomNavigation: React.FC<AppBottomNavigationProps> = ({
  value,
  onChange,
}) => {
  const { notifications } = useAppStore();
  const unreadMessages = notifications.filter(n => !n.isRead && n.type === 'message').length;

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    onChange(newValue);
  };

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}
      elevation={3}
    >
      <StyledBottomNavigation value={value} onChange={handleChange}>
        <BottomNavigationAction
          label="Home"
          value="home"
          icon={<HomeOutlinedIcon />}
        />
        <BottomNavigationAction
          label="Search"
          value="search"
          icon={<TravelExploreOutlinedIcon />}
        />
        <BottomNavigationAction
          label="Jobs"
          value="jobs"
          icon={<WorkOutlinedIcon />}
        />
        <BottomNavigationAction
          label="Calendar"
          value="calendar"
          icon={<CalendarMonthOutlinedIcon />}
        />
        <BottomNavigationAction
          label="Community"
          value="community"
          icon={<PhotoLibraryOutlinedIcon />}
        />
        <BottomNavigationAction
          label="Messages"
          value="messages"
          icon={
            <Badge badgeContent={unreadMessages} color="error">
              <ChatBubbleOutlinedIcon />
            </Badge>
          }
        />
        <BottomNavigationAction
          label="Profile"
          value="profile"
          icon={<PermIdentityOutlinedIcon />}
        />
      </StyledBottomNavigation>
    </Paper>
  );
};