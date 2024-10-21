'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui"
import { AlertCircle } from "lucide-react"
import StoryDisplay from '@/components/story-display'

export default function StoryGenerator() {
  const [theme, setTheme] = useState('')
  const [story, setStory] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStory('')
    setError(null)

    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate story')
      }

      const data = await response.json()
      setStory(data.story)
    } catch (error) {
      console.error('Error generating story:', error)
      setError('Failed to generate story. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Generate a Story</CardTitle>
          <CardDescription>Enter an African folklore theme or character to generate a story.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter a theme or character (e.g., Anansi the Spider)"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              required
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Story'}
            </Button>
          </form>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      {story && <StoryDisplay story={story} />}
    </>
  )
}
