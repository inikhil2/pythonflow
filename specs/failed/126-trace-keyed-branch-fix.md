# 126: Fix the branch order in the tracer's _value function
Files: public/trace.py
Severity: high

## Problem
Spec 124 put its new lines in the wrong place in `_value` in `public/trace.py`. The line
`out['keyed'] = True` landed on the list and tuple branch instead of the dict branch, and the new
object branch landed before the dict branch instead of after it. As a result, lists and tuples
lost their index numbers in the Variables panel, and dicts have no `keyed` flag at all.
`app/composables/usePython.ts` and `app/components/VariableBoxes.vue` are correct and must not
change.

Only the dict branch and the object branch set `keyed`. The list and tuple branch must not.

## Required change
In `public/trace.py`, replace the whole `_value` function, from `def _value(v):` up to and
including its `return out` line, with exactly this:
```python
def _value(v):
    out = {'type': type(v).__name__, 'repr': _short(repr(v))}
    if isinstance(v, (list, tuple)):
        out['items'] = [_short(repr(x)) for x in v[:MAX_ITEMS]]
        out['length'] = len(v)
    elif isinstance(v, dict):
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
Keep the two blank lines before and after the function. Change nothing else in the file.

## Acceptance gates
1. `git diff HEAD --stat -- public/trace.py` shows `6 insertions(+)` and no deletions.
2. This prints exactly these four lines: `list None`, `dict True`, `object ['count = 2'] True`,
   `file None`.
```sh
python3 -I -c "
import importlib.util as u, json
s = u.spec_from_file_location('t', 'public/trace.py'); t = u.module_from_spec(s); s.loader.exec_module(t)
code = 'class Counter:\n    def __init__(self):\n        self.count = 2\ncounter = Counter()\nn = [5, 6]\nd = {1: 2}\nf = open(\"w8probe.txt\", \"w\")\nf.close()\n'
loc = json.loads(t.trace(code, ''))['steps'][-1]['locals']
print('list', loc['n'].get('keyed'))
print('dict', loc['d'].get('keyed'))
print('object', loc['counter']['items'], loc['counter'].get('keyed'))
print('file', loc['f'].get('items'))
"; rm -f w8probe.txt
```
3. `node scripts/check-lessons.ts` prints `lessons ok: 42 lessons, 77 exercises`.
