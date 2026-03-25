'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import SearchIcon from '@mui/icons-material/Search';
import { searchApi } from '@/lib/api';
import Card, { CardGrid } from '@/components/Card/Card';
import TrackList from '@/components/TrackList/TrackList';
import { usePlayer } from '@/context/PlayerContext';

const GENRE_COLORS = [
  '#e13300', '#1e3264', '#8c67ac', '#1db954',
  '#e8115b', '#148a08', '#509bf5', '#ba5d07',
  '#dc148c', '#27856a', '#056952', '#af2896',
];

const GENRES = [
  { name: 'Pop', emoji: '🎤', color: GENRE_COLORS[0] },
  { name: 'Hip-Hop', emoji: '🎧', color: GENRE_COLORS[1] },
  { name: 'Rock', emoji: '🎸', color: GENRE_COLORS[2] },
  { name: 'Electronic', emoji: '🎹', color: GENRE_COLORS[3] },
  { name: 'R&B', emoji: '🎷', color: GENRE_COLORS[4] },
  { name: 'Jazz', emoji: '🎺', color: GENRE_COLORS[5] },
  { name: 'Classical', emoji: '🎻', color: GENRE_COLORS[6] },
  { name: 'Indie', emoji: '🎶', color: GENRE_COLORS[7] },
  { name: 'Ambient', emoji: '🌊', color: GENRE_COLORS[8] },
  { name: 'Soul', emoji: '💜', color: GENRE_COLORS[9] },
  { name: 'Country', emoji: '🤠', color: GENRE_COLORS[10] },
  { name: 'Latin', emoji: '💃', color: GENRE_COLORS[11] },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ songs: any[]; albums: any[]; artists: any[] } | null>(null);
  const [searching, setSearching] = useState(false);
  const { playTrack } = usePlayer();

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults(null);
      return;
    }
    setSearching(true);
    try {
      const data = await searchApi.search(q);
      setResults(data);
    } catch {
      setResults({ songs: [], albums: [], artists: [] });
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  return (
    <Box sx={{ p: '24px 32px' }}>
      {/* Search Header */}
      <Box sx={{ position: 'sticky', top: 0, bgcolor: 'background.default', py: 2, pb: 3, zIndex: 10 }}>
        <TextField
          placeholder="What do you want to listen to?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          id="search-input"
          fullWidth
          sx={{
            maxWidth: 480,
            '& .MuiOutlinedInput-root': {
              borderRadius: 100,
              bgcolor: '#242424',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.3)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'text.primary',
              },
              '&.Mui-focused': {
                bgcolor: '#2a2a2a',
              },
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* Browse All - Genre Grid */}
      {!query.trim() && !results && (
        <>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2.5 }}>
            Browse All
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 2,
            }}
          >
            {GENRES.map((genre) => (
              <Paper
                key={genre.name}
                elevation={0}
                onClick={() => setQuery(genre.name)}
                sx={{
                  height: 120,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'flex-end',
                  p: 2,
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  bgcolor: genre.color,
                  color: 'text.primary',
                  '&:hover': { transform: 'scale(1.02)' },
                }}
              >
                {genre.name}
                <Typography
                  component="span"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    fontSize: 40,
                    transform: 'rotate(15deg)',
                    opacity: 0.8,
                  }}
                >
                  {genre.emoji}
                </Typography>
              </Paper>
            ))}
          </Box>
        </>
      )}

      {/* Search Results */}
      {query.trim() && results && (
        <>
          {results.songs.length > 0 && (
            <Box component="section" sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                Songs
              </Typography>
              <TrackList tracks={results.songs} showHeader={false} />
            </Box>
          )}

          {results.albums.length > 0 && (
            <Box component="section" sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                Albums
              </Typography>
              <CardGrid>
                {results.albums.map((album, i) => (
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
          )}

          {results.artists.length > 0 && (
            <Box component="section" sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                Artists
              </Typography>
              <CardGrid>
                {results.artists.map((artist, i) => (
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
          )}

          {results.songs.length === 0 && results.albums.length === 0 && results.artists.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 10, color: 'text.disabled' }}>
              <SearchIcon sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ mb: 1 }}>
                No results found for &quot;{query}&quot;
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Please make sure your words are spelled correctly, or use fewer or different keywords.
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
