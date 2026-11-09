const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.29.5/full/';
importScripts(PYODIDE_URL + 'pyodide.js');

// Start loading at once; every run waits for this.
const pyodideReady = loadPyodide({ indexURL: PYODIDE_URL });
pyodideReady.then(
  (pyodide) => self.postMessage({ type: 'ready', version: pyodide.runPython('import sys\nsys.version.split()[0]') }),
  () => self.postMessage({ type: 'load-error' }),
);

// Keep the header line and the learner's own frames; drop Pyodide's internal frames.
function tidy(traceback) {
  const lines = traceback.split('\n');
  const start = lines.findIndex((line) => line.startsWith('  File "main.py"'));
  return start === -1 ? traceback : [lines[0], ...lines.slice(start)].join('\n');
}

async function run(pyodide, code, stdin, prelude) {
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
  // Run code as a script, like python main.py and the tracer, so the __main__ guard works.
  globals.set('__name__', '__main__');
  try {
    // Fetch the Pyodide packages the code imports, such as pytest, before it runs.
    await pyodide.loadPackagesFromImports(code);
    // The prelude runs first, in the same globals, under its own file name so line numbers stay the learner's.
    if (prelude) await pyodide.runPythonAsync(prelude, { globals, filename: 'prelude.py' });
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
  return { type: 'result', stdout, stderr, error };
}

// The tracer in /trace.py is loaded the first time a trace is asked for.
let tracer = null;

async function trace(pyodide, code, stdin) {
  try {
    if (!tracer) {
      const response = await fetch('/trace.py');
      pyodide.runPython(await response.text());
      tracer = pyodide.globals.get('trace');
    }
    await pyodide.loadPackagesFromImports(code);
    return { type: 'trace', ...JSON.parse(tracer(code, stdin)) };
  } catch {
    return {
      type: 'trace',
      steps: [],
      stdout: '',
      error: 'The tracer could not start. Check your internet connection, then press Run and trace again.',
      note: null,
    };
  }
}

self.onmessage = async (e) => {
  const { type, code, stdin, prelude } = e.data;
  const pyodide = await pyodideReady;
  self.postMessage(type === 'trace' ? await trace(pyodide, code, stdin) : await run(pyodide, code, stdin, prelude));
};
