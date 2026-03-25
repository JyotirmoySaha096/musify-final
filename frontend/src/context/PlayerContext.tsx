'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useRef,
  useCallback,
  useEffect,
} from 'react';


interface Track {
  id: string;
  title: string;
  durationSeconds: number;
  audioUrl: string;
  artist: { id: string; name: string };
  album: { id: string; title: string; coverUrl: string };
}

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  queueIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
}

type PlayerAction =
  | { type: 'SET_TRACK'; payload: { track: Track; queue?: Track[]; index?: number } }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'NEXT' }
  | { type: 'PREVIOUS' }
  | { type: 'SET_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'TOGGLE_REPEAT' }
  | { type: 'ADD_TO_QUEUE'; payload: Track };

const initialState: PlayerState = {
  currentTrack: null,
  queue: [],
  queueIndex: -1,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.7,
  shuffle: false,
  repeat: 'off',
};

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'SET_TRACK':
      return {
        ...state,
        currentTrack: action.payload.track,
        queue: action.payload.queue || state.queue,
        queueIndex: action.payload.index ?? 0,
        isPlaying: true,
        currentTime: 0,
      };
    case 'PLAY':
      return { ...state, isPlaying: true };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };
    case 'NEXT': {
      let nextIndex = state.queueIndex + 1;
      if (state.shuffle) {
        nextIndex = Math.floor(Math.random() * state.queue.length);
      }
      if (nextIndex >= state.queue.length) {
        if (state.repeat === 'all') {
          nextIndex = 0;
        } else {
          return { ...state, isPlaying: false };
        }
      }
      return {
        ...state,
        currentTrack: state.queue[nextIndex],
        queueIndex: nextIndex,
        isPlaying: true,
        currentTime: 0,
      };
    }
    case 'PREVIOUS': {
      if (state.currentTime > 3) {
        return { ...state, currentTime: 0 };
      }
      const prevIndex = Math.max(0, state.queueIndex - 1);
      return {
        ...state,
        currentTrack: state.queue[prevIndex],
        queueIndex: prevIndex,
        isPlaying: true,
        currentTime: 0,
      };
    }
    case 'SET_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    case 'TOGGLE_SHUFFLE':
      return { ...state, shuffle: !state.shuffle };
    case 'TOGGLE_REPEAT': {
      const modes: Array<'off' | 'all' | 'one'> = ['off', 'all', 'one'];
      const nextMode = modes[(modes.indexOf(state.repeat) + 1) % modes.length];
      return { ...state, repeat: nextMode };
    }
    case 'ADD_TO_QUEUE':
      return { ...state, queue: [...state.queue, action.payload] };
    default:
      return state;
  }
}

interface PlayerContextType extends PlayerState {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  playTrack: (track: Track, queue?: Track[], index?: number) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (track: Track) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTrack = useCallback((track: Track, queue?: Track[], index?: number) => {
    dispatch({ type: 'SET_TRACK', payload: { track, queue, index } });
  }, []);

  const play = useCallback(() => dispatch({ type: 'PLAY' }), []);
  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const togglePlay = useCallback(() => dispatch({ type: 'TOGGLE_PLAY' }), []);
  const next = useCallback(() => dispatch({ type: 'NEXT' }), []);
  const previous = useCallback(() => dispatch({ type: 'PREVIOUS' }), []);
  const toggleShuffle = useCallback(() => dispatch({ type: 'TOGGLE_SHUFFLE' }), []);
  const toggleRepeat = useCallback(() => dispatch({ type: 'TOGGLE_REPEAT' }), []);
  const addToQueue = useCallback((track: Track) => dispatch({ type: 'ADD_TO_QUEUE', payload: track }), []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    dispatch({ type: 'SET_TIME', payload: time });
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    dispatch({ type: 'SET_VOLUME', payload: volume });
  }, []);

  // Handle audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentTrack) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const authToken = localStorage.getItem('spotify_token');

    const fetchTokenAndPlay = async () => {
      try {
        const res = await fetch(
          `${apiUrl}/songs/${state.currentTrack!.id}/stream-token`,
          {
            headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
          },
        );
        if (!res.ok) {
          console.error('Failed to get stream token');
          return;
        }
        const { token } = await res.json();
        audio.src = `${apiUrl}/songs/${state.currentTrack!.id}/stream?token=${token}`;
        if (state.isPlaying) {
          audio.play().catch(() => {});
        }
      } catch (err) {
        console.error('Stream token error:', err);
      }
    };

    fetchTokenAndPlay();
  }, [state.currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (state.isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [state.isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => dispatch({ type: 'SET_TIME', payload: audio.currentTime });
    const onDurationChange = () => dispatch({ type: 'SET_DURATION', payload: audio.duration });
    const onEnded = () => {
      if (state.repeat === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        dispatch({ type: 'NEXT' });
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
    };
  }, [state.repeat]);

  return (
    <PlayerContext.Provider
      value={{
        ...state,
        audioRef,
        playTrack,
        play,
        pause,
        togglePlay,
        next,
        previous,
        seek,
        setVolume,
        toggleShuffle,
        toggleRepeat,
        addToQueue,
      }}
    >
      <audio ref={audioRef} preload="metadata" />
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
}
