import './globals.css'

export const metadata = {
  title: 'Brutalist Architecture News',
  description: 'Architecture and Design news with a brutalist aesthetic',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  )
}