import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  tracks: defineTable({
    title: v.string(),
    artist: v.string(),
    duration: v.number(), // in seconds
    audioUrl: v.string(),
    coverUrl: v.optional(v.string()),
    genre: v.optional(v.string()),
  }),
  playlists: defineTable({
    name: v.string(),
    userId: v.id("users"),
    trackIds: v.array(v.id("tracks")),
    isPublic: v.boolean(),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
