'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { playlistsApi, likedSongsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Card, { CardGrid } from '@/components/Card/Card';
import TrackList from '@/components/TrackList/TrackList';
import { useRouter } from 'next/navigation';

function LibraryContent() {
  const { user, token } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get('tab') || 'playlists';
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [likedSongs, setLikedSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setLoading(true);
      if (tab === 'liked') {
        likedSongsApi
          .getAll(token)
          .then(setLikedSongs)
          .catch(console.error)
          .finally(() => setLoading(false));
      } else {
        playlistsApi
          .getAll(token)
          .then(setPlaylists)
          .catch(console.error)
          .finally(() => setLoading(false));
      }
    } else {
      setLoading(false);
    }
  }, [token, tab]);

  if (!user) {
    return (
      <Box sx={{ p: '24px 32px' }}>
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <LibraryMusicIcon sx={{ fontSize: 48, mb: 2, color: 'text.disabled' }} />
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
            Log in to see your library
          </Typography>
          <Typography variant="body2" color="text.disabled">
            <Typography
              component={Link}
              href="/login"
              variant="body2"
              sx={{ color: 'primary.main', fontWeight: 600 }}
            >
              Log in
            </Typography>{' '}
            to create playlists and save your favorite songs.
          </Typography>
        </Box>
      </Box>
    );
  }

  const tabIndex = tab === 'liked' ? 1 : 0;

  return (
    <Box sx={{ p: '24px 32px' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 2.5 }}>
          Your Library
        </Typography>
        <Tabs
          value={tabIndex}
          onChange={(_, val) => router.push(val === 1 ? '/library?tab=liked' : '/library')}
          sx={{
            '& .MuiTab-root': {
              bgcolor: 'rgba(255,255,255,0.07)',
              color: 'text.primary',
              mr: 1,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
              '&.Mui-selected': {
                bgcolor: 'text.primary',
                color: 'background.default',
              },
            },
          }}
        >
          <Tab label="Playlists" />
          <Tab label="Liked Songs" />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 10, color: 'text.disabled' }}>
          Loading...
        </Box>
      ) : tab === 'liked' ? (
        <>
          {/* Liked Songs Header */}
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 3,
              p: 2.5,
              background: 'linear-gradient(135deg, #450af5, #c4efd9)',
              borderRadius: 2,
            }}
          >
            <FavoriteIcon sx={{ fontSize: 36 }} />
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Liked Songs
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
                {likedSongs.length} songs
              </Typography>
            </Box>
          </Paper>
          {likedSongs.length > 0 ? (
            <TrackList tracks={likedSongs} />
          ) : (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <FavoriteBorderIcon sx={{ fontSize: 48, mb: 2, color: 'text.disabled' }} />
              <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                Songs you like will appear here
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Save songs by tapping the heart icon.
              </Typography>
            </Box>
          )}
        </>
      ) : (
        <>
          {playlists.length > 0 ? (
            <CardGrid>
              {playlists.map((pl, i) => (
                <Card
                  key={pl.id}
                  id={pl.id}
                  title={pl.name}
                  subtitle="Playlist"
                  href={`/playlist/${pl.id}`}
                  emoji="🎵"
                  animationDelay={i * 60}
                />
              ))}
            </CardGrid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <MusicNoteIcon sx={{ fontSize: 48, mb: 2, color: 'text.disabled' }} />
              <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                Create your first playlist
              </Typography>
              <Typography variant="body2" color="text.disabled">
                It&apos;s easy, we&apos;ll help you.
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default function LibraryPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ p: '24px 32px', color: 'text.disabled' }}>
          Loading library...
        </Box>
      }
    >
      <LibraryContent />
    </Suspense>
  );
}
