'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
    } else if (!user.roles?.includes('admin')) {
      router.push('/');
    } else {
      router.push('/admin/settings');
    }
  }, [user, loading, router]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
      <CircularProgress />
    </Box>
  );
}
