// The one copy of the linked-list and tree prelude. The app and scripts/check-interview.ts both import it,
// and an exercise with `prelude: nodes` runs it before the learner's code (see docs/interview-format.md).
export const NODE_PRELUDE = `import weakref as _weakref


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def to_nodes(values):
    head = None
    for v in reversed(values):
        head = ListNode(v, head)
    return head


def to_cycle(values, pos):
    head = to_nodes(values)
    if pos >= 0 and head is not None:
        tail = target = head
        while tail.next is not None:
            tail = tail.next
        for _ in range(pos):
            target = target.next
        tail.next = target
    return head


def to_shared(a, b, common):
    tail = to_nodes(common)
    heads = []
    for values in (a, b):
        head = tail
        for v in reversed(values):
            head = ListNode(v, head)
        heads.append(head)
    return heads[0], heads[1]


def from_nodes(head):
    values = []
    while head is not None:
        values.append(head.val)
        if len(values) > 1000000:
            raise ValueError("the list has more than 1000000 nodes or loops back on itself")
        head = head.next
    return values


def to_tree(values):
    if not values:
        return None
    root = TreeNode(values[0])
    queue, i = [root], 1
    for node in queue:
        for side in ("left", "right"):
            if i < len(values):
                if values[i] is not None:
                    setattr(node, side, TreeNode(values[i]))
                    queue.append(getattr(node, side))
                i += 1
    return root


class Node:
    def __init__(self, val=0, next=None, random=None):
        self.val = val
        self.next = next
        self.random = random


# Every node to_random_list makes; the set holds them weakly, so freed nodes drop out and ids are never reused.
_random_inputs = _weakref.WeakSet()


def to_random_list(pairs):
    nodes = [Node(v) for v, _ in pairs]
    for node, after in zip(nodes, nodes[1:]):
        node.next = after
    for node, (_, r) in zip(nodes, pairs):
        if r is not None:
            node.random = nodes[r]
    _random_inputs.update(nodes)
    return nodes[0] if nodes else None


def from_random_list(head):
    nodes = []
    while head is not None:
        nodes.append(head)
        head = head.next
    index = {id(n): i for i, n in enumerate(nodes)}
    out = []
    for n in nodes:
        if n in _random_inputs:
            raise AssertionError("the copy reuses a node of the original list; every node must be new")
        if n.random is not None and id(n.random) not in index:
            raise AssertionError("a random pointer leads outside the copied list")
        out.append([n.val, None if n.random is None else index[id(n.random)]])
    return out


def from_tree(root):
    values, queue = [], [root]
    for node in queue:
        values.append(None if node is None else node.val)
        if node is not None:
            queue += [node.left, node.right]
    while values and values[-1] is None:
        values.pop()
    return values
`

// Used by the random check: converts plain lists to nodes for the call, and the result back to a plain list.
// WRAP is {"args": ["nodes", null, "tree"], "result": "nodes"}; every key is optional, null leaves an argument alone.
// "cycle" takes [values, pos] for to_cycle, "random" takes pairs for to_random_list, and "shared" takes
// [a, b, common] and makes two arguments, both heads of lists that share a tail. The result "index" is a node or
// None, returned as its position in the first argument's list (None for None, a message for a node not in it).
export const WRAP_PY = `def _pf_apply(fn, args, wrap):
    to = {"nodes": to_nodes, "tree": to_tree, "cycle": lambda a: to_cycle(*a), "random": to_random_list}
    back = {"nodes": from_nodes, "tree": from_tree, "random": from_random_list}
    kinds = list((wrap or {}).get("args", []))
    kinds += [None] * (len(args) - len(kinds))
    built = []
    for a, k in zip(args, kinds):
        if k == "shared":
            built += to_shared(*a)
        else:
            built.append(to[k](a) if k else a)
    got = fn(*built)
    kind = (wrap or {}).get("result")
    if kind == "index":
        if got is None:
            return None
        i, node, seen = 0, built[0], set()
        while node is not None and id(node) not in seen:
            if node is got:
                return i
            seen.add(id(node))
            node, i = node.next, i + 1
        return "a node not in the first list"
    return back[kind](got) if kind else got
`
