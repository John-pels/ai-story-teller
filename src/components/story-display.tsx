'use client'

import { Button, Card, CardContent, CardFooter } from '@/components/ui'
import { ArrowLeft, ArrowRight, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface StoryDisplayProps {
  story: string
}

export default function StoryDisplay({ story }: StoryDisplayProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [pages, setPages] = useState<string[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcription, setTranscription] = useState('')
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    setPages(story.split('\n\n'))
  }, [story])

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance()
      utteranceRef.current = utterance

      utterance.onboundary = (event) => {
        const text = pages[currentPage]
        setTranscription(text.substring(0, event.charIndex))
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        setTranscription('')
      }

      return () => {
        window.speechSynthesis.cancel()
      }
    }
  }, [pages, currentPage])

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1)
      setTranscription('')
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
      setTranscription('')
    }
  }

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window && utteranceRef.current) {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
        setTranscription('')
      } else {
        utteranceRef.current.text = pages[currentPage]
        window.speechSynthesis.speak(utteranceRef.current)
        setIsSpeaking(true)
      }
    }
  }

  return (
    <Card className="mt-4">
      <CardContent className="p-6">
        <div className="prose max-w-none space-y-4">
          <div aria-live="polite">
            {isSpeaking ? (
              <p className="text-lg font-medium">
                <span className="text-primary">{transcription}</span>
                <span className="text-muted-foreground">
                  {pages[currentPage].substring(transcription.length)}
                </span>
              </p>
            ) : (
              <p className="text-lg">{pages[currentPage]}</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handlePrevPage} disabled={currentPage === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button
          onClick={handleTextToSpeech}
          aria-label={isSpeaking ? 'Stop speaking' : 'Start speaking'}
        >
          {isSpeaking ? (
            <VolumeX className="mr-2 h-4 w-4" />
          ) : (
            <Volume2 className="mr-2 h-4 w-4" />
          )}
          {isSpeaking ? 'Stop' : 'Read Aloud'}
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === pages.length - 1}
        >
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
