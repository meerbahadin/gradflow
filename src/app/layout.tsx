import type { Metadata } from 'next'
import { Geist, Geist_Mono, Instrument_Serif, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'

import { ThemeProvider } from '@/components/theme-provider'
import SiteHeader from '@/components/site/site-header'
import SiteFooter from '@/components/site/site-footer'

import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://gradflow.meerbahadin.dev'),
  title: {
    default: 'GradFlow: animated WebGL gradients for React',
    template: '%s · GradFlow',
  },
  description:
    'A WebGL gradient component for React. Twenty shaders, blended transitions between them, pointer interaction, and zero dependencies.',
  keywords: [
    'react',
    'webgl',
    'gradient',
    'shader',
    'animated background',
    'mesh gradient',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${geist.variable} ${inter.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body className='antialiased'>
        <ThemeProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
