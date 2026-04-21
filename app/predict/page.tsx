'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const CAPTURE_INTERVAL = 5000 // 5 seconds

export default function PredictPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [streaming, setStreaming] = useState(false)
  const [emotion, setEmotion] = useState<string | null>(null)
  const [confidence, setConfidence] = useState(0)
  const [animeImage, setAnimeImage] = useState<string | null>(null)
  const [probabilities, setProbabilities] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [homeImage, setHomeImage] = useState<string | null>(null)
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [lastCaptureTime, setLastCaptureTime] = useState(0)

  const API_BASE = 'http://localhost:8000'

  // Initialize webcam
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 }
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setStreaming(true)
        }
      } catch (err) {
        setError('Cannot access webcam. Please allow camera access.')
      }
    }

    startWebcam()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach(track => track.stop())
      }
    }
  }, [])

  // Load home image
  useEffect(() => {
    const loadHomeImage = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/home-image`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        })
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        if (data.image) {
          setHomeImage(`data:image/jpeg;base64,${data.image}`)
          setAnimeImage(`data:image/jpeg;base64,${data.image}`)
        }
      } catch (err) {
        console.error('Error loading home image:', err)
        setError('Failed to connect to backend server')
      }
    }
    loadHomeImage()
  }, [])

  // Capture and predict
  const captureFrame = async () => {
    if (!canvasRef.current || !videoRef.current || loading) return

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)

    try {
      setLoading(true)
      setError(null)

      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return

        const formData = new FormData()
        formData.append('file', blob, 'frame.jpg')

        try {
          const response = await fetch(`${API_BASE}/api/predict`, {
            method: 'POST',
            body: formData
          })

          if (!response.ok) {
            console.error(`HTTP Error: ${response.status} ${response.statusText}`)
            try {
              const errorData = await response.json()
              console.error('Backend error:', errorData)
              setError(`Backend error: ${errorData.detail || response.statusText}`)
            } catch (e) {
              setError(`Backend error: HTTP ${response.status}`)
            }
            setLoading(false)
            return
          }

          const data = await response.json()

          if (data.error) {
            setEmotion(null)
            setAnimeImage(homeImage)
            setProbabilities([])
          } else {
            setEmotion(data.emotion)
            setConfidence(data.confidence)
            setProbabilities(data.probabilities || [])
            if (data.anime_image) {
              setAnimeImage(`data:image/jpeg;base64,${data.anime_image}`)
            }
          }
          setLoading(false)
          setLastCaptureTime(Date.now())
        } catch (err) {
          console.error('Error predicting:', err)
          setError('Error processing frame')
          setLoading(false)
        }
      }, 'image/jpeg', 0.85)
    } catch (err) {
      setError('Error capturing frame')
      setLoading(false)
    }
  }

  // Auto-capture every 5 seconds
  useEffect(() => {
    if (streaming) {
      captureIntervalRef.current = setInterval(() => {
        const timeSinceLastCapture = Date.now() - lastCaptureTime
        if (timeSinceLastCapture >= CAPTURE_INTERVAL - 100 && !loading) {
          captureFrame()
        }
      }, 100)
    }

    return () => {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current)
      }
    }
  }, [streaming, loading, lastCaptureTime])

  // Initial capture
  useEffect(() => {
    if (streaming && lastCaptureTime === 0) {
      setTimeout(() => {
        captureFrame()
      }, 1000)
    }
  }, [streaming])

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Webcam Background */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        onLoadedMetadata={() => {
          if (canvasRef.current && videoRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth
            canvasRef.current.height = videoRef.current.videoHeight
          }
        }}
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-black/40 backdrop-blur-lg border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-white font-semibold hover:bg-white/10 px-4 py-2 rounded-full transition-colors"
        >
          ← Back
        </Link>
        <h1 className="text-white text-2xl font-bold">Live Emotion Detection</h1>
        <div className="flex items-center gap-2 text-green-400 font-semibold">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          Live
        </div>
      </header>

      {/* Main Content */}
      <div className="absolute inset-0 z-10 pt-20 px-6 flex flex-col md:flex-row md:items-center">
        {/* Anime Display - Top on Mobile, Left on Desktop */}
        <div className="md:absolute md:top-24 md:left-6 w-full md:w-auto flex justify-center md:block mb-8 md:mb-0">
          <div className="relative">
            {animeImage ? (
              <img
                src={animeImage}
                alt="Anime character"
                className="max-h-64 md:max-h-80 max-w-xs object-contain drop-shadow-2xl"
              />
            ) : (
              <div className="text-8xl opacity-20">🎨</div>
            )}

            {/* Loading Spinner */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white font-semibold">Analyzing...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Panel - Bottom on Mobile, Right Side on Desktop */}
        <div className="md:absolute md:right-6 md:top-1/2 md:transform md:-translate-y-1/2 w-full sm:max-w-sm md:w-auto md:max-w-md mt-auto md:mt-0 self-center md:self-auto">
          <div className="bg-black/50 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8">
            {emotion ? (
              <>
                {/* Emotion Name */}
                <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4 md:mb-6 text-center uppercase">
                  {emotion}
                </h2>

                {/* Confidence Bar - Desktop Only */}
                <div className="hidden md:block mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-white/80 font-semibold">Confidence</span>
                    <span className="text-2xl font-bold text-white">{Math.round(confidence * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${confidence * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Probabilities - Desktop Only */}
                {probabilities.length > 0 && (
                  <div className="hidden md:block border-t border-white/10 pt-6">
                    <h4 className="text-xs font-bold uppercase text-white/60 mb-4 tracking-wider">All Emotions</h4>
                    <div className="space-y-3">
                      {probabilities.map((item) => (
                        <div key={item.emotion} className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-white/80 w-16">{item.emotion}</span>
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                              style={{ width: `${item.probability * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-white/90 w-10 text-right">{item.percentage}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-2xl mb-2">📸</p>
                <p className="text-white font-semibold mb-2">Waiting for face detection...</p>
                <p className="text-white/60 text-sm">Show your face to the camera</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Capture Indicator */}
            <div className="mt-4 md:mt-8 flex items-center justify-center gap-2 text-white/60 text-xs">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span>Next capture in {CAPTURE_INTERVAL / 1000}s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
