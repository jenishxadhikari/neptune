"use client"

import Link from 'next/link'
import { toast } from 'sonner';
import { useRouter } from 'next/navigation'
import { ExternalLink, Heart } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from '@/components/ui/button'
import { Button } from '@/components/ui/button';

import { SavedSongsProps } from '@/features/profile/schemas'
import { remove } from '@/features/songs/actions';

export function SavedSongs({ userId, savedSongs }: SavedSongsProps) {
  const router = useRouter()

  async function removeSong(userId: string, songId: string) {
    try {
      const result = await remove({
        userId: userId,
        songId: songId,
      });
      if (result?.success) {
        toast.success(result.message);
        router.refresh()
      }
      if (!result.success) {
        toast.error(result.message);
      }
    } catch {
      toast.error("Something went wrong! Please try again")
    }
  }

  return (
    <div className="lg:col-span-2 space-y-6" >
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Heart className="w-5 h-5" fill="red" stroke="red" />
            Saved Songs
          </CardTitle>
          <CardDescription className="text-gray-600">Your favorite music discoveries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {savedSongs.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="red" stroke="red" />
              <p className="text-gray-500 text-lg mb-2">No saved songs yet</p>
              <p className="text-gray-400 text-sm">Start recognizing music and save your favorites!</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {savedSongs.map((song, index) => (
                <Card key={index}>
                  <Link href={`/songs/${song.id}`} key={index} className="space-y-4">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">{song.title}</CardTitle>
                      <CardDescription className="text-lg">{song.artist}</CardDescription>
                    </CardHeader>
                  </Link>
                  <CardContent className='flex items-center justify-between gap-x-2'>
                    <Link
                      href={song.url}
                      target='_blank'
                      className={buttonVariants({
                        size: "sm"
                      })}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Youtube
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => removeSong(userId, song.id)}>
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
