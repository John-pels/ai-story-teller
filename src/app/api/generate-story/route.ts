import { generateStory } from '@/utils/gemini-utils'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { theme } = await request.json()
  try {
    const story = await generateStory(theme)
    return NextResponse.json({ story })
  } catch (error) {
    console.error('Error articulating story:', error)
    let errorMessage = 'An unexpected error occurred'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
