export interface Article {
  title: string;
  content: string;
  images: Array<{
    url: string;
    caption: string;
    dimensions?: {
      width: number;
      height: number;
    };
  }>;
  source: string;
  url: string;
  date: string;
}