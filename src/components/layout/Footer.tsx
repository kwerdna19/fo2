'use client'

import { BsGithub } from 'react-icons/bs'
import { GrGamepad } from 'react-icons/gr'

export function Footer() {

  return <div className="flex justify-between w-full px-2">
  <div className="text-sm text-muted-foreground space-y-1">
    <div>Site creator: <code>Ak Δ</code> </div>
    <div>Fantasy Online 2: <code>Gamer</code></div>
  </div>
    <div className="flex gap-x-4 px-3 pt-1">
      <a className="block" href="https://fantasyonline2.com/" title="Play Fantasy Online 2">
        <GrGamepad className="h-6 w-6" />
      </a>
      <a className="block" href="https://github.com/kwerdna19/fo2">
        <BsGithub className="h-6 w-6" />
      </a>
    </div>
  </div>
}