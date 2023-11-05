import '~/styles/globals.css'
import 'leaflet/dist/leaflet.css';
import '~/styles/map.css'

import { TRPCReactProvider } from '~/trpc/react';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
      <TRPCReactProvider headers={headers()}>
        {children}
    </TRPCReactProvider>
  )
}
