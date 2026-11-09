// hour is null before the page mounts, when the visitor's clock is not known yet.
export function greeting(hour: number | null, name: string): string {
  let words = 'Welcome'
  if (hour !== null) words = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  return name ? `${words}, ${name}` : words
}
