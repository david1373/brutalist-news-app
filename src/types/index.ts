export interface Article {
  id: string;
  title: string;
  content: string;
  images: {
    url: string;
    caption: string;
  }[];
  source: string;
  date: string;
}