"use server";

import z from "zod";
import { eq } from "drizzle-orm";

import { db } from "@/db/index";
import { songs } from "@/db/schema";

import { songSchema, updateSongSchema } from "./schemas";

export async function addSong(data: z.infer<typeof songSchema>) {
  try {
    // 1. Validate form fields
    const validatedFields = songSchema.safeParse(data);
    // If any form fields are invalid, return early
    if (!validatedFields.success) {
      return { message: "Invalid form fields" };
    }

    const { title, artist, album, genre, year, duration, url } = validatedFields.data;

    // 2. Insert the song into the database
    const song = await db
      .insert(songs)
      .values({
        title,
        artist,
        album,
        genre,
        year,
        duration,
        url
      })
      .returning({ id: songs.id });

    const currentSong = song[0];
    // If song is not found, return early
    if (!currentSong) {
      return {
        success: false,
        message: 'An error occurred while adding the song.'
      };
    }

    return {
      success: true,
      message: "Song added successfully."
    };

  } catch (error) {
    console.error('[ADD SONG ERROR] : ', error);
    throw new Error('Failed to add song! Please try again.');
  }
}

export async function updateSong(data: z.infer<typeof updateSongSchema>) {
  try {
    // 1. Validate input
    const validatedFields = updateSongSchema.safeParse(data);
    if (!validatedFields.success) {
      return { success: false, message: "Invalid form fields" };
    }

    const { id, title, artist, album, genre, year, duration, url } =
      validatedFields.data;

    // 2. Update the song in the database
    const song = await db
      .update(songs)
      .set({
        title,
        artist,
        album,
        genre,
        year,
        duration,
        url,
      })
      .where(eq(songs.id, id))
      .returning({ id: songs.id });

    const updatedSong = song[0];
    if (!updatedSong) {
      return {
        success: false,
        message: "Song not found or update failed.",
      };
    }

    return {
      success: true,
      message: "Song updated successfully.",
    };
  } catch (error) {
    console.error("[UPDATE SONG ERROR] : ", error);
    throw new Error("Failed to update song! Please try again.");
  }
}

export async function deleteSong(id: string) {
  try {
    if (!id) {
      return { success: false, message: "Song ID is required." };
    }

    const deleted = await db
      .delete(songs)
      .where(eq(songs.id, id))
      .returning({ id: songs.id });

    const deletedSong = deleted[0];
    if (!deletedSong) {
      return { success: false, message: "Song not found or already deleted." };
    }

    return {
      success: true,
      message: "Song deleted successfully.",
    };
  } catch (error) {
    console.error("[DELETE SONG ERROR] : ", error);
    throw new Error("Failed to delete song! Please try again.");
  }
}