import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Unique.ai - Content Generator',
  description: 'Create authentic content using AI-powered writing analysis and generation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
