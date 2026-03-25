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

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
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
            Log in to Spotify
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
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              id="login-email"
            />
          </Box>

          <Box>
            <Typography variant="caption" fontWeight={600} sx={{ mb: 0.75, display: 'block' }}>
              Password
            </Typography>
            <TextField
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              id="login-password"
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            id="login-submit"
            sx={{
              py: 1.5,
              fontSize: 15,
              mt: 1,
              borderRadius: 100,
              '&:disabled': { opacity: 0.5 },
            }}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', mt: 3 }}>
          Don&apos;t have an account?{' '}
          <Typography
            component={Link}
            href="/register"
            variant="body2"
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              textDecoration: 'underline',
              '&:hover': { color: 'primary.main' },
            }}
          >
            Sign up for Spotify
          </Typography>
        </Typography>
      </Paper>
    </Box>
  );
}
