import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MusicLinkedList, TrackNode } from '../lib/LinkedList';

interface Track {
  _id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  coverUrl?: string;
  genre?: string;
}

interface MusicPlayerProps {
  tracks: Track[];
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ tracks }) => {
  const [playlist] = useState(() => {
    const list = new MusicLinkedList();
    tracks.forEach(track => list.addTrack(track));
    return list;
  });

  const [currentTrack, setCurrentTrack] = useState<TrackNode | null>(
    playlist.getCurrentTrack()
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTracks, setFilteredTracks] = useState<TrackNode[]>([]);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Update playlist when tracks change
  useEffect(() => {
    playlist.clear();
    tracks.forEach(track => playlist.addTrack(track));
    setCurrentTrack(playlist.getCurrentTrack());
    setFilteredTracks(playlist.getAllTracks());
  }, [tracks, playlist]);

  // Filter tracks based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTracks(playlist.getAllTracks());
    } else {
      setFilteredTracks(playlist.searchTracks(searchQuery));
    }
  }, [searchQuery, playlist]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        nextTrack();
      }
    };
    const handleError = () => {
      setIsLoading(false);
      console.error('Audio loading error');
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [isRepeat]);

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackRate;
      setCurrentTime(0);
    }
  }, [currentTrack, volume, playbackRate]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, currentTrack]);

  const nextTrack = useCallback(() => {
    const next = playlist.nextTrack();
    if (next) {
      setCurrentTrack(next);
      setCurrentTime(0);
      if (isPlaying && audioRef.current) {
        setTimeout(() => {
          audioRef.current?.play().catch(console.error);
        }, 100);
      }
    }
  }, [playlist, isPlaying]);

  const prevTrack = useCallback(() => {
    const prev = playlist.prevTrack();
    if (prev) {
      setCurrentTrack(prev);
      setCurrentTime(0);
      if (isPlaying && audioRef.current) {
        setTimeout(() => {
          audioRef.current?.play().catch(console.error);
        }, 100);
      }
    }
  }, [playlist, isPlaying]);

  const selectTrack = useCallback((trackId: string) => {
    const track = playlist.setCurrentTrack(trackId);
    if (track) {
      setCurrentTrack(track);
      setCurrentTime(0);
      if (isPlaying && audioRef.current) {
        setTimeout(() => {
          audioRef.current?.play().catch(console.error);
        }, 100);
      }
    }
  }, [playlist, isPlaying]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const newTime = (parseFloat(e.target.value) / 100) * currentTrack.duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  }, [currentTrack]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, []);

  const toggleShuffle = useCallback(() => {
    if (isShuffled) {
      playlist.restoreOrder();
    } else {
      playlist.shuffle();
    }
    setIsShuffled(!isShuffled);
  }, [playlist, isShuffled]);

  const toggleRepeat = useCallback(() => {
    setIsRepeat(!isRepeat);
  }, [isRepeat]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextTrack();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevTrack();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(prev => Math.min(1, prev + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(prev => Math.max(0, prev - 0.1));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [togglePlay, nextTrack, prevTrack]);

  if (!currentTrack) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <p className="text-gray-500">No tracks available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <audio ref={audioRef} preload="metadata" />
      
      {/* Current Track Display */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {currentTrack.coverUrl ? (
              <img 
                src={currentTrack.coverUrl} 
                alt={currentTrack.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h3.763l7.79 3.894A1 1 0 0018 15V3zM3.5 9.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold">{currentTrack.title}</h3>
            <p className="text-white/80">{currentTrack.artist}</p>
            <div className="flex items-center space-x-4 text-white/60 text-sm mt-1">
              <span>{currentTrack.genre}</span>
              <span>•</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={currentTrack.duration > 0 ? (currentTime / currentTrack.duration) * 100 : 0}
            onChange={handleSeek}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <span>{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="px-6 py-4 border-t">
        <div className="flex items-center justify-center space-x-6">
          <button
            onClick={toggleShuffle}
            className={`p-2 rounded-full transition-colors ${
              isShuffled 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            title="Shuffle"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" clipRule="evenodd" />
            </svg>
          </button>

          <button
            onClick={prevTrack}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Previous Track"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 9H17a1 1 0 110 2h-5.586l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="p-4 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
            ) : isPlaying ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          <button
            onClick={nextTrack}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Next Track"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-2 rounded-full transition-colors ${
              isRepeat 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            title="Repeat"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center justify-between mt-4">
          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.824L4.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.5l3.883-3.824a1 1 0 011.617.824zM12 8a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd" />
            </svg>
            <input
              type="range"
              min="0"
              max="100"
              value={volume * 100}
              onChange={handleVolumeChange}
              className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-xs text-gray-500 w-8">{Math.round(volume * 100)}%</span>
          </div>

          {/* Playback Speed */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Speed:</span>
            <select
              value={playbackRate}
              onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
              className="text-xs bg-gray-100 rounded px-2 py-1"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>
        </div>
      </div>

      {/* Playlist */}
      <div className="border-t bg-gray-50">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-700">
              Playlist ({playlist.getSize()} tracks • {playlist.getFormattedTotalDuration()})
            </h4>
            <input
              type="text"
              placeholder="Search tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredTracks.map((track, index) => (
              <div
                key={track.id}
                onClick={() => selectTrack(track.id)}
                className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${
                  track.id === currentTrack.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className="text-sm text-gray-400 w-6">{index + 1}</span>
                {track.coverUrl && (
                  <img 
                    src={track.coverUrl} 
                    alt={track.title}
                    className="w-8 h-8 rounded object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{track.title}</p>
                  <p className="text-sm text-gray-500 truncate">{track.artist}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-400">{formatTime(track.duration)}</span>
                  {track.genre && (
                    <p className="text-xs text-gray-400">{track.genre}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          {filteredTracks.length === 0 && searchQuery && (
            <p className="text-center text-gray-500 py-4">No tracks found matching "{searchQuery}"</p>
          )}
        </div>
      </div>

      {/* Keyboard Shortcuts Info */}
      <div className="px-6 py-2 bg-gray-100 text-xs text-gray-500">
        <p>Keyboard shortcuts: Space (play/pause) • ← → (prev/next) • ↑ ↓ (volume)</p>
      </div>
    </div>
  );
};
