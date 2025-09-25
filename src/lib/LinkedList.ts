// Enhanced Doubly Linked List Node for Music Tracks
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

  constructor(track: {
    _id: string;
    title: string;
    artist: string;
    duration: number;
    audioUrl: string;
    coverUrl?: string;
    genre?: string;
  }) {
    this.id = track._id;
    this.title = track.title;
    this.artist = track.artist;
    this.duration = track.duration;
    this.audioUrl = track.audioUrl;
    this.coverUrl = track.coverUrl;
    this.genre = track.genre;
  }

  // Get formatted duration
  getFormattedDuration(): string {
    const minutes = Math.floor(this.duration / 60);
    const seconds = this.duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

// Enhanced Circular Doubly Linked List for Music Playlist
export class MusicLinkedList {
  private head: TrackNode | null = null;
  private current: TrackNode | null = null;
  private size: number = 0;
  private isShuffled: boolean = false;
  private originalOrder: TrackNode[] = [];

  // Add a track to the end of the list
  addTrack(track: {
    _id: string;
    title: string;
    artist: string;
    duration: number;
    audioUrl: string;
    coverUrl?: string;
    genre?: string;
  }): void {
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

  // Move to the next track
  nextTrack(): TrackNode | null {
    if (!this.current) return null;
    this.current = this.current.next;
    return this.current;
  }

  // Move to the previous track
  prevTrack(): TrackNode | null {
    if (!this.current) return null;
    this.current = this.current.prev;
    return this.current;
  }

  // Get current track
  getCurrentTrack(): TrackNode | null {
    return this.current;
  }

  // Set current track by ID
  setCurrentTrack(trackId: string): TrackNode | null {
    if (!this.head) return null;
    
    let node = this.head;
    do {
      if (node.id === trackId) {
        this.current = node;
        return node;
      }
      node = node.next!;
    } while (node !== this.head);
    
    return null;
  }

  // Get all tracks as array
  getAllTracks(): TrackNode[] {
    if (!this.head) return [];
    
    const tracks: TrackNode[] = [];
    let node = this.head;
    
    do {
      tracks.push(node);
      node = node.next!;
    } while (node !== this.head);
    
    return tracks;
  }

  // Shuffle the playlist
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
      this.addTrack({
        _id: track.id,
        title: track.title,
        artist: track.artist,
        duration: track.duration,
        audioUrl: track.audioUrl,
        coverUrl: track.coverUrl,
        genre: track.genre,
      });
    });

    // Restore current track
    if (currentTrack) {
      this.setCurrentTrack(currentTrack.id);
    }

    this.isShuffled = true;
  }

  // Restore original order
  restoreOrder(): void {
    if (!this.isShuffled || this.originalOrder.length === 0) return;

    const currentTrack = this.current;
    
    // Rebuild with original order
    this.clear();
    this.originalOrder.forEach(track => {
      this.addTrack({
        _id: track.id,
        title: track.title,
        artist: track.artist,
        duration: track.duration,
        audioUrl: track.audioUrl,
        coverUrl: track.coverUrl,
        genre: track.genre,
      });
    });

    // Restore current track
    if (currentTrack) {
      this.setCurrentTrack(currentTrack.id);
    }

    this.isShuffled = false;
  }

  // Get tracks by genre
  getTracksByGenre(genre: string): TrackNode[] {
    return this.getAllTracks().filter(track => 
      track.genre?.toLowerCase() === genre.toLowerCase()
    );
  }

  // Search tracks
  searchTracks(query: string): TrackNode[] {
    const searchTerm = query.toLowerCase();
    return this.getAllTracks().filter(track =>
      track.title.toLowerCase().includes(searchTerm) ||
      track.artist.toLowerCase().includes(searchTerm) ||
      track.genre?.toLowerCase().includes(searchTerm)
    );
  }

  // Get total playlist duration
  getTotalDuration(): number {
    return this.getAllTracks().reduce((total, track) => total + track.duration, 0);
  }

  // Get formatted total duration
  getFormattedTotalDuration(): string {
    const totalSeconds = this.getTotalDuration();
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Update original order for shuffle/restore functionality
  private updateOriginalOrder(): void {
    if (!this.isShuffled) {
      this.originalOrder = this.getAllTracks();
    }
  }

  // Clear the list
  clear(): void {
    this.head = null;
    this.current = null;
    this.size = 0;
  }

  // Get size
  getSize(): number {
    return this.size;
  }

  // Check if list is empty
  isEmpty(): boolean {
    return this.size === 0;
  }

  // Check if shuffled
  getIsShuffled(): boolean {
    return this.isShuffled;
  }

  // Remove a track by ID
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
}
