import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const article = {
    id: params.id,
    title: 'Test Article',
    content: 'Test content',
    images: [{ url: 'https://leibal.com/test.jpg', caption: 'Test caption' }],
    url: 'https://test.com',
    source: 'Test Source',
    date: new Date().toISOString()
  }

  return NextResponse.json(article)
}