'use client';
import { type Item } from "@prisma/client";
import { type Build, Slot, visibleEquipment } from "~/utils/fo";
import { MobSprite } from "../MobSprite";
import { basename } from "path";

export function CharacterPreview({ className, build }: { build: Build; className?: string; }) {

  const items = visibleEquipment.map(e => build[Slot[e]]).filter(Boolean) as Item[];

  const itemSlugs = items.map(item => basename(item.spriteUrl).replace(/\.png$/, '').replace(/\-icon$/, ''));

  const url = `https://art.fantasyonline2.com/api/character/ss?f=body-1_eyes-standard-blue_${itemSlugs.join('_')}`;

  const alt = `Character wearing ${items.map(item => item.name).join(', ')}`;

  return (<MobSprite size="3xl" className={className} url={url.replace(/\s/g, '')} name={alt} />);

}
