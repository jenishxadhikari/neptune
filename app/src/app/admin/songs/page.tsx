import { MaxWidthWrapper } from '@/components/max-width-wrapper'
import { getSongs } from '@/features/admin/songs/queries'
import { SongColumn } from '@/features/admin/songs/schemas'
import { AdminClient } from '@/features/admin/songs/components/admin-client'

export default async function SongsPage() {
  const songs = await getSongs()

  if (!songs) {
    return (
      <section className="py-6 md:py-10">
        <MaxWidthWrapper>
          <h1 className="text-2xl font-bold">Songs not found</h1>
        </MaxWidthWrapper>
      </section>
    )
  }

  const formattedSongs: SongColumn[] = songs.map((item) => ({
    id: item.id,
    title: item.title,
    artist: item.artist,
    album: item.album,
    genre: item.genre,
    year: item.year,
    duration: item.duration,
    url: item.url
  }))

  return (
    <section className='py-6 md:py-10'>
      <MaxWidthWrapper>
        <AdminClient data={formattedSongs} />
      </MaxWidthWrapper>
    </section>
  )
}