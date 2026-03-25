'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { albumsApi, artistsApi, songsApi } from '@/lib/api';
import Card, { CardGrid } from '@/components/Card/Card';
import { usePlayer } from '@/context/PlayerContext';

export default function HomePage() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { playTrack } = usePlayer();

  useEffect(() => {
    Promise.all([
      albumsApi.getAll(8),
      artistsApi.getAll(6),
      songsApi.getAll(6),
    ])
      .then(([a, ar, s]) => {
        setAlbums(a);
        setArtists(ar);
        setSongs(s);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <Box sx={{ p: '24px 32px' }}>
        <Skeleton variant="text" width={300} height={48} sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.1)' }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 1, mb: 4 }}>
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} variant="rounded" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.07)' }} />
          ))}
        </Box>
        <Skeleton variant="text" width={200} height={36} sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 3 }}>
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} variant="rounded" height={240} sx={{ bgcolor: 'rgba(255,255,255,0.07)' }} />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: '24px 32px' }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          mb: 3,
          background: 'linear-gradient(90deg, #fff 0%, #b3b3b3 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {getGreeting()}
      </Typography>

      {/* Quick Play Grid */}
      {albums.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 1,
            mb: 4,
          }}
        >
          {albums.slice(0, 6).map((album) => (
            <Paper
              key={album.id}
              component={Link}
              href={`/album/${album.id}`}
              elevation={0}
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'rgba(255,255,255,0.07)',
                borderRadius: 1,
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                position: 'relative',
                textDecoration: 'none',
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.15)',
                  '& .quick-play-btn': { opacity: 1 },
                },
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: '#242424',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  flexShrink: 0,
                }}
              >
                💿
              </Box>
              <Typography variant="body2" fontWeight={700} noWrap sx={{ flex: 1, px: 2 }}>
                {album.title}
              </Typography>
              <Fab
                className="quick-play-btn"
                size="small"
                color="primary"
                sx={{
                  position: 'absolute',
                  right: 12,
                  opacity: 0,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                }}
              >
                <PlayArrowIcon />
              </Fab>
            </Paper>
          ))}
        </Box>
      )}

      {/* Featured Albums */}
      <Box component="section" sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
          <Typography variant="h5" fontWeight={700}>
            Popular Albums
          </Typography>
          <Typography
            component={Link}
            href="/search"
            variant="caption"
            sx={{
              fontWeight: 700,
              color: 'text.disabled',
              textTransform: 'uppercase',
              letterSpacing: 1,
              '&:hover': { color: 'text.primary' },
            }}
          >
            Show All
          </Typography>
        </Box>
        <CardGrid>
          {albums.map((album, i) => (
            <Card
              key={album.id}
              id={album.id}
              title={album.title}
              subtitle={album.artist?.name || 'Unknown Artist'}
              href={`/album/${album.id}`}
              emoji="💿"
              animationDelay={i * 60}
            />
          ))}
        </CardGrid>
      </Box>

      {/* Artists */}
      <Box component="section" sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
          <Typography variant="h5" fontWeight={700}>
            Popular Artists
          </Typography>
          <Typography
            component={Link}
            href="/search"
            variant="caption"
            sx={{
              fontWeight: 700,
              color: 'text.disabled',
              textTransform: 'uppercase',
              letterSpacing: 1,
              '&:hover': { color: 'text.primary' },
            }}
          >
            Show All
          </Typography>
        </Box>
        <CardGrid>
          {artists.map((artist, i) => (
            <Card
              key={artist.id}
              id={artist.id}
              title={artist.name}
              subtitle="Artist"
              href={`/artist/${artist.id}`}
              emoji="🎤"
              round
              animationDelay={i * 60}
            />
          ))}
        </CardGrid>
      </Box>

      {/* Recently Added Songs */}
      {songs.length > 0 && (
        <Box component="section" sx={{ mb: 5 }}>
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="h5" fontWeight={700}>
              Tracks For You
            </Typography>
          </Box>
          <CardGrid>
            {songs.map((song, i) => (
              <Card
                key={song.id}
                id={song.id}
                title={song.title}
                subtitle={song.artist?.name || 'Unknown Artist'}
                href={`/album/${song.album?.id}`}
                emoji="🎵"
                onPlay={() => playTrack(song, songs, i)}
                animationDelay={i * 60}
              />
            ))}
          </CardGrid>
        </Box>
      )}
    </Box>
  );
}
