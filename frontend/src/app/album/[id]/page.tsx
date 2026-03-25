'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import Skeleton from '@mui/material/Skeleton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import TrackList from '@/components/TrackList/TrackList';
import { albumsApi } from '@/lib/api';
import { usePlayer } from '@/context/PlayerContext';

export default function AlbumPage() {
  const params = useParams();
  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { playTrack, currentTrack, isPlaying, togglePlay, queue } = usePlayer();

  useEffect(() => {
    if (params.id) {
      albumsApi
        .getOne(params.id as string)
        .then(setAlbum)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
        <Typography variant="body2" color="text.disabled" sx={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
          Loading album...
        </Typography>
      </Box>
    );
  }

  if (!album) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
        <Typography variant="body2" color="text.disabled">
          Album not found
        </Typography>
      </Box>
    );
  }

  const albumSongs = album.songs || [];

  const isThisAlbumActive =
    currentTrack && albumSongs.length > 0 &&
    albumSongs.some((s: any) => s.id === currentTrack.id) &&
    queue.length === albumSongs.length &&
    queue.every((q, i) => q.id === albumSongs[i]?.id);
  const isThisAlbumPlaying = isPlaying && isThisAlbumActive;

  const handlePlayAll = () => {
    if (isThisAlbumActive) {
      togglePlay();
    } else if (album.songs?.length > 0) {
      playTrack(album.songs[0], album.songs, 0);
    }
  };

  const totalDuration = album.songs?.reduce(
    (sum: number, s: any) => sum + s.durationSeconds,
    0,
  );
  const mins = Math.floor(totalDuration / 60);

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'flex-end' },
          gap: { xs: 2, sm: 3 },
          p: { xs: '24px 16px 20px', sm: '40px 32px 24px' },
          background: 'linear-gradient(180deg, rgba(83,83,83,0.6) 0%, #121212 100%)',
          minHeight: { xs: 'auto', sm: 280 },
          textAlign: { xs: 'center', sm: 'left' },
        }}
      >
        <Box
          sx={{
            width: { xs: 160, sm: 200, md: 232 },
            height: { xs: 160, sm: 200, md: 232 },
            borderRadius: 2,
            bgcolor: '#242424',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: { xs: 56, sm: 72, md: 80 },
            flexShrink: 0,
            boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
            animation: 'scaleIn 0.4s ease',
          }}
        >
          💿
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, animation: 'fadeIn 0.4s ease' }}>
          <Typography
            variant="overline"
            sx={{ fontWeight: 700, letterSpacing: 1, mb: 1, display: 'block' }}
          >
            Album
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              lineHeight: 1.1,
              mb: 1.5,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {album.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', color: 'text.secondary', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            <Typography
              component={Link}
              href={`/artist/${album.artist?.id}`}
              variant="body2"
              sx={{ fontWeight: 600, color: 'text.primary', '&:hover': { textDecoration: 'underline' } }}
            >
              {album.artist?.name}
            </Typography>
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.secondary' }} />
            <Typography variant="body2">{album.releaseYear}</Typography>
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.secondary' }} />
            <Typography variant="body2">
              {album.songs?.length || 0} songs, ~{mins} min
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, px: { xs: 2, sm: 4 }, py: 2.5 }}>
        <Fab
          color="primary"
          onClick={handlePlayAll}
          sx={{
            width: { xs: 48, sm: 56 },
            height: { xs: 48, sm: 56 },
            '&:hover': { transform: 'scale(1.06)', bgcolor: 'primary.light' },
          }}
        >
          {isThisAlbumPlaying ? <PauseIcon sx={{ fontSize: { xs: 24, sm: 28 } }} /> : <PlayArrowIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />}
        </Fab>
      </Box>

      {/* Track List */}
      <Box sx={{ px: { xs: 1, sm: 4 }, pb: 4 }}>
        <TrackList tracks={album.songs || []} showAlbum={false} />
      </Box>
    </Box>
  );
}
