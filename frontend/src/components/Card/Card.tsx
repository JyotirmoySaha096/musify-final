'use client';

import React from 'react';
import Link from 'next/link';
import MuiCard from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface CardProps {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  emoji?: string;
  round?: boolean;
  onPlay?: () => void;
  animationDelay?: number;
}

export default function Card({
  title,
  subtitle,
  href,
  emoji = '🎵',
  round = false,
  onPlay,
  animationDelay = 0,
}: CardProps) {
  return (
    <MuiCard
      component={Link}
      href={href}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: { xs: 1.5, sm: 2 },
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        animation: 'scaleIn 0.3s ease forwards',
        animationDelay: `${animationDelay}ms`,
        opacity: 0,
        textDecoration: 'none',
        position: 'relative',
        '&:hover': {
          bgcolor: '#282828',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          '& .card-play-btn': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
      elevation={0}
    >
      <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1', mb: { xs: 1.5, sm: 2 } }}>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: round ? '50%' : 1.5,
            bgcolor: '#242424',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: { xs: 36, sm: 48 },
            boxShadow: 2,
            overflow: 'hidden',
          }}
        >
          {emoji}
        </Box>
        {onPlay && (
          <Fab
            className="card-play-btn"
            size="small"
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPlay();
            }}
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              opacity: 0,
              transform: 'translateY(8px)',
              transition: 'all 0.3s ease',
            }}
          >
            <PlayArrowIcon />
          </Fab>
        )}
      </Box>
      <Typography variant="body2" fontWeight={700} noWrap sx={{ fontSize: { xs: 12, sm: 14 } }}>
        {title}
      </Typography>
      <Typography variant="caption" color="text.disabled" noWrap sx={{ lineHeight: 1.4, fontSize: { xs: 10, sm: 12 } }}>
        {subtitle}
      </Typography>
    </MuiCard>
  );
}

export function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(auto-fill, minmax(130px, 1fr))',
          sm: 'repeat(auto-fill, minmax(155px, 1fr))',
          md: 'repeat(auto-fill, minmax(180px, 1fr))',
        },
        gap: { xs: 1.5, sm: 2, md: 3 },
      }}
    >
      {children}
    </Box>
  );
}
