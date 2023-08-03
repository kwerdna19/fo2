import { NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'



export const GET = (request: Request, { params }: { params: { spriteType: string } }) => {

  const { spriteType } = params

  const dir = path.resolve('./public', 'sprites', spriteType);

  if(!fs.existsSync(dir)) {
    return new NextResponse('Not found', {
      status: 404
    })
  }

  const filenames = fs.readdirSync(dir);
  const images = filenames.map(f => path.join('/', 'sprites', spriteType, f).replace(/\\/g, '/'))

  return NextResponse.json(images)

}