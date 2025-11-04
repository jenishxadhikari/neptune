import { and, eq } from 'drizzle-orm';

import { db } from '@/db/index';
import { savedSongs } from '@/db/schema';
import { auth } from '@/lib/auth';

import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { getSong } from "@/features/songs/queries"
import { SongClient } from '@/features/songs/components/song-client'

export default async function SongPage({ params }: { params: Promise<{ songId: string }> }) {
  const { songId } = await params;
  const result = await getSong(songId);
  const payload = await auth()

  if (!result) return <div className="text-center py-20 text-gray-500">Song not found.</div>;
  if(!payload?.userId) return null

  const song = {
    id: songId,
    userId: payload?.userId.toString(),
    title: result.title,
    artist: result.artist,
    album: result.album,
    year: result.year,
    duration: result.duration,
    genre: result.genre,
    url: result.url
  }

  // Check if already saved
  const [alreadySaved] = await db
    .select()
    .from(savedSongs)
    .where(
      and(
        eq(savedSongs.userId, song.userId),
        eq(savedSongs.songId, songId)
      )
    );

  return (
    <section className='py-6 md:py-10'>
      <MaxWidthWrapper className="space-y-6">
        <SongClient song={song} isAlreadySaved={!!alreadySaved} />
      </MaxWidthWrapper>
    </section>
  )
}