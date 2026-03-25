'use client';

import React, { useState, useEffect, useCallback } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import AddIcon from '@mui/icons-material/Add';
import { likedSongsApi, playlistsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface TrackActionsProps {
  songId: string;
  /** If provided, shows "Remove from this playlist" instead of "Add to playlist" sub-menu */
  playlistId?: string;
  onRemovedFromPlaylist?: (songId: string) => void;
}

export default function TrackActions({ songId, playlistId, onRemovedFromPlaylist }: TrackActionsProps) {
  const { token } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likedLoading, setLikedLoading] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [playlistsLoaded, setPlaylistsLoaded] = useState(false);

  // Check if song is already liked on mount
  useEffect(() => {
    if (!token) return;
    likedSongsApi.getAll(token).then((songs) => {
      setLiked(songs.some((s: any) => s.id === songId));
    }).catch(() => {});
  }, [songId, token]);

  const toggleLike = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token || likedLoading) return;
    setLikedLoading(true);
    try {
      if (liked) {
        await likedSongsApi.unlike(token, songId);
        setLiked(false);
      } else {
        await likedSongsApi.like(token, songId);
        setLiked(true);
      }
    } catch { /* ignore */ }
    setLikedLoading(false);
  }, [liked, likedLoading, songId, token]);

  const openMenu = useCallback(async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    if (!playlistsLoaded && token) {
      try {
        const data = await playlistsApi.getAll(token);
        setPlaylists(data);
        setPlaylistsLoaded(true);
      } catch { setPlaylists([]); }
    }
  }, [playlistsLoaded, token]);

  const closeMenu = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMenuAnchor(null);
  };

  const addToPlaylist = async (e: React.MouseEvent, pid: string) => {
    e.stopPropagation();
    if (!token) return;
    try {
      await playlistsApi.addSong(token, pid, songId);
    } catch { /* already in playlist etc. */ }
    closeMenu();
  };

  const removeFromPlaylist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token || !playlistId) return;
    try {
      await playlistsApi.removeSong(token, playlistId, songId);
      onRemovedFromPlaylist?.(songId);
    } catch { /* ignore */ }
    closeMenu();
  };

  if (!token) return null;

  return (
    <Stack direction="row" alignItems="center" onClick={(e) => e.stopPropagation()}>
      {/* Heart / like button */}
      <Tooltip title={liked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}>
        <IconButton
          size="small"
          onClick={toggleLike}
          disabled={likedLoading}
          sx={{
            color: liked ? 'primary.main' : 'text.disabled',
            opacity: 0,
            '.track-row:hover &': { opacity: 1 },
            '&.liked': { opacity: 1 },
            transition: 'opacity 0.15s, color 0.15s',
          }}
          className={liked ? 'liked' : ''}
        >
          {liked ? <FavoriteIcon sx={{ fontSize: 16 }} /> : <FavoriteBorderIcon sx={{ fontSize: 16 }} />}
        </IconButton>
      </Tooltip>

      {/* Three-dot menu */}
      <Tooltip title="More options">
        <IconButton
          size="small"
          onClick={openMenu}
          sx={{
            color: 'text.disabled',
            opacity: 0,
            '.track-row:hover &': { opacity: 1 },
            transition: 'opacity 0.15s',
          }}
        >
          <MoreHorizIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => closeMenu()}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{ sx: { minWidth: 200, bgcolor: '#282828', color: 'text.primary' } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Like toggle */}
        <MenuItem onClick={toggleLike}>
          <ListItemIcon>
            {liked
              ? <FavoriteIcon fontSize="small" sx={{ color: 'primary.main' }} />
              : <FavoriteBorderIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>{liked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}</ListItemText>
        </MenuItem>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Remove from current playlist */}
        {playlistId && (
          <MenuItem onClick={removeFromPlaylist} sx={{ color: 'error.main' }}>
            <ListItemIcon><PlaylistRemoveIcon fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
            <ListItemText>Remove from this playlist</ListItemText>
          </MenuItem>
        )}

        {/* Add to playlist sub-items */}
        {!playlistId && (
          <>
            <MenuItem disabled sx={{ py: 0.5 }}>
              <Typography variant="caption" color="text.disabled">Add to playlist</Typography>
            </MenuItem>
            {playlists.length === 0 ? (
              <MenuItem disabled>
                <ListItemText><Typography variant="body2" color="text.disabled">No playlists yet</Typography></ListItemText>
              </MenuItem>
            ) : (
              playlists.map((pl) => (
                <MenuItem key={pl.id} onClick={(e) => addToPlaylist(e, pl.id)}>
                  <ListItemIcon><PlaylistAddIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>{pl.name}</ListItemText>
                </MenuItem>
              ))
            )}
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <MenuItem onClick={(e) => { e.stopPropagation(); closeMenu(); /* TODO: create playlist modal */ }}>
              <ListItemIcon><AddIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Create new playlist</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>
    </Stack>
  );
}
