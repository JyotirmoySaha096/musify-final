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
  const isAdmin = user?.roles?.includes('admin') || false;
  const isExclusive = user?.roles?.includes('exclusive') || false;
  const tabs = [];
  if (isAdmin) tabs.push({ label: 'Users', index: 0, content: <UsersTab token={token!} currentUserId={user?.id || ''} /> });
  if (isAdmin) tabs.push({ label: 'Roles', index: 1, content: <RolesTab token={token!} /> });
  if (isAdmin || isExclusive) tabs.push({ label: 'Songs', index: tabs.length, content: <SongsTab token={token!} isAdmin={isAdmin} /> });
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (loading) return;
    const isAdmin = user?.roles?.includes('admin') || false;
    const isExclusive = user?.roles?.includes('exclusive') || false;
    if (!user || (!isAdmin && !isExclusive)) {
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
          {tabs.map((t) => <Tab key={t.label} label={t.label} />)}
        </Tabs>
      </Box>

      {tabs.map((t, idx) => (
        <TabPanel key={t.label} value={tabIndex} index={idx}>
          {t.content}
        </TabPanel>
      ))}
    </Container>
  );
}
