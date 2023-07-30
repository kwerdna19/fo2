'use client'

import { BsGithub } from 'react-icons/bs'


const credits = [
  <>Site creator: <code>Ak</code></>,
  <>Data contributions: <code>MeanManSlayer</code>, <code>Deleria</code></>,
  <>Sprite artwork: <code>Lighterthief</code></>,
  <>Fantasy Online 2: <code>Gamer</code></>,
]


export function Footer() {

  return <div className="flex justify-between w-full px-2">
  <div className="text-sm text-muted-foreground">
    {credits.map((c,i) => {
      return <div key={i}>
        {c}
      </div>
    })}
  </div>
    <div className="px-3 pt-1">
      <a href="https://github.com/kwerdna19/fo2">
        <BsGithub className="h-6 w-6" />
      </a>
    </div>
  </div>
}