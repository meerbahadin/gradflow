import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'

import { ThemeProvider } from '@/components/theme-provider'

import './globals.css'

export const metadata: Metadata = {
  title: 'GradFlow - WebGL Gradient Backgrounds',
  description:
    'Create stunning animated gradient backgrounds with WebGL. Open-source React component with 60fps performance, customizable colors, noise effects,image export, and realtime controls. Perfect for modern web applications.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='antialiased bg-background text-foreground'>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
