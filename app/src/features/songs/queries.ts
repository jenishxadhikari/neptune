import { db } from "@/db/index";
import { songs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getSong(songId: string) {
  try {
    const song = await db.query.songs.findFirst({
      where: eq(songs.id, songId)
    })
    return song ?? null
  } catch (error) {
    console.error("[GET_SONG_ERROR] : ", error);
    return null
  }
}
