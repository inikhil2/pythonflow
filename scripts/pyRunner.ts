// Runs Python in Pyodide the way the app's checker does, for the content check scripts.
import { loadPyodide } from 'pyodide'
import { sameOutput } from '../app/utils/compareOutput.ts'

export type TestCase = { stdin?: string; stdout?: string; check?: string }

const pyodide = await loadPyodide()
const decoder = new TextDecoder()

// Same as run() in public/pyodide-worker.js: fresh globals, stdin by line, buffers flushed.
// `prelude` runs first in the same globals under its own file name, so line numbers in errors are the learner's.
export async function run(code: string, stdin: string, prelude = '') {
  let stdout = ''
  const lines = stdin ? stdin.split('\n') : []
  pyodide.setStdout({ write: (buf: Uint8Array) => { stdout += decoder.decode(buf); return buf.length } })
  pyodide.setStderr({ write: (buf: Uint8Array) => buf.length })
  pyodide.setStdin({ stdin: () => lines.shift() })
  let error: string | null = null
  const globals = pyodide.globals.get('dict')()
  // Run code as a script, like python main.py and the tracer, so the __main__ guard works.
  globals.set('__name__', '__main__')
  try {
    // Fetch the Pyodide packages the code imports, such as pytest, before it runs.
    await pyodide.loadPackagesFromImports(code)
    if (prelude) await pyodide.runPythonAsync(prelude, { globals, filename: 'prelude.py' })
    await pyodide.runPythonAsync(code, { globals, filename: 'main.py' })
  } catch (e) {
    error = String(e instanceof Error ? e.message : e).trimEnd().split('\n').pop() ?? 'Error'
  } finally {
    pyodide.runPython('import sys\nsys.stdout.flush()\nsys.stderr.flush()')
    globals.destroy()
  }
  return { stdout, error }
}

// Same rule as useChecker: a check case appends its code; a stdout case compares output.
export async function failure(code: string, test: TestCase, prelude = ''): Promise<string | null> {
  const r = await run(test.check ? code + '\n' + test.check : code, test.stdin ?? '', prelude)
  if (r.error) return r.error
  if (test.check === undefined && !sameOutput(test.stdout ?? '', r.stdout)) return `printed ${JSON.stringify(r.stdout)}`
  return null
}
