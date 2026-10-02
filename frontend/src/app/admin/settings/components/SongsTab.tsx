import { useState, useEffect } from 'react';
import { adminApi, songsApi } from '@/lib/api';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, CircularProgress, Box, Alert, Paper, TextField, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export function SongsTab({ token }: { token: string }) {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  // Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSong, setEditingSong] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    artistId: '',
    albumId: '',
    audioUrl: '',
    imageUrl: '',
    duration: 0
  });

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
        artistId: song.artistId,
        albumId: song.albumId || '',
        audioUrl: song.audioUrl,
        imageUrl: song.imageUrl,
        duration: song.duration
      });
    } else {
      setEditingSong(null);
      setFormData({ title: '', artistId: '', albumId: '', audioUrl: '', imageUrl: '', duration: 0 });
    }
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editingSong) {
        await adminApi.updateSong(editingSong.id, formData, token);
      } else {
        await adminApi.createSong(formData, token);
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
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSongs.map(song => (
              <TableRow key={song.id}>
                <TableCell>{song.title}</TableCell>
                <TableCell>{song.artist?.name || song.artistId}</TableCell>
                <TableCell>{song.album?.title || '-'}</TableCell>
                <TableCell align="right">
                  <Button size="small" startIcon={<EditIcon />} onClick={() => handleOpenDialog(song)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(song.id)}>
                    Delete
                  </Button>
                </TableCell>
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
              label="Artist ID" 
              fullWidth 
              value={formData.artistId} 
              onChange={e => setFormData({ ...formData, artistId: e.target.value })} 
              helperText="Must be a valid artist UUID"
            />
            <TextField 
              label="Album ID (Optional)" 
              fullWidth 
              value={formData.albumId} 
              onChange={e => setFormData({ ...formData, albumId: e.target.value })} 
            />
            <TextField 
              label="Audio URL" 
              fullWidth 
              value={formData.audioUrl} 
              onChange={e => setFormData({ ...formData, audioUrl: e.target.value })} 
            />
            <TextField 
              label="Image URL" 
              fullWidth 
              value={formData.imageUrl} 
              onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} 
            />
            <TextField 
              label="Duration (seconds)" 
              type="number"
              fullWidth 
              value={formData.duration} 
              onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })} 
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
