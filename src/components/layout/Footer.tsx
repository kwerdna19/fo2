import { BsGithub } from 'react-icons/bs'


const credits = [
  <>Created by player <code>Ak</code></>,
  <>Based on data organized by player <code>MeanManSlayer</code></>,
  <>Fantasy Online 2 Creator <code>Gamer</code></>,
  <>Sprite artwork by <code>Lighterthief</code></>
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