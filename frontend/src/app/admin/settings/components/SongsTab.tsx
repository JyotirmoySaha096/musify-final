import { useState, useEffect } from 'react';
import { adminApi, songsApi } from '@/lib/api';
import {
  MenuItem, Select, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, CircularProgress, Box, Alert, Paper, TextField, InputAdornment, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export function SongsTab({ token, isAdmin }: { token: string, isAdmin: boolean }) {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  // Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSong, setEditingSong] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({ title: '', artistName: '', albumName: '', audioUrl: '', imageUrl: '', duration: 0, visibility: 'member' });
  const [audioFile, setAudioFile] = useState<File | null>(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const data = await songsApi.getAll(); // Using public endpoint for listing
      setSongs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch songs');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (song?: any) => {
    if (song) {
      setEditingSong(song);
      setFormData({
        title: song.title,
        artistName: song.artistName,
        albumName: song.albumName || '',
        audioUrl: song.audioUrl,
        imageUrl: song.imageUrl,
        duration: song.duration,
        visibility: song.visibility || 'member'
      });
    } else {
      setEditingSong(null);
      setFormData({ title: '', artistName: '', albumName: '', audioUrl: '', imageUrl: '', duration: 0, visibility: 'member' });
      setAudioFile(null);
    }
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('artistName', formData.artistName);
      if (formData.albumName) data.append('albumName', formData.albumName);
      if (formData.audioUrl) data.append('audioUrl', formData.audioUrl);
      if (formData.imageUrl) data.append('imageUrl', formData.imageUrl);
      if (formData.visibility) data.append('visibility', formData.visibility);
      
      if (audioFile) data.append('file', audioFile);

      if (editingSong) {
        await adminApi.updateSong(editingSong.id, data as any, token);
      } else {
        await adminApi.createSong(data as any, token);
      }
      setOpenDialog(false);
      fetchSongs();
    } catch (err: any) {
      alert(err.message || 'Failed to save song');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this song?')) return;
    try {
      await adminApi.deleteSong(id, token);
      setSongs(songs.filter(s => s.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete song');
    }
  };

  const filteredSongs = songs.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <TextField
          size="small"
          placeholder="Search songs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Song
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Artist</TableCell>
              <TableCell>Album</TableCell>
              {isAdmin && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSongs.map(song => (
              <TableRow key={song.id}>
                <TableCell>{song.title}</TableCell>
                <TableCell>{song.artist?.name || song.artistName}</TableCell>
                <TableCell>{song.album?.title || '-'}</TableCell>
                {isAdmin && <TableCell align="right">
                      <Button size="small" startIcon={<EditIcon />} onClick={() => handleOpenDialog(song)}>Edit</Button>
                      <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(song.id)}>Delete</Button>
                    </TableCell>}
              </TableRow>
            ))}
            {filteredSongs.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">No songs found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Song Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingSong ? 'Edit Song' : 'Add New Song'}</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField 
              label="Title" 
              fullWidth 
              value={formData.title} 
              onChange={e => setFormData({ ...formData, title: e.target.value })} 
            />
            <TextField 
              label="Artist Name" 
              fullWidth 
              value={formData.artistName} 
              onChange={e => setFormData({ ...formData, artistName: e.target.value })} 
              helperText="We will find or create this artist"
            />
            <TextField 
              label="Album Name" 
              fullWidth 
              value={formData.albumName} 
              onChange={e => setFormData({ ...formData, albumName: e.target.value })}
          />
          <FormControl fullWidth sx={{ mt: 2 }} size="small">
            <InputLabel>Visibility Tier</InputLabel>
            <Select
              value={formData.visibility}
              label="Visibility Tier"
              onChange={e => setFormData({ ...formData, visibility: e.target.value })}
            >
              {isAdmin && <MenuItem value="public">Public (Everyone)</MenuItem>}
              <MenuItem value="member">Members Only (Copyrighted)</MenuItem>
              <MenuItem value="exclusive">Exclusive</MenuItem>
            </Select>
          </FormControl>
            <TextField label="Audio URL" fullWidth value={formData.audioUrl} onChange={e => setFormData({ ...formData, audioUrl: e.target.value })} helperText="Provide an external URL, or upload a file below" />
            <Box mt={2}>
              <Typography variant="subtitle2">Or upload audio file (MP3):</Typography>
              <input 
                type="file" 
                accept="audio/*" 
                onChange={e => setAudioFile(e.target.files?.[0] || null)} 
              />
            </Box>

            <TextField 
              label="Image URL" 
              fullWidth 
              value={formData.imageUrl} 
              onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} 
            />
            
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
