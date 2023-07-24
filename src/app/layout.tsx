import '~/styles/globals.css'
import { type Metadata } from "next"
import { Footer } from '~/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    template: '%s | FO2 DB',
    default: 'FO2 DB',
  },
  description: 'Fantasy Online 2 Database',
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main className="flex flex-col items-center p-5 mx-auto max-w-screen-2xl">
          {children}
        </main>
        <footer className="flex flex-col items-center p-5 mx-auto max-w-screen-2xl mb-4">
          <Footer />
        </footer>
      </body>
    </html>
  )
}
