---
title: Fizz Buzz
tier: easy
order: 36
leetcode: 412
url: https://leetcode.com/problems/fizz-buzz/
companies: [Amazon, Meta, Apple]
topic: Math
needs: [/learn/week0-functions/08-return-values, /learn/week2-loops/02-for-and-range, /learn/week2-loops/03-lists, /learn/week0-functions/04-strings, /learn/week0-functions/06-numbers]
---

You get a whole number n from 1 to 10000. Return a list of strings for the numbers 1 to n, in order. A number divisible by both 3 and 5 becomes FizzBuzz. A number divisible by 3 only becomes Fizz. A number divisible by 5 only becomes Buzz. Every other number becomes the number written as text.

::exercise
---
id: iv-easy-036
prompt: Write a function fizz_buzz(n) that returns the list of strings for 1 to n using the Fizz Buzz rules.
starter: |
  # write your code below
  def fizz_buzz(n):
      pass
hints:
  - Check for a multiple of 15 first, because it is also a multiple of 3 and of 5.
  - Numbers that are not divisible by 3 or 5 are written with str.
tests:
  - check: assert fizz_buzz(1) == ["1"]
  - check: assert fizz_buzz(3) == ["1", "2", "Fizz"]
  - check: assert fizz_buzz(5) == ["1", "2", "Fizz", "4", "Buzz"]
  - check: assert fizz_buzz(6)[5] == "Fizz"
  - check: assert fizz_buzz(10)[9] == "Buzz"
  - check: assert fizz_buzz(15) == ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]
solution: |
  def fizz_buzz(n):
      result = []
      for i in range(1, n + 1):
          if i % 15 == 0:
              result.append("FizzBuzz")
          elif i % 3 == 0:
              result.append("Fizz")
          elif i % 5 == 0:
              result.append("Buzz")
          else:
              result.append(str(i))
      return result
brute: |
  def fizz_buzz(n):
      out = []
      for i in range(1, n + 1):
          word = ""
          if i % 3 == 0:
              word += "Fizz"
          if i % 5 == 0:
              word += "Buzz"
          out.append(word or str(i))
      return out
random:
  call: fizz_buzz
  gen: |
    def gen(rng, size):
        return (rng.randint(1, 10 * size + 50),)
wrong:
  - |
    def fizz_buzz(n):
        result = []
        for i in range(1, n + 1):
            if i % 3 == 0:
                result.append("Fizz")
            elif i % 5 == 0:
                result.append("Buzz")
            else:
                result.append(str(i))
        return result
  - |
    def fizz_buzz(n):
        result = []
        for i in range(n):
            if i % 15 == 0:
                result.append("FizzBuzz")
            elif i % 3 == 0:
                result.append("Fizz")
            elif i % 5 == 0:
                result.append("Buzz")
            else:
                result.append(str(i))
        return result
---
::
