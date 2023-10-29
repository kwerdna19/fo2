import '~/styles/globals.css'
import 'leaflet/dist/leaflet.css';
import '~/styles/map.css'
import { type Metadata } from "next"
import { Analytics } from '@vercel/analytics/react';
import { Footer } from '~/components/layout/Footer'
import { Header } from '~/components/layout/Header.server'
import { Toaster } from "~/components/ui/toaster"
import { TRPCReactProvider } from '~/trpc/react';
import { headers } from 'next/headers';
import { Inter } from "next/font/google"
import { cn } from '~/utils/styles';
 
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: {
    template: '%s | FO2 DB',
    default: 'FO2 DB',
  },
  description: 'Fantasy Online 2 Database',
  manifest: '/site.webmanifest',
}

export const dynamic = "force-dynamic"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
      <html lang="en">
        <body className={cn("min-h-screen flex flex-col items-center bg-background font-sans antialiased", inter.variable)}>
          <TRPCReactProvider headers={headers()}>
            <header className="p-4 sm:p-5 md:p-6 max-w-screen-2xl w-full">
              <Header />
            </header>
            <main className="flex flex-1 p-2 sm:p-3 md:p-4 lg:p-5 pt-0 max-w-screen-2xl w-full">
              {children}
            </main>
            <footer className="flex p-2 sm:p-3 md:p-4 lg:p-5 max-w-screen-2xl w-full">
              <Footer />
            </footer>
            <Toaster />
            <Analytics />
          </TRPCReactProvider>
        </body>
      </html>
  )
}
