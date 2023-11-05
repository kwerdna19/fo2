import fs from 'fs'
import path from 'path'
import { revalidatePath } from "next/cache";

export const getListOfImages = (spriteType: string) => {
  const dir = path.resolve('./public', 'sprites', spriteType);
  if(!fs.existsSync(dir)) {
    return null
  }
  const filenames = fs.readdirSync(dir);
  const images = filenames.map(f => path.join('/', 'sprites', spriteType, f).replace(/\\/g, '/'))
  return images
}

export function setCorsHeaders(res: Response) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Request-Method", "*");
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.headers.set("Access-Control-Allow-Headers", "*");
  return res
}

// eslint-disable-next-line @typescript-eslint/require-await
export const invalidate = async (pathOrPaths: string | string[]) => {
  'use server';

  if (typeof pathOrPaths === 'string') {
    revalidatePath(pathOrPaths);
  } else {
    if(pathOrPaths.length === 1) {
      revalidatePath(pathOrPaths[0]!)
      return
    }
    for (const p of pathOrPaths) {
      revalidatePath(p);
    }
  }
};
