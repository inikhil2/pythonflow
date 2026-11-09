// A minimark node: plain text, or [tag, props, ...children].
type MinimarkNode = string | [string, Record<string, unknown>, ...MinimarkNode[]]

export interface MinimarkBody {
  value: MinimarkNode[]
}

// The ids of every ::exercise block in a lesson body, in page order.
export function exerciseIds(body: MinimarkBody | null | undefined): string[] {
  const ids: string[] = []
  const walk = (node: MinimarkNode) => {
    if (typeof node === 'string') return
    const [tag, props, ...children] = node
    if (tag === 'exercise' && typeof props.id === 'string') ids.push(props.id)
    children.forEach(walk)
  }
  body?.value.forEach(walk)
  return ids
}
