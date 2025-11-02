import { MaxWidthWrapper } from "@/components/max-width-wrapper"
import { AddSongForm } from "@/features/admin/songs/components/add-song-form"

export default function AddSong() {
  return (
    <section className="py-6 md:py-10">
      <MaxWidthWrapper>
        <AddSongForm />
      </MaxWidthWrapper>
    </section>
  )
}
