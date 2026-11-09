---
title: Properties
week: 8
order: 3
minutes: 10
concepts: [properties]
---

Checking data in `__init__` protects a new object. But anyone can change an attribute later, as in `temperature.celsius = -500`, and nothing checks that. A **property** fixes this. It looks like an attribute from the outside, but reading or setting it runs a method.

You write a property in two parts. `@property` marks the method that runs when the value is read. `@celsius.setter` marks the method that runs when a value is set. The real value is stored under a slightly different name, by custom with `_` in front:

::trace
---
code: |
  class Temperature:
      def __init__(self, celsius):
          self.celsius = celsius

      @property
      def celsius(self):
          return self._celsius

      @celsius.setter
      def celsius(self, value):
          if value < -273.15:
              raise ValueError("colder than absolute zero")
          self._celsius = value

  temperature = Temperature(20)
  temperature.celsius = 25
  print(temperature.celsius)
---
::

Notice that `__init__` sets `self.celsius`, not `self._celsius`. That runs the setter, so even a brand new object is checked.

A property with no setter can't be set at all, which suits a value worked out from others. A `fahrenheit` property could return `self.celsius * 9 / 5 + 32`. Setting it would raise `AttributeError`.

The `_` in `_celsius` is a polite sign that says "don't touch this from outside the class". Python doesn't enforce it.

A common mistake: storing the value as `self.celsius` inside the setter. That calls the setter again, which calls it again, until Python stops with `RecursionError`.

Your turn: protect an attribute.

::exercise
---
id: w8-l3-ex1
prompt: Make celsius a property, so that setting it to anything below -273.15 raises ValueError, whether in Temperature(...) or later with temperature.celsius = .... Keep the fahrenheit property working.
starter: |
  class Temperature:
      def __init__(self, celsius):
          self.celsius = celsius

      @property
      def fahrenheit(self):
          return self.celsius * 9 / 5 + 32
hints:
  - celsius is a plain attribute here, so nothing checks it when it is set.
  - Add a celsius method with @property that returns self._celsius, and one with @celsius.setter that checks value, then sets self._celsius.
tests:
  - check: |
      temperature = Temperature(20)
      assert temperature.celsius == 20
      assert temperature.fahrenheit == 68
  - check: |
      try:
          Temperature(-300)
          raise AssertionError("Temperature(-300) should raise ValueError")
      except ValueError:
          pass
  - check: |
      temperature = Temperature(20)
      try:
          temperature.celsius = -500
          raise AssertionError("setting celsius to -500 should raise ValueError")
      except ValueError:
          pass
      assert temperature.celsius == 20, "a refused value must not be kept"
solution: |
  class Temperature:
      def __init__(self, celsius):
          self.celsius = celsius

      @property
      def celsius(self):
          return self._celsius

      @celsius.setter
      def celsius(self, value):
          if value < -273.15:
              raise ValueError("colder than absolute zero")
          self._celsius = value

      @property
      def fahrenheit(self):
          return self.celsius * 9 / 5 + 32
---
::
