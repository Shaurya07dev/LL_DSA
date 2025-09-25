import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { MusicPlayer } from "./components/MusicPlayer";
import { AboutUs } from "./components/AboutUs";
import { useState, useEffect } from "react";

export default function App() {
  const [currentView, setCurrentView] = useState<'player' | 'about'>('player');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h3.763l7.79 3.894A1 1 0 0018 15V3zM3.5 9.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                MusicLink
              </h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => setCurrentView('player')}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'player'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Music Player
              </button>
              <button
                onClick={() => setCurrentView('about')}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'about'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                About Us
              </button>
            </nav>
          </div>
          <SignOutButton />
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="max-w-6xl mx-auto">
          <Content currentView={currentView} setCurrentView={setCurrentView} />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function Content({ currentView, setCurrentView }: { 
  currentView: 'player' | 'about';
  setCurrentView: (view: 'player' | 'about') => void;
}) {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const tracks = useQuery(api.tracks.getAllTracks);
  const initializeTracks = useMutation(api.tracks.initializeTracks);
  const forceReinitializeTracks = useMutation(api.tracks.forceReinitializeTracks);

  useEffect(() => {
    if (tracks && tracks.length === 0) {
      initializeTracks().catch(console.error);
    } else if (tracks && tracks.length > 0) {
      // Check if we have the old tracks (Queen, Eagles, etc.) and reinitialize with new ones
      const hasOldTracks = tracks.some(track => 
        track.title === "Bohemian Rhapsody" || 
        track.title === "Hotel California" || 
        track.title === "Stairway to Heaven"
      );
      if (hasOldTracks) {
        forceReinitializeTracks().catch(console.error);
      }
    }
  }, [tracks, initializeTracks, forceReinitializeTracks]);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Unauthenticated>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Welcome to MusicLink
            </h1>
            <p className="text-xl text-gray-600">
              Experience music with advanced data structures
            </p>
            <p className="text-gray-500 mt-2">
              Sign in to access the music player with linked list navigation
            </p>
          </div>
          <SignInForm />
        </div>
      </Unauthenticated>

      <Authenticated>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {loggedInUser?.email?.split('@')[0] || 'Music Lover'}! 🎵
          </h1>
          <p className="text-gray-600">
            Enjoy seamless music navigation powered by circular doubly linked lists
          </p>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex space-x-4 mb-6">
          <button
            onClick={() => setCurrentView('player')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === 'player'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Music Player
          </button>
          <button
            onClick={() => setCurrentView('about')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === 'about'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            About Us
          </button>
        </div>

        {currentView === 'player' && (
          <div>
            {tracks && tracks.length > 0 ? (
              <MusicPlayer tracks={tracks} />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your music library...</p>
              </div>
            )}
          </div>
        )}

        {currentView === 'about' && <AboutUs />}
      </Authenticated>
    </div>
  );
}
