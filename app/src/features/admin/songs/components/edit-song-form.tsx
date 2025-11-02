"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Music } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ErrorAlert } from "@/components/error-alert"
import { SubmitButton } from "@/components/submit-button"
import { Header } from "@/components/header"

import { editSongSchema, songSchema } from "@/features/admin/songs/schemas"
import { updateSong } from "@/features/admin/songs/actions"

interface EditSongFormProps {
  data: z.infer<typeof editSongSchema>
}

export function EditSongForm({ data }: EditSongFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof songSchema>>({
    resolver: zodResolver(songSchema),
    defaultValues: {
      title: data.title,
      artist: data.artist,
      album: data.album,
      genre: data.genre,
      year: data.year,
      duration: data.duration,
      url: data.url
    },
  })

  const pending = form.formState.isSubmitting

  async function onSubmit(values: z.infer<typeof songSchema>) {
    setError(null)
    try {
      const result = await updateSong({
        id: data.id,
        title: values.title,
        artist: values.artist,
        album: values.album,
        genre: values.genre,
        year: values.year,
        duration: values.duration,
        url: values.url
      })
      if (!result?.success) {
        setError(result.message)
      }
      if (result?.success) {
        toast.success(result.message)
        form.reset()
        router.push("/admin/songs")
      }
      return
    } catch {
      setError("Something went wrong, please try again.")
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Header
        title="Edit Song"
        description="Edit the song in the system."
        icon={Music}
      >
        <Button onClick={() => router.back()} variant="outline">
          Back
        </Button>
      </Header>
      <Card>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the title"
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="artist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Artist</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the artist"
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="album"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Album</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the album"
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the genre"
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the year of release"
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the duration ( 3:12 )"
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Youtube URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the youtube url"
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!!error && (
                <ErrorAlert message={error} />
              )}
              <SubmitButton pending={pending} label="Save Changes" />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
