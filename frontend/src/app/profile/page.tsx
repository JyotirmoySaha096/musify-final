'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Paper, Divider, Chip, CircularProgress, Button } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  
  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box p={4}>
        <Typography>Please log in to view your profile.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: '24px 32px' }, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" fontWeight={800} mb={4}>
        Profile
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          bgcolor: 'rgba(255,255,255,0.05)',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3
        }}
      >
        <Avatar
          sx={{ width: 120, height: 120, bgcolor: 'primary.main', fontSize: '3rem' }}
        >
          {user.username?.charAt(0).toUpperCase() || <PersonIcon fontSize="large" />}
        </Avatar>

        <Box textAlign="center">
          <Typography variant="h5" fontWeight={700} gutterBottom>
            {user.username}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {user.email}
          </Typography>
          
          <Box mt={2} display="flex" gap={1} justifyContent="center" flexWrap="wrap">
            {user.roles?.map((role: string) => (
              <Chip 
                key={role} 
                label={role} 
                color={role === 'admin' ? 'secondary' : role === 'exclusive' ? 'primary' : 'default'}
                size="small" 
                icon={role === 'admin' ? <AdminPanelSettingsIcon /> : undefined}
                sx={{ textTransform: 'capitalize', fontWeight: 600 }}
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ width: '100%', my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

        <Box width="100%">
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Linked Accounts
          </Typography>
          <Box display="flex" flexDirection="column" gap={1.5} mt={2}>
            {['google', 'microsoft', 'facebook', 'apple'].map((provider) => {
              const isLinked = user.linkedAccounts?.[provider];
              return (
                <Box 
                  key={provider} 
                  display="flex" 
                  justifyContent="space-between" 
                  alignItems="center"
                  bgcolor="rgba(255,255,255,0.02)"
                  p={2}
                  borderRadius={2}
                  border="1px solid rgba(255,255,255,0.1)"
                >
                  <Typography sx={{ textTransform: 'capitalize', fontWeight: 500 }}>
                    {provider}
                  </Typography>
                  <Chip 
                    label={isLinked ? 'Connected' : 'Not Connected'} 
                    color={isLinked ? 'success' : 'default'} 
                    size="small" 
                    variant={isLinked ? 'filled' : 'outlined'}
                  />
                </Box>
              );
            })}
          </Box>
        </Box>

        <Divider sx={{ width: '100%', my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />


        <Box display="flex" gap={2} width="100%" justifyContent="center">
          {user.roles?.includes('admin') && (
            <Button
              variant="outlined"
              color="inherit"
              component={Link}
              href="/admin/settings"
            >
              Admin Dashboard
            </Button>
          )}
          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={logout}
          >
            Log Out
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
