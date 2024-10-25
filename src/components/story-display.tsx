'use client'

import { Button, Card, CardContent, CardFooter } from '@/components/ui'
import { useStoryReader } from '@/hooks/useStoryReader'
import { ArrowLeft, ArrowRight, Volume2, VolumeX } from 'lucide-react'
interface StoryDisplayProps {
  story: string
}

export default function StoryDisplay({ story }: StoryDisplayProps) {
  const {
    currentPage,
    pages,
    isSpeaking,
    transcription,
    selectedVoice,
    availableVoices,
    estimatedTotalMinutes,
    handleNextPage,
    handlePrevPage,
    handleTextToSpeech,
    handleVoiceChange,
  } = useStoryReader({ story })

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
                  <p key={line} className={index === 0 ? 'font-bold' : ''}>
                    {line.replace(/^\*\*(.*?)\*\*/, '$1')}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
          {/* Voice Selection Group */}
          <div className="w-full sm:w-auto space-y-1.5">
            <label
              htmlFor="voice-select"
              className="text-sm font-medium text-muted-foreground"
            >
              Select your preferred reader voice &nbsp;
            </label>
            <select
              id="voice-select"
              value={selectedVoice?.name || ''}
              onChange={handleVoiceChange}
              className="w-full sm:w-auto text-sm p-2 border rounded bg-background"
            >
              {availableVoices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="flex-1 sm:flex-initial"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <Button
              onClick={handleTextToSpeech}
              aria-label={isSpeaking ? 'Stop speaking' : 'Start speaking'}
              className="flex-1 sm:flex-initial"
              size="sm"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Read</span>
                </>
              )}
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === pages.length - 1}
              className="flex-1 sm:flex-initial"
              size="sm"
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight className="h-4 w-4 sm:ml-2" />
            </Button>
          </div>
        </div>

        {/* Page Information */}
        <div className="text-sm text-muted-foreground w-full text-center">
          Page {currentPage + 1} of {pages.length} | Estimated reading time:{' '}
          {estimatedTotalMinutes} minutes
        </div>
      </CardFooter>
    </Card>
  )
}
