import z from "zod";

import { songs } from '@/db/schema'

export const songSchema = z.object({
  title: z.string().min(1, { message: "Please enter a title" }),
  artist: z.string().min(1, { message: "Please enter an artist" }),
  album: z.string().min(1, { message: "Please enter an album" }),
  genre: z.string().min(1, { message: "Please enter a genre" }),
  year: z.string().min(1, { message: "Please enter a year" }),
  duration: z.string().min(1, { message: "Please enter a duration" }),
  url: z.url({ message: "Please enter a valid url" }),
})

export const editSongSchema = z.object({
  id: z.string(),
  title: z.string().min(1, { message: "Please enter a title" }),
  artist: z.string().min(1, { message: "Please enter an artist" }),
  album: z.string().min(1, { message: "Please enter an album" }),
  genre: z.string().min(1, { message: "Please enter a genre" }),
  year: z.string().min(1, { message: "Please enter a year" }),
  duration: z.string().min(1, { message: "Please enter a duration" }),
  url: z.url({ message: "Please enter a valid url" }),
})

export type Song = typeof songs.$inferSelect

export type SongColumn = z.infer<typeof editSongSchema>

export type CellActionProps = {
  data: SongColumn
}

export type SongClientProps = {
  data: SongColumn[]
}

export const updateSongSchema = songSchema.extend({
  id: z.string(),
});
