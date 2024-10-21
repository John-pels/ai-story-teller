'use client'

import { useEffect, useRef, useState } from 'react'
import { Button, Card, CardContent, CardFooter } from '@/components/ui'
import { ArrowLeft, ArrowRight, Volume2, VolumeX } from 'lucide-react'

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
    const processedPages = story.split('\n\n')
    setPages(processedPages)
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

  const estimatedTotalMinutes = Math.ceil(pages.join(' ').split(' ').length / 200)

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
              <div className="text-lg">
                {pages[currentPage]?.split('\n').map((line, index) => (
                  <p key={index} className={index === 0 ? "font-bold" : ""}>
                    {line.replace(/^\*\*(.*?)\*\*/, '$1')}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex flex-wrap justify-between w-full gap-2">
          <Button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="flex-grow sm:flex-grow-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <Button
            onClick={handleTextToSpeech}
            aria-label={isSpeaking ? 'Stop speaking' : 'Start speaking'}
            className="flex-grow sm:flex-grow-0"
          >
            {isSpeaking ? (
              <VolumeX className="mr-2 h-4 w-4" />
            ) : (
              <Volume2 className="mr-2 h-4 w-4" />
            )}
            <span className="hidden sm:inline">{isSpeaking ? 'Stop' : 'Read Aloud'}</span>
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === pages.length - 1}
            className="flex-grow sm:flex-grow-0"
          >
            <span className="hidden sm:inline">Next</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground w-full text-center">
          Page {currentPage + 1} of {pages.length} | Estimated reading time: {estimatedTotalMinutes} minutes
        </div>
      </CardFooter>
    </Card>
  )
}
