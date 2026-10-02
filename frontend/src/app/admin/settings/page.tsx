'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Container, Typography, Box, Tabs, Tab } from '@mui/material';
import { UsersTab } from './components/UsersTab';
import { RolesTab } from './components/RolesTab';
import { SongsTab } from './components/SongsTab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function AdminSettings() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (loading) return;
    if (!user || !user.roles?.includes('admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Settings
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
        <Tabs value={tabIndex} onChange={(_, nv) => setTabIndex(nv)} aria-label="admin settings tabs">
          <Tab label="Users" />
          <Tab label="Roles" />
          <Tab label="Songs" />
        </Tabs>
      </Box>

      <TabPanel value={tabIndex} index={0}>
        <UsersTab token={token!} currentUserId={user.id} />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <RolesTab token={token!} />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <SongsTab token={token!} />
      </TabPanel>
    </Container>
  );
}
