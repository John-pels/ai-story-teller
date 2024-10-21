'use client'

import StoryDisplay from '@/components/story-display'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from '@/components/ui'
import { useState } from 'react'

export default function StoryGenerator() {
  const [theme, setTheme] = useState('')
  const [story, setStory] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme }),
      })
      const data = await response.json()
      setStory(data.story)
    } catch (error) {
      console.error('Error generating story:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Generate a Story</CardTitle>
          <CardDescription>
            Enter an African folklore theme or character to generate a story.
          </CardDescription>
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
        </CardContent>
      </Card>
      {story && <StoryDisplay story={story} />}
    </>
  )
}
