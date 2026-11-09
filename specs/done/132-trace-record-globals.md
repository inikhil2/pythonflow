# 132: Trace: record the main program's variables while inside a function
Files: public/trace.py, app/composables/usePython.ts
Severity: med

## Problem
The tracer records only `frame.f_locals` for each step. Inside a function, that is only the
function's own variables. Week 9 lesson 02 traces a function that changes a global `count` with
`global count`. While the trace is inside `add`, the Variables panel says "No variables yet.", so the
learner cannot watch `count` change on the very line the lesson is about.

This spec makes the tracer also record the main program's variables, as `globals`, on steps inside
a function. It records them only when there is at least one to show. Spec 133 then shows them in
the panel. Change nothing else.

## Required change
1. In `public/trace.py`, replace the `_locals` function with this, keeping the comment above it:
```python
def _variables(names):
    return {
        name: _value(v)
        for name, v in names.items()
        if not name.startswith('__') and not isinstance(v, (types.FunctionType, types.ModuleType))
    }
```
2. In `public/trace.py`, inside `tracer`, change the line `'locals': _locals(frame),` to:
```python
            'locals': _variables(frame.f_locals),
```
3. In `public/trace.py`, directly after the closing `}` of the `step = {` dict, and before
   `if event == 'exception':`, add these lines with this indentation:
```python
        # Inside a function, also record the main program's variables, such as one changed with global.
        if frame.f_globals is not frame.f_locals:
            names = _variables(frame.f_globals)
            if names:
                step['globals'] = names
```
4. In `app/composables/usePython.ts`, in `interface TraceStep`, add this line directly after the
   `locals: Record<string, TraceValue>` line:
```ts
  globals?: Record<string, TraceValue> // inside a function: the main program's variables, if any
```

## Acceptance gates
1. `grep -c "_locals(" public/trace.py` prints `0`, and `grep -c "def _variables" public/trace.py` prints `1`.
2. This prints exactly `[None, None, None, '0', '0', '1', None]`:
```sh
python3 -I -c "import json, importlib.util as u; s = u.spec_from_file_location('t', 'public/trace.py'); t = u.module_from_spec(s); s.loader.exec_module(t); r = json.loads(t.trace('count = 0\ndef add():\n    global count\n    count += 1\nadd()\n', '')); print([x.get('globals', {}).get('count', {}).get('repr') for x in r['steps']])"
```
3. This prints exactly `[False, False, False, False, False, False, False, True, True, True, False]`,
   so a class body records no empty `globals`:
```sh
python3 -I -c "import json, importlib.util as u; s = u.spec_from_file_location('t', 'public/trace.py'); t = u.module_from_spec(s); s.loader.exec_module(t); r = json.loads(t.trace('class Dog:\n    sound = 1\n\ndef f(n):\n    return n\n\nf(5)\n', '')); print([('globals' in x) for x in r['steps']])"
```
4. `npx nuxi typecheck` exits 0.
5. `git diff --stat` lists only `public/trace.py` and `app/composables/usePython.ts`.
