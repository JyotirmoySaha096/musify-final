'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import TrackList from '@/components/TrackList/TrackList';
import Card, { CardGrid } from '@/components/Card/Card';
import { artistsApi } from '@/lib/api';
import { usePlayer } from '@/context/PlayerContext';

export default function ArtistPage() {
  const params = useParams();
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { playTrack, currentTrack, isPlaying, togglePlay, queue } = usePlayer();

  useEffect(() => {
    if (params.id) {
      artistsApi
        .getOne(params.id as string)
        .then(setArtist)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
        <Typography variant="body2" color="text.disabled">
          Loading artist...
        </Typography>
      </Box>
    );
  }

  if (!artist) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
        <Typography variant="body2" color="text.disabled">
          Artist not found
        </Typography>
      </Box>
    );
  }

  const allSongs = artist.songs || [];

  // Compare queue by identity to distinguish same song in different contexts
  const isThisContextActive =
    currentTrack && allSongs.length > 0 &&
    allSongs.some((s: any) => s.id === currentTrack.id) &&
    queue.length === allSongs.length &&
    queue.every((q, i) => q.id === allSongs[i]?.id);
  const isThisContextPlaying = isPlaying && isThisContextActive;

  const handlePlayAll = () => {
    if (isThisContextActive) {
      togglePlay();
    } else if (allSongs.length > 0) {
      playTrack(allSongs[0], allSongs, 0);
    }
  };

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 3,
          p: '40px 32px 24px',
          background: 'linear-gradient(180deg, rgba(140,103,172,0.4) 0%, #121212 100%)',
          minHeight: 280,
        }}
      >
        <Box
          sx={{
            width: 232,
            height: 232,
            borderRadius: '50%',
            bgcolor: '#242424',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 80,
            flexShrink: 0,
            boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
            animation: 'scaleIn 0.4s ease',
          }}
        >
          🎤
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, animation: 'fadeIn 0.4s ease' }}>
          <Typography
            variant="overline"
            sx={{ fontWeight: 700, letterSpacing: 1, mb: 1, display: 'block' }}
          >
            Artist
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              lineHeight: 1.1,
              mb: 1.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {artist.name}
          </Typography>
          {artist.bio && (
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, maxWidth: 600 }}>
              {artist.bio}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, px: 4, py: 2.5 }}>
        <Fab
          color="primary"
          onClick={handlePlayAll}
          sx={{
            width: 56,
            height: 56,
            '&:hover': { transform: 'scale(1.06)', bgcolor: 'primary.light' },
          }}
        >
          {isThisContextPlaying ? <PauseIcon sx={{ fontSize: 28 }} /> : <PlayArrowIcon sx={{ fontSize: 28 }} />}
        </Fab>
      </Box>

      {/* Content */}
      <Box sx={{ px: 4, pb: 4 }}>
        {allSongs.length > 0 && (
          <>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2, mt: 2 }}>
              Popular
            </Typography>
            <TrackList tracks={allSongs.slice(0, 5)} showHeader={false} />
          </>
        )}

        {artist.albums?.length > 0 && (
          <>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2, mt: 4 }}>
              Discography
            </Typography>
            <CardGrid>
              {artist.albums.map((album: any, i: number) => (
                <Card
                  key={album.id}
                  id={album.id}
                  title={album.title}
                  subtitle={`${album.releaseYear || ''} · Album`}
                  href={`/album/${album.id}`}
                  emoji="💿"
                  animationDelay={i * 60}
                />
              ))}
            </CardGrid>
          </>
        )}
      </Box>
    </Box>
  );
}
