'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, username, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 90px)',
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 400,
          bgcolor: 'background.paper',
          borderRadius: 3,
          p: '40px 32px',
          animation: 'fadeIn 0.4s ease',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              background: 'linear-gradient(135deg, #1DB954, #1ed760)',
              fontSize: 24,
              mx: 'auto',
              mb: 2,
            }}
          >
            ♪
          </Avatar>
          <Typography variant="h5" fontWeight={800}>
            Sign up for Spotify
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
            Create a free account
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(220,53,69,0.15)', color: '#ff6b7a' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="caption" fontWeight={600} sx={{ mb: 0.75, display: 'block' }}>
              Email address
            </Typography>
            <TextField
              type="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              id="register-email"
            />
          </Box>

          <Box>
            <Typography variant="caption" fontWeight={600} sx={{ mb: 0.75, display: 'block' }}>
              Username
            </Typography>
            <TextField
              type="text"
              placeholder="What should we call you?"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
              id="register-username"
            />
          </Box>

          <Box>
            <Typography variant="caption" fontWeight={600} sx={{ mb: 0.75, display: 'block' }}>
              Password
            </Typography>
            <TextField
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              id="register-password"
              inputProps={{ minLength: 6 }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            id="register-submit"
            sx={{
              py: 1.5,
              fontSize: 15,
              mt: 1,
              borderRadius: 100,
              '&:disabled': { opacity: 0.5 },
            }}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', mt: 3 }}>
          Already have an account?{' '}
          <Typography
            component={Link}
            href="/login"
            variant="body2"
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              textDecoration: 'underline',
              '&:hover': { color: 'primary.main' },
            }}
          >
            Log in here
          </Typography>
        </Typography>
      </Paper>
    </Box>
  );
}
