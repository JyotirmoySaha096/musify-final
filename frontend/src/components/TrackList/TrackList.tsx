'use client';

import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { usePlayer } from '@/context/PlayerContext';
import TrackActions from './TrackActions';

interface Track {
  id: string;
  title: string;
  durationSeconds: number;
  audioUrl: string;
  trackNumber?: number;
  artist: { id: string; name: string };
  album: { id: string; title: string; coverUrl: string };
}

interface TrackListProps {
  tracks: Track[];
  showAlbum?: boolean;
  showHeader?: boolean;
  /** If set, shows "Remove from playlist" instead of the add-to-playlist menu */
  playlistId?: string;
  onRemovedFromPlaylist?: (songId: string) => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function TrackList({
  tracks,
  showAlbum = true,
  showHeader = true,
  playlistId,
  onRemovedFromPlaylist,
}: TrackListProps) {
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const handlePlayTrack = (track: Track, index: number) => {
    playTrack(track, tracks, index);
  };

  return (
    <TableContainer>
      <Table size="small">
        {showHeader && (
          <TableHead>
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent' } }}>
              <TableCell sx={{ width: 40 }}>#</TableCell>
              <TableCell>Title</TableCell>
              {showAlbum && <TableCell>Album</TableCell>}
              <TableCell align="right" sx={{ width: 80 }}>
                ⏱
              </TableCell>
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {tracks.map((track, index) => {
            const isCurrent = currentTrack?.id === track.id;

            return (
              <TableRow
                key={track.id}
                className="track-row"
                onClick={() => handlePlayTrack(track, index)}
                sx={{
                  animation: 'fadeIn 0.3s ease forwards',
                  animationDelay: `${index * 30}ms`,
                  opacity: 0,
                  '& .track-number': { display: 'inline' },
                  '& .play-indicator': { display: 'none' },
                  '&:hover': {
                    '& .track-number': { display: 'none' },
                    '& .play-indicator': { display: 'inline-flex' },
                  },
                }}
              >
                <TableCell sx={{ color: isCurrent ? 'primary.main' : 'text.disabled', textAlign: 'center' }}>
                  {isCurrent && isPlaying ? (
                    <MusicNoteIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                  ) : (
                    <>
                      <Typography component="span" className="track-number" variant="body2">
                        {index + 1}
                      </Typography>
                      <PlayArrowIcon className="play-indicator" sx={{ fontSize: 16 }} />
                    </>
                  )}
                </TableCell>

                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: '#242424',
                        fontSize: 16,
                      }}
                    >
                      <MusicNoteIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{ color: isCurrent ? 'primary.main' : 'text.primary' }}
                      >
                        {track.title}
                      </Typography>
                      <Typography
                        component={Link}
                        href={`/artist/${track.artist?.id}`}
                        variant="caption"
                        color="text.disabled"
                        noWrap
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          display: 'block',
                          '&:hover': {
                            color: 'text.primary',
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {track.artist?.name}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>

                {showAlbum && (
                  <TableCell>
                    <Typography
                      component={Link}
                      href={`/album/${track.album?.id}`}
                      variant="body2"
                      color="text.disabled"
                      noWrap
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        '&:hover': {
                          color: 'text.primary',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {track.album?.title}
                    </Typography>
                  </TableCell>
                )}

                <TableCell align="right">
                  <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.5}>
                    <TrackActions
                      songId={track.id}
                      playlistId={playlistId}
                      onRemovedFromPlaylist={onRemovedFromPlaylist}
                    />
                    <Typography variant="body2" color="text.disabled" sx={{ fontVariantNumeric: 'tabular-nums', minWidth: 36, textAlign: 'right' }}>
                      {formatDuration(track.durationSeconds)}
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
