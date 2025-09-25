# Music System Linked List Implementation Documentation

## Overview

This document explains the implementation of a **Circular Doubly Linked List** data structure used in a music streaming application. The implementation is specifically designed to manage music playlists with efficient navigation, shuffle functionality, and track management.

## Table of Contents

1. [Data Structure Overview](#data-structure-overview)
2. [TrackNode Class](#tracknode-class)
3. [MusicLinkedList Class](#musiclinkedlist-class)
4. [Key Operations](#key-operations)
5. [Visual Representation](#visual-representation)
6. [Algorithm Explanations](#algorithm-explanations)
7. [Time and Space Complexity](#time-and-space-complexity)
8. [Usage Examples](#usage-examples)

## Data Structure Overview

### What is a Circular Doubly Linked List?

A **Circular Doubly Linked List** is a data structure where:
- Each node contains data and two pointers: `next` and `prev`
- The last node's `next` pointer points to the first node
- The first node's `prev` pointer points to the last node
- This creates a circular structure allowing seamless navigation in both directions

### Why Use This Structure for Music Playlists?

1. **Seamless Navigation**: Easy forward/backward track navigation
2. **Circular Playback**: After the last track, automatically goes to the first track
3. **Efficient Insertion/Deletion**: O(1) operations for adding/removing tracks
4. **Memory Efficiency**: No need for array resizing
5. **Shuffle Support**: Easy to reorder without losing original sequence

## TrackNode Class

```typescript
export class TrackNode {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  coverUrl?: string;
  genre?: string;
  next: TrackNode | null = null;
  prev: TrackNode | null = null;
}
```

### Properties:
- **Data Fields**: `id`, `title`, `artist`, `duration`, `audioUrl`, `coverUrl`, `genre`
- **Pointer Fields**: `next` (points to next track), `prev` (points to previous track)

### Key Methods:
- `getFormattedDuration()`: Converts duration in seconds to MM:SS format

## MusicLinkedList Class

### Core Properties:
```typescript
private head: TrackNode | null = null;        // Points to first track
private current: TrackNode | null = null;     // Points to currently playing track
private size: number = 0;                     // Total number of tracks
private isShuffled: boolean = false;          // Shuffle state
private originalOrder: TrackNode[] = [];     // Backup of original order
```

## Key Operations

### 1. Adding a Track (`addTrack`)

**Algorithm:**
```typescript
addTrack(track) {
  const newNode = new TrackNode(track);
  
  if (!this.head) {
    // First track - create circular reference
    this.head = newNode;
    this.current = newNode;
    newNode.next = newNode;
    newNode.prev = newNode;
  } else {
    // Insert at the end and maintain circular structure
    const tail = this.head.prev!;
    
    newNode.next = this.head;
    newNode.prev = tail;
    tail.next = newNode;
    this.head.prev = newNode;
  }
  
  this.size++;
  this.updateOriginalOrder();
}
```

**Steps:**
1. Create new TrackNode
2. If list is empty: Set head and current, make node point to itself
3. If list has nodes: Insert at end, update tail's next and head's prev
4. Increment size and update original order

### 2. Navigation (`nextTrack`, `prevTrack`)

**Next Track:**
```typescript
nextTrack(): TrackNode | null {
  if (!this.current) return null;
  this.current = this.current.next;
  return this.current;
}
```

**Previous Track:**
```typescript
prevTrack(): TrackNode | null {
  if (!this.current) return null;
  this.current = this.current.prev;
  return this.current;
}
```

### 3. Shuffle Algorithm (`shuffle`)

**Fisher-Yates Shuffle Implementation:**
```typescript
shuffle(): void {
  if (this.size <= 1) return;

  const tracks = this.getAllTracks();
  const currentTrack = this.current;
  
  // Fisher-Yates shuffle algorithm
  for (let i = tracks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
  }

  // Rebuild the circular linked list with shuffled order
  this.clear();
  tracks.forEach(track => {
    this.addTrack(track);
  });

  // Restore current track
  if (currentTrack) {
    this.setCurrentTrack(currentTrack.id);
  }

  this.isShuffled = true;
}
```

**Steps:**
1. Get all tracks as array
2. Apply Fisher-Yates shuffle algorithm
3. Clear current list
4. Rebuild list with shuffled order
5. Restore current track position
6. Mark as shuffled

### 4. Removing a Track (`removeTrack`)

**Algorithm:**
```typescript
removeTrack(trackId: string): boolean {
  if (!this.head || this.size === 0) return false;

  let nodeToRemove: TrackNode | null = null;
  let node = this.head;

  // Find the node to remove
  do {
    if (node.id === trackId) {
      nodeToRemove = node;
      break;
    }
    node = node.next!;
  } while (node !== this.head);

  if (!nodeToRemove) return false;

  // Handle single node case
  if (this.size === 1) {
    this.clear();
    return true;
  }

  // Update connections
  const prevNode = nodeToRemove.prev!;
  const nextNode = nodeToRemove.next!;
  
  prevNode.next = nextNode;
  nextNode.prev = prevNode;

  // Update head if necessary
  if (nodeToRemove === this.head) {
    this.head = nextNode;
  }

  // Update current if necessary
  if (nodeToRemove === this.current) {
    this.current = nextNode;
  }

  this.size--;
  this.updateOriginalOrder();
  return true;
}
```

## Visual Representation

### Empty List:
```
head: null
current: null
size: 0
```

### Single Track:
```
head ──┐
       │
    [Track1] ←──┐
    next ──────┘
    prev ──────┘
```

### Multiple Tracks:
```
head ──┐
       │
    [Track1] ←──→ [Track2] ←──→ [Track3] ←──┐
    ↑                                    │
    └────────────────────────────────────┘
```

### After Shuffle:
```
head ──┐
       │
    [Track3] ←──→ [Track1] ←──→ [Track2] ←──┐
    ↑                                    │
    └────────────────────────────────────┘
```

## Algorithm Explanations

### Fisher-Yates Shuffle Algorithm

The Fisher-Yates shuffle is used to randomly reorder the playlist:

1. **Start from the last element**
2. **Pick a random index** from 0 to current index (inclusive)
3. **Swap** the current element with the randomly selected element
4. **Move to previous element** and repeat

**Why Fisher-Yates?**
- Produces truly random permutations
- Each permutation has equal probability
- O(n) time complexity
- In-place shuffling (space efficient)

### Circular Structure Benefits

1. **Seamless Loop**: After last track, automatically goes to first track
2. **Bidirectional Navigation**: Easy forward/backward movement
3. **No Edge Cases**: No special handling for first/last elements
4. **Consistent Interface**: Same operations work regardless of position

## Time and Space Complexity

| Operation | Time Complexity | Space Complexity | Notes |
|-----------|----------------|------------------|-------|
| `addTrack` | O(1) | O(1) | Direct insertion at end |
| `removeTrack` | O(n) | O(1) | Need to find node first |
| `nextTrack` | O(1) | O(1) | Direct pointer access |
| `prevTrack` | O(1) | O(1) | Direct pointer access |
| `shuffle` | O(n) | O(n) | Need to rebuild entire list |
| `searchTracks` | O(n) | O(n) | Linear search through all nodes |
| `getAllTracks` | O(n) | O(n) | Traverse entire list |

## Usage Examples

### Basic Usage:
```typescript
// Create playlist
const playlist = new MusicLinkedList();

// Add tracks
playlist.addTrack({
  _id: "1",
  title: "Song 1",
  artist: "Artist 1",
  duration: 180,
  audioUrl: "song1.mp3"
});

// Navigate
const nextTrack = playlist.nextTrack();
const prevTrack = playlist.prevTrack();

// Shuffle
playlist.shuffle();

// Restore original order
playlist.restoreOrder();
```

### Advanced Operations:
```typescript
// Search tracks
const rockSongs = playlist.searchTracks("rock");

// Get tracks by genre
const jazzTracks = playlist.getTracksByGenre("jazz");

// Get playlist statistics
const totalDuration = playlist.getTotalDuration();
const formattedDuration = playlist.getFormattedTotalDuration();
const playlistSize = playlist.getSize();
```

## Key Features

### 1. **Circular Navigation**
- Seamless forward/backward movement
- No edge cases for first/last tracks
- Automatic loop-back functionality

### 2. **Shuffle Management**
- Preserves original order for restoration
- Maintains current track position
- Efficient Fisher-Yates algorithm

### 3. **Search and Filter**
- Text-based search across title, artist, genre
- Genre-based filtering
- Case-insensitive matching

### 4. **Playlist Statistics**
- Total duration calculation
- Formatted time display
- Track count management

### 5. **Memory Management**
- Efficient pointer-based structure
- No array resizing overhead
- Automatic garbage collection support

## Conclusion

This Circular Doubly Linked List implementation provides an efficient and elegant solution for managing music playlists. The structure offers:

- **O(1) navigation** between tracks
- **Seamless circular playback**
- **Efficient shuffle functionality**
- **Flexible search and filtering**
- **Memory-efficient storage**

The implementation demonstrates advanced data structure concepts while providing practical functionality for a real-world music streaming application. The circular nature eliminates edge cases and provides a consistent user experience for playlist navigation.
