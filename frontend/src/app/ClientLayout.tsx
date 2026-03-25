'use client';

import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import theme from '@/theme';
import { AuthProvider } from '@/context/AuthContext';
import { PlayerProvider } from '@/context/PlayerContext';
import Sidebar from '@/components/Sidebar/Sidebar';
import PlayerBar from '@/components/PlayerBar/PlayerBar';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <PlayerProvider>
          {/* Mobile top app bar */}
          <MobileAppBar onMenuToggle={() => setMobileOpen((o) => !o)} />

          <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <Sidebar
              mobileOpen={mobileOpen}
              onMobileClose={() => setMobileOpen(false)}
            />
            <Box
              component="main"
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  pb: { xs: '80px', sm: '90px' },
                  pt: { xs: '56px', md: 0 },
                  bgcolor: 'background.default',
                }}
              >
                {children}
              </Box>
            </Box>
          </Box>
          <PlayerBar />
        </PlayerProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

/** Compact app bar shown only on mobile (< md breakpoint) */
function MobileAppBar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!isMobile) return null;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: '#000000',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: (t) => t.zIndex.drawer + 1,
      }}
    >
      <Toolbar variant="dense" sx={{ minHeight: 56 }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open menu"
          onClick={onMenuToggle}
          sx={{ mr: 1 }}
        >
          <MenuIcon />
        </IconButton>
        <Avatar
          sx={{
            width: 28,
            height: 28,
            background: 'linear-gradient(135deg, #1DB954, #1ed760)',
            fontSize: 14,
            mr: 1,
          }}
        >
          ♪
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
          Musify
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
