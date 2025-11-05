"use server";

import z from "zod";
import { eq, and } from "drizzle-orm";

import { savedSongs } from "@/db/schema";
import { db } from "@/db/index";
import { cosineSimilarity } from "@/lib/cosine-similarity";

import { getSongs } from "@/features/admin/songs/queries";

import { saveSongSchema } from "./schemas";
import { getSong } from "./queries";

export async function save(data: z.infer<typeof saveSongSchema>) {
  try {
    // 1. Validate form fields
    const validatedFields = saveSongSchema.safeParse(data);
    if (!validatedFields.success) {
      return { success: false, message: "Invalid form fields" };
    }

    const { userId, songId } = validatedFields.data;

    // 2. Check if the song exists
    const song = await getSong(songId);
    if (!song) {
      return {
        success: false,
        message: "Song not found.",
      };
    }

    // 3. Check if the song is already saved by the user

    const [alreadySaved] = await db
      .select()
      .from(savedSongs)
      .where(
        and(
          eq(savedSongs.userId, userId),
          eq(savedSongs.songId, songId)
        )
      );

    if (alreadySaved) {
      return {
        success: false,
        message: "You have already saved this song.",
      };
    }

    // 4. Save the song for the user
    const [saved] = await db
      .insert(savedSongs)
      .values({ userId, songId })
      .returning();

    if (!saved) {
      return {
        success: false,
        message: "An error occurred while saving the song.",
      };
    }

    return {
      success: true,
      message: "Song saved successfully!",
    };
  } catch (error) {
    console.error("[SAVE SONG ERROR]:", error);
    return {
      success: false,
      message: "Failed to save song! Please try again.",
    };
  }
}

export async function remove({ userId, songId }: { userId: string; songId: string }) {
  try {
    await db
      .delete(savedSongs)
      .where(and(eq(savedSongs.userId, userId), eq(savedSongs.songId, songId)));
    return { success: true, message: "Song removed from your saved list." };
  } catch (error) {
    return { success: false, message: "Failed to remove song." };
  }
}

function encodeSong(
  year: number,
  genre: string,
  genreMap: Record<string, number>,
  minYear: number,
  maxYear: number
): number[] {
  const yearNorm = maxYear > minYear ? (year - minYear) / (maxYear - minYear) : 0;
  const vec = new Array(Object.keys(genreMap).length).fill(0);
  if (genre in genreMap) {
    vec[genreMap[genre]] = 1;
  }
  return [yearNorm, ...vec];
}

export async function recommendSongs(songId: string, topN: number = 4) {
  try {
    const allSongs = await getSongs();
    const targetSong = await getSong(songId);

    if (!targetSong) {
      return [];
    }

    if (!allSongs) {
      return [];
    }

    // Build genre map dynamically from DB
    const genres = Array.from(new Set(allSongs.map((s) => s.genre)));
    
    const genreMap: Record<string, number> = {};
    genres.forEach((g, i) => (genreMap[g] = i));

    // Find min/max year for normalization
    const years = allSongs.map((s) => Number(s.year));
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    // Encode all songs into vectors
    const encoded = allSongs.map((s) => ({
      song: s,
      vector: encodeSong(Number(s.year), s.genre, genreMap, minYear, maxYear),
    }));

  
    const target = encoded.find((e) => e.song.id === targetSong.id);
    if (!target) return [];


    // Compute similarity with all others
    const similarities = encoded
      .filter((e) => e.song.id !== target.song.id)
      .map((e) => ({
        song: e.song,
        similarity: cosineSimilarity(target.vector, e.vector),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topN);

    return similarities;
  } catch (error) {
    console.log(`[RECOMMEND_SONGS_ERROR]`, error);
    return null
  }
}