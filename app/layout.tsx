import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ReptiBud - Reptile Care Logbook',
  description: 'A mobile-first web app for tracking basic reptile care',
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
