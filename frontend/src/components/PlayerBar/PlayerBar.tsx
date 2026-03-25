'use client';

import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Paper from '@mui/material/Paper';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { usePlayer } from '@/context/PlayerContext';

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const PLAYER_HEIGHT = 90;

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    shuffle,
    repeat,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  if (!currentTrack) {
    return (
      <Paper
        elevation={0}
        sx={{
          height: PLAYER_HEIGHT,
          bgcolor: '#181818',
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        <Typography variant="body2" color="text.disabled">
          Select a song to start listening
        </Typography>
      </Paper>
    );
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const VolumeIcon =
    volume === 0
      ? VolumeOffIcon
      : volume < 0.3
        ? VolumeMuteIcon
        : volume < 0.7
          ? VolumeDownIcon
          : VolumeUpIcon;

  return (
    <Paper
      elevation={0}
      sx={{
        height: PLAYER_HEIGHT,
        bgcolor: '#181818',
        borderTop: 1,
        borderColor: 'divider',
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1fr',
        alignItems: 'center',
        px: 2,
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }}
    >
      {/* Left: Track Info */}
      <Stack direction="row" alignItems="center" spacing={1.75} sx={{ minWidth: 0 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 1,
            bgcolor: 'background.default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: 2,
          }}
        >
          <MusicNoteIcon sx={{ color: 'text.secondary', fontSize: 24 }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            fontWeight={500}
            noWrap
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            {currentTrack.title}
          </Typography>
          <Typography
            component={Link}
            href={`/artist/${currentTrack.artist?.id}`}
            variant="caption"
            color="text.disabled"
            noWrap
            sx={{
              display: 'block',
              '&:hover': { color: 'text.primary', textDecoration: 'underline' },
            }}
          >
            {currentTrack.artist?.name}
          </Typography>
        </Box>
        <IconButton size="small" sx={{ color: 'text.secondary' }}>
          <FavoriteBorderIcon fontSize="small" />
        </IconButton>
      </Stack>

      {/* Center: Controls */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton
            size="small"
            onClick={toggleShuffle}
            title="Shuffle"
            sx={{ color: shuffle ? 'primary.main' : 'text.secondary' }}
          >
            <ShuffleIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={previous} title="Previous" sx={{ color: 'text.secondary' }}>
            <SkipPreviousIcon />
          </IconButton>
          <IconButton
            onClick={togglePlay}
            sx={{
              bgcolor: 'text.primary',
              color: 'background.default',
              width: 32,
              height: 32,
              '&:hover': { bgcolor: '#fff', transform: 'scale(1.06)' },
            }}
          >
            {isPlaying ? <PauseIcon sx={{ fontSize: 18 }} /> : <PlayArrowIcon sx={{ fontSize: 18 }} />}
          </IconButton>
          <IconButton size="small" onClick={next} title="Next" sx={{ color: 'text.secondary' }}>
            <SkipNextIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={toggleRepeat}
            title={`Repeat: ${repeat}`}
            sx={{ color: repeat !== 'off' ? 'primary.main' : 'text.secondary' }}
          >
            {repeat === 'one' ? <RepeatOneIcon fontSize="small" /> : <RepeatIcon fontSize="small" />}
          </IconButton>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%', maxWidth: 600 }}>
          <Typography variant="caption" color="text.disabled" sx={{ minWidth: 35, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
            {formatTime(currentTime)}
          </Typography>
          <Slider
            value={progress}
            onChange={(_, val) => seek(((val as number) / 100) * duration)}
            size="small"
            sx={{ flex: 1 }}
          />
          <Typography variant="caption" color="text.disabled" sx={{ minWidth: 35, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
            {formatTime(duration)}
          </Typography>
        </Stack>
      </Box>

      {/* Right: Volume */}
      <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
        <IconButton
          size="small"
          onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
          sx={{ color: 'text.secondary' }}
        >
          <VolumeIcon fontSize="small" />
        </IconButton>
        <Slider
          value={volume * 100}
          onChange={(_, val) => setVolume((val as number) / 100)}
          size="small"
          sx={{ width: 100 }}
        />
      </Stack>
    </Paper>
  );
}
