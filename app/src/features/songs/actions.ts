"use server";

import z from "zod";
import { eq, and } from "drizzle-orm";

import { savedSongs } from "@/db/schema";
import { db } from "@/db/index";

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
