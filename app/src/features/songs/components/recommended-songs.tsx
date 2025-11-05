import Link from 'next/link'
import { Heart } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RecommendedSongsProps } from '@/features/songs/schemas'

export function RecommendedSongs({ songs }: RecommendedSongsProps) {
  return (
    <div className="lg:col-span-2 space-y-6" >
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Heart className="w-5 h-5" fill="red" stroke="red" />
            Recommended Songs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {songs.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="red" stroke="red" />
              <p className="text-gray-500 text-lg mb-2">No saved songs yet</p>
              <p className="text-gray-400 text-sm">Start recognizing music and save your favorites!</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              {songs.map((song, index) => (
                <Card key={index}>
                  <Link href={`/songs/${song.id}`} key={index} className="space-y-4">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold">{song.title}</CardTitle>
                      <CardDescription className="text-lg">{song.artist}</CardDescription>
                      <p>Similarity: {song.similarity}</p>
                    </CardHeader>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
