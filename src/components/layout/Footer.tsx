


const credits = [
  <>Created by player <code>Ak</code></>,
  <>Based on data organized by player <code>MeanManSlayer</code></>,
  <>Fantasy Online 2 Creator <code>Gamer</code></>,
  <>Sprite artwork by <code>Lighterthief</code></>
]


export function Footer() {

  return <div className="text-sm text-muted-foreground">
    {credits.map((c,i) => {
      return <div key={i}>
        {c}
      </div>
    })}
  </div>
}