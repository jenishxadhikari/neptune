import { MaxWidthWrapper } from "@/components/max-width-wrapper"
import { EditSongForm } from "@/features/admin/songs/components/edit-song-form"
import { getSong } from "@/features/admin/songs/queries";

export default async function EditSong({ params }: { params: Promise<{ songId: string }> }) {
  const { songId } = await params;
  const song = await getSong(songId);

  if(!song) {
    return (
      <section className="py-6 md:py-10">
        <MaxWidthWrapper>
          <h1 className="text-2xl font-bold">Song not found</h1>
        </MaxWidthWrapper>
      </section>
    )
  }

  return (
    <section className="py-6 md:py-10">
      <MaxWidthWrapper>
        <EditSongForm data={song} />
      </MaxWidthWrapper>
    </section>
  )
}
