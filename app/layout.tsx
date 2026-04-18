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
  alternates: {
    canonical: `https://${meta.domain}`,
  },
  openGraph: {
    type:        'website',
    url:         `https://${meta.domain}`,
    siteName:    meta.siteName,
    title:       meta.siteName,
    description: meta.description,
    images: [
      {
        url:    '/og.png',
        width:  1200,
        height: 630,
        alt:    `${meta.siteName} — ${meta.tagline}`,
      },
    ],
  },
  twitter: {
    card:        'summary_large_image',
    site:        meta.twitterHandle,
    creator:     meta.twitterHandle,
    title:       meta.siteName,
    description: meta.description,
    images:      ['/og.png'],
  },
  robots: {
    index:  true,
    follow: true,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':       'Organization',
      '@id':         `https://${meta.domain}/#organization`,
      name:          meta.siteName,
      url:           `https://${meta.domain}`,
      logo:          `https://${meta.domain}/brand/logo.svg`,
      sameAs:        [`https://twitter.com/${meta.twitterHandle.replace('@', '')}`],
    },
    {
      '@type':            'SoftwareApplication',
      '@id':              `https://${meta.domain}/#app`,
      name:               meta.siteName,
      applicationCategory: 'FinanceApplication',
      description:        meta.description,
      url:                `https://${meta.domain}`,
      publisher:          { '@id': `https://${meta.domain}/#organization` },
      offers: {
        '@type':    'Offer',
        price:      '0',
        priceCurrency: 'USD',
        description: 'Free during beta',
      },
    },
    {
      '@type':     'WebSite',
      '@id':       `https://${meta.domain}/#website`,
      url:         `https://${meta.domain}`,
      name:        meta.siteName,
      description: meta.description,
      publisher:   { '@id': `https://${meta.domain}/#organization` },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
