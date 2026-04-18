import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { meta } from '@/lib/content'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: meta.siteName,
    template: `%s | ${meta.siteName}`,
  },
  description: meta.description,
  metadataBase: new URL(`https://${meta.domain}`),
  openGraph: {
    type:        'website',
    siteName:    meta.siteName,
    description: meta.description,
  },
  twitter: {
    card:    'summary_large_image',
    creator: meta.twitterHandle,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
