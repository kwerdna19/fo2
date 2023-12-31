
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

const spriteWidth = 22
const spriteHeight = 22

export interface ItemSpriteProps extends Variant {
  url: string,
  name: string,
  className?: string
}

export const ItemSprite = ({ url, name, className, size = 'xs' }: ItemSpriteProps) => {

  const mult = variants.size[size]
  const height = spriteHeight*mult
  const width = spriteWidth*mult

  /* eslint-disable-next-line @next/next/no-img-element */
  return (<img style={{ height, width, minWidth: width, minHeight: height }} className={cn("box-content pixelated aspect-square", className)} src={url} alt={`${name} sprite`} />)
}