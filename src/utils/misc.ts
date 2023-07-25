

export const getSlugFromName = (name: string) => {
  return name.replace(/\s+/g, '-').replace(/[^-\w]/g, '').toLowerCase()
}