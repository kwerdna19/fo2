'use client'

import { useState, useEffect } from 'react';
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

const spriteRows = 4
const spriteCols = 3
const rowCycles = 3
const colSequence = [0,1,2,1]
const dur = 333

const spriteSheetWidth = 96
const spriteSheetHeight = 192

const spriteWidth = spriteSheetWidth/spriteCols
const spriteHeight = spriteSheetHeight/spriteRows


export interface MobSpriteProps extends Variant { url: string, name: string, className?: string, animated?: boolean }

export const MobSprite = ({ url, name, className, animated = true, size = 'xs' }: MobSpriteProps) => {

  const mult = variants.size[size]

  const imgWidth = mult*spriteSheetWidth
  const imgHeight = mult*spriteSheetHeight


  // (2,1) is default non-animated sprite slot
  const [row, setRow] = useState(2)
  const [colIndex, setColIndex] = useState(1)
  const col = colSequence[colIndex]!

  useEffect(() => {

    if(!animated) {
      return
    }

    const intervalCol = setInterval(() => {
      setColIndex(oldIndex => {

        if(oldIndex + 1 < colSequence.length) {
          return oldIndex + 1
        }
        return 0
      })
    }, dur)

    const intervalRow = setInterval(() => {
      setRow(oldIndex => {
        if(oldIndex + 1 < spriteRows) {
          return oldIndex + 1
        }
        return 0
      })
    }, dur*spriteCols*rowCycles)

    return () => {
      clearInterval(intervalCol)
      clearInterval(intervalRow)
    }
  }, [setRow, setColIndex, animated])

  const height = spriteHeight*mult
  const width = spriteWidth*mult

  const top = -row*height
  const left = -col*width


  return <div className={cn(className, "relative overflow-hidden box-content pixelated")} style={{ height, width }}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className={cn("block absolute max-w-none")}
        style={{
          top,
          left,
          height: imgHeight,
          width: imgWidth
        }}
      src={url}
      alt={name + " sprite"}
    />
  </div>
}