# 009: Worker loses or misplaces output, shows Pyodide internals in tracebacks, leaks memory
Files: public/pyodide-worker.js
Severity: high

## Problem
Tested in Node with pyodide 0.29.5, using the exact body of `self.onmessage`:
1. Output printed without a newline is lost or shows up in the next run.
   Run 1: `print("a", end="")` returns stdout `""`. Run 2: `print("b")` returns
   stdout `"a\nb"`. Python keeps the partial line in its buffer and nothing
   flushes it. The exercise checker (T6) would compare the wrong text.
2. `setStdout({ batched })` plus `out.join('\n')` drops the final newline and
   cannot tell `print("a"); print()` apart from `print("a")`.
3. The traceback in `stderr` starts with about 12 lines of Pyodide internals
   (`File "/lib/python313.zip/_pyodide/_base.py" ...`) before the learner's code.
   The learner's frames show as `File "<exec>"`.
4. `pyodide.globals.get('dict')()` makes a new Python object on every run and
   never destroys it.

## Required change
Replace the whole file `public/pyodide-worker.js` with exactly:

```js
const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.29.5/full/';
importScripts(PYODIDE_URL + 'pyodide.js');

// Start loading at once; every run waits for this.
const pyodideReady = loadPyodide({ indexURL: PYODIDE_URL });
pyodideReady.then(() => self.postMessage({ type: 'ready' }));

// Keep the header line and the learner's own frames; drop Pyodide's internal frames.
function tidy(traceback) {
  const lines = traceback.split('\n');
  const start = lines.findIndex((line) => line.startsWith('  File "main.py"'));
  return start === -1 ? traceback : [lines[0], ...lines.slice(start)].join('\n');
}

self.onmessage = async (e) => {
  const { code, stdin } = e.data;
  const pyodide = await pyodideReady;
  const decoder = new TextDecoder();
  let stdout = '';
  let stderr = '';
  const lines = stdin ? stdin.split('\n') : [];

  pyodide.setStdout({ write: (buf) => { stdout += decoder.decode(buf); return buf.length; } });
  pyodide.setStderr({ write: (buf) => { stderr += decoder.decode(buf); return buf.length; } });
  // Returning undefined means end of input.
  pyodide.setStdin({ stdin: () => lines.shift() });

  let error = null;
  const globals = pyodide.globals.get('dict')();
  try {
    await pyodide.runPythonAsync(code, { globals, filename: 'main.py' });
  } catch (e) {
    const traceback = tidy(String(e.message ?? e).trimEnd());
    stderr += traceback;
    error = traceback.split('\n').pop();
  } finally {
    // print(..., end="") stays in Python's buffer until flushed.
    pyodide.runPython('import sys\nsys.stdout.flush()\nsys.stderr.flush()');
    globals.destroy();
  }
  self.postMessage({ type: 'result', stdout, stderr, error });
};
```

Note: `stdout` now keeps Python's exact output, so `print("hi")` gives `"hi\n"`.
The checker (T6) trims trailing whitespace, as plan.md says.

## Acceptance gates
- `node --check public/pyodide-worker.js` exits 0
- `grep -c 'batched' public/pyodide-worker.js` prints `0`
- `grep -c "filename: 'main.py'" public/pyodide-worker.js` prints `1`
- `grep -c 'globals.destroy()' public/pyodide-worker.js` prints `1`
- `npm run generate` exits 0
