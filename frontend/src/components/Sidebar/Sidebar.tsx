'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { useAuth } from '@/context/AuthContext';
import { playlistsApi } from '@/lib/api';

const SIDEBAR_WIDTH = 280;
const PLAYER_HEIGHT = 90;

export default function Sidebar() {
  const pathname = usePathname();
  const { user, token, logout } = useAuth();
  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    if (token) {
      playlistsApi.getAll(token).then(setPlaylists).catch(() => {});
    }
  }, [token]);

  const handleCreatePlaylist = async () => {
    if (!token) return;
    const name = `My Playlist #${playlists.length + 1}`;
    try {
      const newPlaylist = await playlistsApi.create(token, { name });
      setPlaylists((prev) => [newPlaylist, ...prev]);
    } catch (err) {
      console.error('Failed to create playlist', err);
    }
  };

  const navItems = [
    { label: 'Home', icon: <HomeIcon />, href: '/' },
    { label: 'Search', icon: <SearchIcon />, href: '/search' },
    ...(user
      ? [{ label: 'Your Library', icon: <LibraryMusicIcon />, href: '/library' }]
      : []),
  ];

  return (
    <Box
      component="aside"
      sx={{
        width: SIDEBAR_WIDTH,
        height: `calc(100vh - ${PLAYER_HEIGHT}px)`,
        bgcolor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 3, pt: 2.5, pb: 1 }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            background: 'linear-gradient(135deg, #1DB954, #1ed760)',
            fontSize: 18,
          }}
        >
          ♪
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
          Spotify
        </Typography>
      </Stack>

      {/* Navigation */}
      <List sx={{ px: 1.5 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.label}
            component={Link}
            href={item.href}
            selected={pathname === item.href}
            sx={{
              color: pathname === item.href ? 'text.primary' : 'text.secondary',
              '&:hover': { color: 'text.primary', bgcolor: 'transparent' },
              py: 1.25,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: 'inherit',
                '& .MuiSvgIcon-root': { fontSize: 24 },
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }}
            />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ mx: 3, my: 1, borderColor: 'divider' }} />

      {user ? (
        <>
          {/* Library Header */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 2, py: 1.5 }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'text.primary' } }}
            >
              <LibraryMusicIcon fontSize="small" />
              <Typography variant="body2" fontWeight={600}>
                Your Library
              </Typography>
            </Stack>
            <IconButton
              size="small"
              onClick={handleCreatePlaylist}
              title="Create playlist"
              sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary', bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Stack>

          {/* Playlist List */}
          <Box sx={{ flex: 1, overflowY: 'auto', px: 1 }}>
            {/* Liked Songs */}
            <ListItemButton
              component={Link}
              href="/library?tab=liked"
              sx={{ borderRadius: 1.5, py: 1 }}
            >
              <Avatar
                variant="rounded"
                sx={{
                  width: 48,
                  height: 48,
                  mr: 1.5,
                  background: 'linear-gradient(135deg, #450af5, #c4efd9)',
                  fontSize: 20,
                }}
              >
                <FavoriteIcon sx={{ color: '#fff' }} />
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={500} noWrap>
                  Liked Songs
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  Playlist
                </Typography>
              </Box>
            </ListItemButton>

            {playlists.map((pl) => (
              <ListItemButton
                key={pl.id}
                component={Link}
                href={`/playlist/${pl.id}`}
                sx={{ borderRadius: 1.5, py: 1 }}
              >
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 48,
                    height: 48,
                    mr: 1.5,
                    bgcolor: 'background.default',
                    fontSize: 20,
                  }}
                >
                  <MusicNoteIcon sx={{ color: 'text.secondary' }} />
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={500} noWrap>
                    {pl.name}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    Playlist
                  </Typography>
                </Box>
              </ListItemButton>
            ))}
          </Box>

          {/* User Section */}
          <Box sx={{ px: 2, py: 1.5, borderTop: 1, borderColor: 'divider' }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.25}
              onClick={logout}
              sx={{
                cursor: 'pointer',
                color: 'text.secondary',
                '&:hover': { color: 'text.primary' },
              }}
            >
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: 12,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #1DB954, #1ed760)',
                }}
              >
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2" fontWeight={600}>
                {user.username}
              </Typography>
              <LogoutIcon fontSize="small" sx={{ ml: 'auto' }} />
            </Stack>
          </Box>
        </>
      ) : (
        <Box sx={{ px: 2, py: 1.5, borderTop: 1, borderColor: 'divider', mt: 'auto' }}>
          <ListItemButton
            component={Link}
            href="/login"
            sx={{
              color: 'text.secondary',
              '&:hover': { color: 'text.primary' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
              <LoginIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Log in"
              primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }}
            />
          </ListItemButton>
        </Box>
      )}
    </Box>
  );
}
