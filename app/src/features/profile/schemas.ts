import z from "zod"

export const songSchema = z.object({
  id: z.string(),
  title: z.string().min(1, { message: "Please enter a title" }),
  artist: z.string().min(1, { message: "Please enter an artist" }),
  album: z.string().min(1, { message: "Please enter an album" }),
  genre: z.string().min(1, { message: "Please enter a genre" }),
  year: z.string().min(1, { message: "Please enter a year" }),
  duration: z.string().min(1, { message: "Please enter a duration" }),
  url: z.url({ message: "Please enter a valid url" }),
})

export type SongSchema = z.infer<typeof songSchema>

export type SavedSongsProps = {
  userId: string
  savedSongs: SongSchema[]
}
