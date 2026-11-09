# 135: Trace: remove the old _locals function left behind by spec 132
Files: public/trace.py
Severity: low

## Problem
Spec 132 asked for the `_locals` function in `public/trace.py` to be replaced by `_variables`. The
new `_variables` function was added, but the old `_locals` function was left in place below it, and
nothing calls it any more. The comment above `_variables` was also changed to the wrong text: it is
the comment that belongs inside `tracer`. So spec 132's gate 1 fails: `grep -c "_locals("` prints
`1`, not `0`. The tracer itself works; only the dead code and the comment are wrong.

## Required change
In `public/trace.py`, the lines between the end of `_value` (its `return out` line) and the comment
`# Frames in main.py, outermost first, each with its arguments.` must be exactly this, with two blank
lines before and after the function, as now:
```python
# Functions and modules are left out: their repr is only a memory address.
def _variables(names):
    return {
        name: _value(v)
        for name, v in names.items()
        if not name.startswith('__') and not isinstance(v, (types.FunctionType, types.ModuleType))
    }
```
That means: change the comment above `def _variables(names):` to
`# Functions and modules are left out: their repr is only a memory address.`, and delete the whole
`_locals` function together with the comment line directly above it. Change nothing else. Leave the
comment `# Inside a function, also record the main program's variables, such as one changed with
global.` inside `tracer` as it is.

## Acceptance gates
1. `grep -c "_locals(" public/trace.py` prints `0`, and `grep -c "def _variables" public/trace.py`
   prints `1`.
2. `grep -c "Functions and modules are left out" public/trace.py` prints `1`, and
   `grep -c "such as one changed with global" public/trace.py` prints `1`.
3. This prints exactly `[None, None, None, '0', '0', '1', None]`:
```sh
python3 -I -B -c "import json, importlib.util as u; s = u.spec_from_file_location('t', 'public/trace.py'); t = u.module_from_spec(s); s.loader.exec_module(t); r = json.loads(t.trace('count = 0\ndef add():\n    global count\n    count += 1\nadd()\n', '')); print([x.get('globals', {}).get('count', {}).get('repr') for x in r['steps']])"
```
4. Against the last commit, `public/trace.py` has 8 lines added and 3 removed in total:
   `git diff --numstat public/trace.py` prints `8`, then `3`, then the file's path. Today it
   prints `15` and `1`.
