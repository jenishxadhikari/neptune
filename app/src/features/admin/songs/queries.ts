import { eq } from "drizzle-orm";

import { db } from "@/db/index";
import { songs } from "@/db/schema";

export async function getSongs() {
  try {
    const songs = await db.query.songs.findMany()
    return songs
  } catch (error) {
    console.error("[GET_SONGS_ERROR] : ", error);
    return null
  }
}

export async function getSong(songId: string) {
  try {
    const song = await db.query.songs.findFirst({
      where: eq(songs.id, songId)
    })
    return song ?? null
  } catch (error) {
    console.log("[GET SONG ERROR] : ", error);
    return null
  }
}
