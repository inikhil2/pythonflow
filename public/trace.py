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
        out['keyed'] = True
    # An object of the learner's own class: its repr is only an address, so show its attributes.
    elif type(v).__module__ == '__main__' and getattr(v, '__dict__', None):
        out['items'] = [_short(f'{k} = {x!r}') for k, x in list(vars(v).items())[:MAX_ITEMS]]
        out['length'] = len(vars(v))
        out['keyed'] = True
    return out


# Functions and modules are left out: their repr is only a memory address.
def _variables(names):
    return {
        name: _value(v)
        for name, v in names.items()
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
            'locals': _variables(frame.f_locals),
            'stdoutLength': out.tell(),
        }
        # Inside a function, also record the main program's variables, such as one changed with global.
        if frame.f_globals is not frame.f_locals:
            names = _variables(frame.f_globals)
            if names:
                step['globals'] = names
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
