'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import TrackList from '@/components/TrackList/TrackList';
import { playlistsApi } from '@/lib/api';
import { usePlayer } from '@/context/PlayerContext';

export default function PlaylistPage() {
  const params = useParams();
  const [playlist, setPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { playTrack, currentTrack, isPlaying, togglePlay, queue } = usePlayer();

  useEffect(() => {
    if (params.id) {
      playlistsApi
        .getOne(params.id as string)
        .then(setPlaylist)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
        <Typography variant="body2" color="text.disabled">
          Loading playlist...
        </Typography>
      </Box>
    );
  }

  if (!playlist) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
        <Typography variant="body2" color="text.disabled">
          Playlist not found
        </Typography>
      </Box>
    );
  }

  const songs = playlist.playlistSongs?.map((ps: any) => ps.song).filter(Boolean) || [];

  // "Active" = the player's queue was set from this playlist's songs
  // Compare by checking if the currentTrack is in THIS page's song list AND
  // the queue length matches (handles same song appearing in multiple contexts)
  const isThisContextActive =
    currentTrack && songs.length > 0 &&
    songs.some((s: any) => s.id === currentTrack.id) &&
    queue.length === songs.length &&
    queue.every((q, i) => q.id === songs[i]?.id);
  const isThisContextPlaying = isPlaying && isThisContextActive;

  const handlePlayAll = () => {
    if (isThisContextActive) {
      togglePlay();
    } else if (songs.length > 0) {
      playTrack(songs[0], songs, 0);
    }
  };

  const handleRemovedFromPlaylist = (songId: string) => {
    setPlaylist((prev: any) => ({
      ...prev,
      playlistSongs: prev.playlistSongs?.filter((ps: any) => ps.song?.id !== songId),
    }));
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
          background: 'linear-gradient(180deg, rgba(29,185,84,0.4) 0%, #121212 100%)',
          minHeight: 280,
        }}
      >
        <Box
          sx={{
            width: 232,
            height: 232,
            borderRadius: 2,
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
          🎵
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, animation: 'fadeIn 0.4s ease' }}>
          <Typography
            variant="overline"
            sx={{ fontWeight: 700, letterSpacing: 1, mb: 1, display: 'block' }}
          >
            Playlist
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
            {playlist.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            <Typography variant="body2">
              {playlist.user?.username || 'User'}
            </Typography>
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.secondary' }} />
            <Typography variant="body2">{songs.length} songs</Typography>
          </Box>
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

      {/* Track List */}
      <Box sx={{ px: 4, pb: 4 }}>
        {songs.length > 0 ? (
          <TrackList tracks={songs} playlistId={params.id as string} onRemovedFromPlaylist={handleRemovedFromPlaylist} />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
            <Typography variant="body2" color="text.disabled">
              This playlist is empty. Search for songs to add!
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
