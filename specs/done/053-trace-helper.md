# 053: Write public/trace.py and test it in Pyodide (shell step, task C1)
Files: public/trace.py
Severity: med

## Why a shell step
The tracer is Python, and the proposal says the spec must hold it verbatim. A heredoc writes
it exactly and avoids the empty-file failures of 044, 047 and 049. The gate runs it in Node
with Pyodide 0.29.5, the version the app loads.

What it does (proposal section 4.6): `trace(code, stdin)` runs the code under
`sys.settrace` as `main.py`. On every `line`, `call`, `return` and `exception` event in
`main.py` it records `{ event, line, stack, locals, stdoutLength }`, plus `error` on
exception steps. Each repr is capped at 80 characters. Lists, tuples and dicts also get
their first 12 items and their length. Names starting with `__`, modules and functions
are skipped. After 1000 steps it stops with the note `Stopped after 1000 steps.`. It
returns a JSON string `{ steps, stdout, error, note }`.

## Steps
Run from `~/Desktop/AiderThings/cs50p-tutor`:

```sh
cat > public/trace.py <<'PY'
# The visual explorer's tracer. The worker loads this file once, then calls trace(code, stdin).
# It runs the learner's code under sys.settrace and records one step per line, call, return
# and exception in main.py. The result is a JSON string: { steps, stdout, error, note }.
import io
import json
import sys
import traceback
import types

MAX_STEPS = 1000
MAX_REPR = 80
MAX_ITEMS = 12


# A BaseException, so the learner's `except Exception:` does not swallow it.
class StepLimit(BaseException):
    pass


def _short(text):
    return text if len(text) <= MAX_REPR else text[: MAX_REPR - 1] + '…'


def _value(v):
    out = {'type': type(v).__name__, 'repr': _short(repr(v))}
    if isinstance(v, (list, tuple)):
        out['items'] = [_short(repr(x)) for x in v[:MAX_ITEMS]]
        out['length'] = len(v)
    elif isinstance(v, dict):
        out['items'] = [_short(f'{k!r}: {x!r}') for k, x in list(v.items())[:MAX_ITEMS]]
        out['length'] = len(v)
    return out


# Functions and modules are left out: their repr is only a memory address.
def _locals(frame):
    return {
        name: _value(v)
        for name, v in frame.f_locals.items()
        if not name.startswith('__') and not isinstance(v, (types.FunctionType, types.ModuleType))
    }


# Frames in main.py, outermost first, each with its arguments.
def _stack(frame):
    frames = []
    while frame is not None:
        code = frame.f_code
        if code.co_filename == 'main.py':
            args = {n: _short(repr(frame.f_locals[n])) for n in code.co_varnames[: code.co_argcount] if n in frame.f_locals}
            frames.append({'name': code.co_name, 'args': args})
        frame = frame.f_back
    return frames[::-1]


def _error_line(e):
    return traceback.format_exception_only(type(e), e)[-1].strip()


def trace(code, stdin):
    steps = []
    out = io.StringIO()

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != 'main.py':
            return None
        # The module's own call event is at line 0: nothing to show yet.
        if event == 'call' and frame.f_code.co_name == '<module>':
            return tracer
        if len(steps) >= MAX_STEPS:
            raise StepLimit
        step = {
            'event': event,
            'line': frame.f_lineno,
            'stack': _stack(frame),
            'locals': _locals(frame),
            'stdoutLength': out.tell(),
        }
        if event == 'exception':
            step['error'] = _error_line(arg[1])
        steps.append(step)
        return tracer

    error = None
    note = None
    saved = sys.stdin, sys.stdout
    sys.stdin, sys.stdout = io.StringIO(stdin), out
    try:
        compiled = compile(code, 'main.py', 'exec')
        sys.settrace(tracer)
        exec(compiled, {'__name__': '__main__'})
    except StepLimit:
        note = f'Stopped after {MAX_STEPS} steps.'
    except BaseException as e:
        error = _error_line(e)
    finally:
        sys.settrace(None)
        sys.stdin, sys.stdout = saved
    return json.dumps({'steps': steps, 'stdout': out.getvalue(), 'error': error, 'note': note})
PY
T=$(mktemp -d)
(cd "$T" && npm init -y >/dev/null && npm install pyodide@0.29.5 >/dev/null)
cat > "$T/gate.mjs" <<'JS'
// Gate for shell step 053: runs public/trace.py in Node with the same Pyodide as the app.
import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { loadPyodide } from 'pyodide'

const pyodide = await loadPyodide()
pyodide.runPython(readFileSync(process.argv[2], 'utf8'))
const tracer = pyodide.globals.get('trace')
const trace = (code, stdin = '') => JSON.parse(tracer(code, stdin))

const a = trace('x = 10\nx = 25')
assert.deepEqual(a.steps.map((s) => s.locals.x?.repr ?? null), [null, '10', '25'])
assert.equal(a.error, null)

const b = trace('def sq(n):\n    return n * n\nprint(sq(3))')
assert.equal(b.stdout, '9\n')
assert.ok(b.steps.some((s) => s.stack.length === 2 && s.stack[1].name === 'sq' && s.stack[1].args.n === '3'))
assert.ok(b.steps.every((s) => !('sq' in s.locals)))

const c = trace('name = input("Name: ")\nprint("hi", name)', 'Bob')
assert.equal(c.stdout, 'Name: hi Bob\n')

const d = trace('xs = [1, 2]\nprint(xs[5])')
assert.equal(d.error, 'IndexError: list index out of range')
assert.ok(d.steps.some((s) => s.event === 'exception' && s.error === d.error))

const e = trace('while True:\n    pass')
assert.equal(e.steps.length, 1000)
assert.equal(e.note, 'Stopped after 1000 steps.')

const f = trace('print("hi')
assert.deepEqual(f.steps, [])
assert.match(f.error, /^SyntaxError/)

const g = trace('s = "x" * 200\nxs = list(range(20))').steps.at(-1).locals
assert.equal(g.s.repr.length, 80)
assert.equal(g.xs.items.length, 12)
assert.equal(g.xs.length, 20)

console.log('trace ok')
JS
node "$T/gate.mjs" public/trace.py
```

## Acceptance gates
- The last command prints `trace ok`.
- `wc -c < public/trace.py` prints `3101`.
- `git status --short` lists `?? public/trace.py` and no other change.
- Commit it alone. Nothing loads it until spec 054.
