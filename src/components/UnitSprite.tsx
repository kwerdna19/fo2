
import { cn } from '~/utils/styles';

const variants = {
  size: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  },
}

interface Variant {
  size?: keyof typeof variants['size']
}

const spriteWidth = 9
const spriteHeight = 8

export interface ItemSpriteProps extends Variant {
  type: 'coin' | 'gem',
  className?: string
}

export const UnitSprite = ({ type, className, size = 'xs' }: ItemSpriteProps) => {

  const mult = variants.size[size]
  const height = spriteHeight*mult
  const width = spriteWidth*mult

  /* eslint-disable-next-line @next/next/no-img-element */
  return (<img style={{ height, width }} className={cn("pixelated", className)} src={`/sprites/unit/${type}s.png`} alt={`${type}s`} />)
}