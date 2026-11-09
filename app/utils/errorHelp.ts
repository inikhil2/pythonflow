export interface ErrorExplanation {
  title: string
  body: string
}

// Keyed by the exception name: the text before the first colon of the error line.
const byName: Record<string, ErrorExplanation> = {
  SyntaxError: {
    title: 'Python could not read your code',
    body: 'Something is typed in a way Python does not understand, so nothing ran. Look at the line in the message and the line just before it for a missing bracket, quote or colon.',
  },
  IndentationError: {
    title: 'The indentation is wrong',
    body: 'Python uses the spaces at the start of a line to group code. After a line that ends in a colon, indent the next lines by 4 spaces, and line up lines that belong together.',
  },
  NameError: {
    title: 'Python does not know that name',
    body: 'You used a name before giving it a value, or the spelling is different. Check the spelling and capital letters. Text needs quotes: "hello", not hello.',
  },
  TypeError: {
    title: 'A value has the wrong type for this',
    body: 'For example, "5" + 1 mixes a string and a number. input() always gives a string, so convert it with int() or float() before doing maths.',
  },
  ValueError: {
    title: 'The type is right but the value is not',
    body: 'For example, int("cat") fails because "cat" is not a number. Check what is in the Input box.',
  },
  IndexError: {
    title: 'That position does not exist',
    body: 'Positions start at 0, so a list of 3 items has positions 0, 1 and 2. Compare the index with len().',
  },
  KeyError: {
    title: 'That key is not in the dictionary',
    body: 'Check the spelling and capital letters of the key, or use .get(key) to get None instead of an error.',
  },
  ZeroDivisionError: {
    title: 'You divided by zero',
    body: 'Dividing by 0 has no answer. Check the number you divide by before you divide.',
  },
  AttributeError: {
    title: 'That value has no such method',
    body: 'For example, numbers have no .upper(). Check the spelling, and check the type of the value with type().',
  },
  ModuleNotFoundError: {
    title: 'Python cannot find that module',
    body: 'Check the spelling after import. Only the Python standard library is available here.',
  },
  EOFError: {
    title: 'Your program asked for more input',
    body: 'input() was called but the Input box has no more lines. Add one line to the Input box for each input() call.',
  },
  RecursionError: {
    title: 'A function called itself too many times',
    body: 'Each call must move towards a base case that returns without calling again. Check that the base case is reached.',
  },
}

const unterminatedString: ErrorExplanation = {
  title: 'A string is missing its closing quote',
  body: 'A string starts with a quote but never ends. Add the matching closing quote, " or \', on the line the message names.',
}

const timeout: ErrorExplanation = {
  title: 'Your program took too long',
  body: 'A while loop whose condition never becomes False runs forever. Check that something inside the loop changes the condition.',
}

export function explainError(error: string | null): ErrorExplanation | null {
  if (!error) return null
  if (error.startsWith('Your program ran for more than')) return timeout
  if (error.startsWith('SyntaxError: unterminated string literal')) return unterminatedString
  return byName[(error.split(':')[0] ?? '').trim()] ?? null
}
