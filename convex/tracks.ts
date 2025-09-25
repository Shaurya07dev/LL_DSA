import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAllTracks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tracks").collect();
  },
});

export const getTrack = query({
  args: { trackId: v.id("tracks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.trackId);
  },
});

export const addTrack = mutation({
  args: {
    title: v.string(),
    artist: v.string(),
    duration: v.number(),
    audioUrl: v.string(),
    coverUrl: v.optional(v.string()),
    genre: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tracks", args);
  },
});

export const updateTrack = mutation({
  args: {
    trackId: v.id("tracks"),
    title: v.optional(v.string()),
    artist: v.optional(v.string()),
    duration: v.optional(v.number()),
    audioUrl: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
    genre: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { trackId, ...updates } = args;
    return await ctx.db.patch(trackId, updates);
  },
});

export const deleteTrack = mutation({
  args: { trackId: v.id("tracks") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.trackId);
  },
});

export const getTracksByGenre = query({
  args: { genre: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tracks")
      .filter((q) => q.eq(q.field("genre"), args.genre))
      .collect();
  },
});

export const searchTracks = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const tracks = await ctx.db.query("tracks").collect();
    return tracks.filter(
      (track) =>
        track.title.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
        track.artist.toLowerCase().includes(args.searchTerm.toLowerCase())
    );
  },
});

// Initialize with popular modern English songs
export const initializeTracks = mutation({
  args: {},
  handler: async (ctx) => {
    const existingTracks = await ctx.db.query("tracks").collect();
    if (existingTracks.length > 0) {
      return "Tracks already exist";
    }

    const famousTracks = [
      {
        title: "Shape of You",
        artist: "Ed Sheeran",
        duration: 233, // 3:53
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
        genre: "Pop",
      },
      {
        title: "Blinding Lights",
        artist: "The Weeknd",
        duration: 200, // 3:20
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
        genre: "Pop",
      },
      {
        title: "Someone Like You",
        artist: "Adele",
        duration: 285, // 4:45
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
        genre: "Soul",
      },
      {
        title: "Uptown Funk",
        artist: "Mark Ronson ft. Bruno Mars",
        duration: 270, // 4:30
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
        genre: "Funk",
      },
      {
        title: "Rolling in the Deep",
        artist: "Adele",
        duration: 228, // 3:48
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&h=300&fit=crop",
        genre: "Soul",
      },
      {
        title: "Bad Guy",
        artist: "Billie Eilish",
        duration: 194, // 3:14
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
        genre: "Alternative",
      },
      {
        title: "Thinking Out Loud",
        artist: "Ed Sheeran",
        duration: 281, // 4:41
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
        genre: "Pop",
      },
      {
        title: "Watermelon Sugar",
        artist: "Harry Styles",
        duration: 174, // 2:54
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
        genre: "Pop",
      },
      {
        title: "Levitating",
        artist: "Dua Lipa",
        duration: 203, // 3:23
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
        genre: "Pop",
      },
      {
        title: "Stay",
        artist: "The Kid LAROI & Justin Bieber",
        duration: 141, // 2:21
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&h=300&fit=crop",
        genre: "Pop",
      },
      {
        title: "Perfect",
        artist: "Ed Sheeran",
        duration: 263, // 4:23
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
        genre: "Pop",
      },
      {
        title: "Anti-Hero",
        artist: "Taylor Swift",
        duration: 200, // 3:20
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
        genre: "Pop",
      },
    ];

    for (const track of famousTracks) {
      await ctx.db.insert("tracks", track);
    }

    return "Popular English tracks initialized";
  },
});

export const shuffleTracks = query({
  args: {},
  handler: async (ctx) => {
    const tracks = await ctx.db.query("tracks").collect();
    // Simple shuffle algorithm
    for (let i = tracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
    }
    return tracks;
  },
});

// Clear all tracks (useful for resetting)
export const clearAllTracks = mutation({
  args: {},
  handler: async (ctx) => {
    const tracks = await ctx.db.query("tracks").collect();
    for (const track of tracks) {
      await ctx.db.delete(track._id);
    }
    return `Cleared ${tracks.length} tracks`;
  },
});

// Force reinitialize with new tracks
export const forceReinitializeTracks = mutation({
  args: {},
  handler: async (ctx): Promise<string> => {
    // Clear existing tracks first
    const existingTracks = await ctx.db.query("tracks").collect();
    for (const track of existingTracks) {
      await ctx.db.delete(track._id);
    }
    
    // Add new tracks
    const famousTracks = [
      { title: "Shape of You", artist: "Ed Sheeran", duration: 233, audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop", genre: "Pop" },
      { title: "Blinding Lights", artist: "The Weeknd", duration: 200, audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop", genre: "Pop" },
      { title: "Someone Like You", artist: "Adele", duration: 285, audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", coverUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop", genre: "Soul" },
      { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", duration: 270, audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop", genre: "Funk" },
      { title: "Rolling in the Deep", artist: "Adele", duration: 228, audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", coverUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&h=300&fit=crop", genre: "Soul" },
      { title: "Bad Guy", artist: "Billie Eilish", duration: 194, audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop", genre: "Alternative" },
      { title: "Thinking Out Loud", artist: "Ed Sheeran", duration: 281, audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop", genre: "Pop" },
      { title: "Watermelon Sugar", artist: "Harry Styles", duration: 174, audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", coverUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop", genre: "Pop" },
      { title: "Levitating", artist: "Dua Lipa", duration: 203, audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop", genre: "Pop" },
      { title: "Stay", artist: "The Kid LAROI & Justin Bieber", duration: 141, audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", coverUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&h=300&fit=crop", genre: "Pop" },
      { title: "Perfect", artist: "Ed Sheeran", duration: 263, audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop", genre: "Pop" },
      { title: "Anti-Hero", artist: "Taylor Swift", duration: 200, audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop", genre: "Pop" },
    ];

    for (const track of famousTracks) {
      await ctx.db.insert("tracks", track);
    }

    return "Tracks reinitialized with new popular English songs";
  },
});
