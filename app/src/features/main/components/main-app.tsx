"use client"

import { useState, useRef } from "react"
import {
  Mic,
  MicOff,
  Music,
  LoaderCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { useRouter } from "next/navigation"

export function MainApp() {
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  // Start recording
  const startRecording = async () => {
    setLoading(false)
    setMessage(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = handleStop

      mediaRecorder.start()

      // Stop after 15 seconds
      timerRef.current = setTimeout(() => {
        stopRecording()
      }, 15000)

      setListening(true)
    } catch (err) {
      setMessage("Microphone access denied or not available.")
      setListening(false)
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
    setListening(false)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }

  // Handle recording stop
  const handleStop = async () => {
    setLoading(true)
    // inside handleStop
    const blob = new Blob(chunksRef.current, { type: "audio/webm" })

    // get real duration using Web Audio API
    const arrayBuffer = await blob.arrayBuffer()
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const decoded = await audioCtx.decodeAudioData(arrayBuffer)
    const duration = decoded.duration

    if (duration <= 5) {
      setLoading(false)
      setMessage("Audio is too short to identify. Please record at least 5 seconds.")
      return
    }

    // Send to API endpoint
    const formData = new FormData()
    formData.append("audio", blob, "recording.webm")

    try {
      const response = await fetch("http://localhost:8000/identify", {
        method: "POST",
        body: formData
      })
      if (!response.ok) {
        throw new Error("Failed to identify song")
      }

      const result = await response.json()
      console.log(result)

      if (!result.results?.length || result.results[0].score <= 20) {
        setMessage("Song not identified. Please try again.")
        return
      }

      const songId = result.results[0].id
      router.push(`/songs/${songId}`)
    } catch (err) {
      setMessage("Failed to send audio to server.")
    } finally {
      setLoading(false)
    }
  }

  // Handle mic button click
  const handleMicClick = () => {
    if (listening) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  return (
    <div className="flex flex-col gap-y-6">
      <section className="flex items-center justify-center gap-3 mb-4">
        <Button size="icon">
          <Music />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          Music Recognition System
        </h1>
      </section>

      <section>
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl tracking-tight">
              Tap to identify music
            </CardTitle>
            <CardDescription className="text-base">
              Hold your device near the audio source
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center flex-col gap-y-4">
            <div
              className={`size-40 rounded-full relative cursor-pointer ${listening ? "bg-red-500" : "bg-primary"
                }`}
              onClick={handleMicClick}
            >
              {listening ? (
                <MicOff className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-12" />
              ) : (
                <Mic className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-12" />
              )}
            </div>
            {listening && (
              <Button variant="outline" disabled>
                <LoaderCircle className="animate-spin" />
                &nbsp;Recording... {`5 sec < audio < 15 sec`}
              </Button>
            )}
            {loading && (
              <Button variant="outline" disabled>
                <LoaderCircle className="animate-spin" />
                &nbsp;Identifying Song
              </Button>
            )}
            {message && (
              <p className="text-red-500 text-sm font-medium">{message}</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
