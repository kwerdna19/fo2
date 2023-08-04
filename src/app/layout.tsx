import '~/styles/globals.css'
import 'leaflet/dist/leaflet.css';
import '~/styles/map.css'
import { type Metadata } from "next"
import { Analytics } from '@vercel/analytics/react';
import { Footer } from '~/components/layout/Footer'
import { Header } from '~/components/layout/Header'
import { api } from '~/utils/api'
import { NextAuthProvider } from '~/components/providers/NextAuthProvider';
import { Toaster } from "~/components/ui/toaster"

export const metadata: Metadata = {
  title: {
    template: '%s | FO2 DB',
    default: 'FO2 DB',
  },
  description: 'Fantasy Online 2 Database',
  manifest: '/site.webmanifest',
}

// 7 days
export const revalidate = 604800 // secs

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const areas = await (await api()).area.getAllPopulated()


  return (
    <NextAuthProvider>
      <html lang="en">
        <body className="min-h-screen flex flex-col items-center">
          <header className="p-4 sm:p-5 md:p-6 max-w-screen-2xl w-full">
            <Header areas={areas} />
          </header>
          <main className="flex flex-1 p-2 sm:p-3 md:p-4 lg:p-5 pt-0 max-w-screen-2xl w-full">
            {children}
          </main>
          <footer className="flex p-2 sm:p-3 md:p-4 lg:p-5 max-w-screen-2xl w-full">
            <Footer />
          </footer>
          <Toaster />
          <Analytics />
        </body>
      </html>
    </NextAuthProvider>
  )
}
