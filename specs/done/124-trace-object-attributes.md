# 124: Show the attributes of the learner's objects in the trace Variables panel
Files: public/trace.py, app/composables/usePython.ts, app/components/VariableBoxes.vue
Severity: med

## Problem
Week 8 teaches classes, and its traces exist to show attributes being set and changed. But the
tracer only sends an object's `repr`. For an object of the learner's own class, that repr is
`<__main__.Counter object at 0x...>`, so the Variables panel never shows `count`. The week 8
browser check confirmed it: on lesson 02 the panel showed only the object repr, and the count
could only be read from Output.

Lists, tuples and dicts already send `items`. An object of a class defined in the learner's
code should send its attributes the same way, as `name = value` items. Objects from the
standard library, such as open files, keep their repr, because it is already informative.

`VariableBoxes.vue` now hides the item index only when the type name is `dict`. Attributes,
like dict keys, need no index, so the tracer marks both with a new `keyed` flag.

## Required change
1. In `public/trace.py`, in `_value`, replace exactly this:
```python
        out['items'] = [_short(f'{k!r}: {x!r}') for k, x in list(v.items())[:MAX_ITEMS]]
        out['length'] = len(v)
    return out
```
with exactly this:
```python
        out['items'] = [_short(f'{k!r}: {x!r}') for k, x in list(v.items())[:MAX_ITEMS]]
        out['length'] = len(v)
        out['keyed'] = True
    # An object of the learner's own class: its repr is only an address, so show its attributes.
    elif type(v).__module__ == '__main__' and getattr(v, '__dict__', None):
        out['items'] = [_short(f'{k} = {x!r}') for k, x in list(vars(v).items())[:MAX_ITEMS]]
        out['length'] = len(vars(v))
        out['keyed'] = True
    return out
```
2. In `app/composables/usePython.ts`, in `interface TraceValue`, replace exactly these two lines:
```ts
  items?: string[] // lists, tuples and dicts: the first 12 items
  length?: number // lists, tuples and dicts: how many items there are
```
with exactly these three lines:
```ts
  items?: string[] // lists, tuples, dicts and objects: the first 12 items
  length?: number // lists, tuples, dicts and objects: how many items there are
  keyed?: boolean // dicts and objects: each item is a key or attribute with its value, so it gets no index
```
3. In `app/components/VariableBoxes.vue`, replace exactly this:
```vue
<span v-if="value.type !== 'dict'" class="index">
```
with exactly this:
```vue
<span v-if="!value.keyed" class="index">
```
Change nothing else in any of the three files.

## Acceptance gates
1. `git diff --stat` shows only these three files, with 10 insertions and 3 deletions.
2. This prints `['count = 2'] True`, then `None`, then `None`:
```sh
python3 -I -c "
import importlib.util as u, json
s = u.spec_from_file_location('t', 'public/trace.py'); t = u.module_from_spec(s); s.loader.exec_module(t)
code = 'class Counter:\n    def __init__(self):\n        self.count = 0\n    def add(self):\n        self.count += 1\ncounter = Counter()\ncounter.add()\ncounter.add()\nf = open(\"w8probe.txt\", \"w\")\nf.close()\nn = [5]\n'
loc = json.loads(t.trace(code, ''))['steps'][-1]['locals']
print(loc['counter']['items'], loc['counter']['keyed'])
print(loc['f'].get('items'))
print(loc['n'].get('keyed'))
"; rm -f w8probe.txt
```
3. `npx nuxi typecheck` exits 0.
4. `node scripts/check-lessons.ts` prints `lessons ok: 42 lessons, 77 exercises`.
