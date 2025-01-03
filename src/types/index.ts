export interface Article {
  id: string
  title: string
  content: string
  images: Array<{
    url: string
    caption: string
  }>
  url: string
  source: string
  date: string
}