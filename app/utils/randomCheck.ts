import { NODE_PRELUDE, WRAP_PY } from './nodePrelude.ts'

// wrap: which call arguments gen returns as plain lists (nodes or tree, null to skip one) and how the result
// comes back. gen, same and the failure messages always see plain lists.
export interface Wrap {
  args?: (string | null)[]
  result?: string
}

export interface RandomSpec {
  call: string
  gen: string
  same?: string
  wrap?: Wrap
  // For a class problem: Python that defines the function named by `call`, replaying (ops, args) on the learner's class.
  driver?: string
}

// Python check code, appended to the learner's code: 200 inputs, small ones first.
export function randomCheck(random: RandomSpec, solution: string, prelude = false): string {
  const lit = (s: string) => JSON.stringify(s)
  const ok = random.same ? "_pf_same['same'](_pf_args, _pf_got, _pf_want)" : '_pf_got == _pf_want'
  const run = (fn: string) =>
    prelude ? `_pf_apply(${fn}, _pf_copy.deepcopy(_pf_args), _pf_wrap)` : `${fn}(*_pf_copy.deepcopy(_pf_args))`
  return [
    'import copy as _pf_copy, json as _pf_json, random as _pf_random',
    // Tells the page which input is running, so a timeout can name it. A stopped worker loses its stdout.
    'def _pf_start(text):',
    '    try:',
    '        import js',
    '        js.postMessage("pf-input " + text[:300])',
    '    except Exception:',
    '        pass',
    prelude && WRAP_PY,
    prelude && `_pf_wrap = _pf_json.loads(${lit(JSON.stringify(random.wrap ?? {}))})`,
    '_pf_ref, _pf_gen, _pf_same = {}, {}, {}',
    prelude && `exec(${lit(NODE_PRELUDE)}, _pf_ref)`,
    `exec(${lit(solution)}, _pf_ref)`,
    random.driver && `exec(${lit(random.driver)}, _pf_ref)`,
    // Defined here unless the checker already put a (wrapped) copy in the learner's code.
    random.driver && `if ${lit(random.call)} not in globals(): exec(${lit(random.driver)}, globals())`,
    `exec(${lit(random.gen)}, _pf_gen)`,
    random.same && `exec(${lit(random.same)}, _pf_same)`,
    'for _pf_i in range(200):',
    '    _pf_args = _pf_gen["gen"](_pf_random.Random(_pf_i), min(_pf_i // 10, 12))',
    '    _pf_text = ", ".join(repr(_pf_a) for _pf_a in _pf_args)',
    `    _pf_start("${random.call}(" + _pf_text + ")")`,
    `    _pf_want = ${run(`_pf_ref[${lit(random.call)}]`)}`,
    '    try:',
    `        _pf_got = ${run(random.call)}`,
    '    except Exception as _pf_e:',
    `        raise AssertionError(f"${random.call}({_pf_text}) raised {type(_pf_e).__name__}: {_pf_e}") from None`,
    `    if not (${ok}):`,
    `        raise AssertionError(f"${random.call}({_pf_text}) should return {_pf_want!r}, but returned {_pf_got!r}")`,
  ]
    .filter(Boolean)
    .join('\n')
}
