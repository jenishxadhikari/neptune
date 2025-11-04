import { db } from "@/db/index";
import { savedSongs, songs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getSavedSongs(userId: string) {
  try {
    return await db
    .select({
      id: songs.id,
      title: songs.title,
      artist: songs.artist,
      album: songs.album,
      year: songs.year,
      duration: songs.duration,
      genre: songs.genre,
      url: songs.url,
    })
    .from(savedSongs)
    .innerJoin(songs, eq(savedSongs.songId, songs.id))
    .where(eq(savedSongs.userId, userId));
  } catch (error) {
    console.log(`[GET_SAVED_SONGS_ERROR]`, error);
    return null
  }
}