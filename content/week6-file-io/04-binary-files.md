---
title: Binary files
week: 6
order: 4
minutes: 10
concepts: [files]
---

Not every file holds text. Images, sounds and zip files hold **bytes**: numbers from 0 to 255, which don't have to spell out letters at all. Opening one in text mode makes Python try to read letters, which usually stops with `UnicodeDecodeError`.

Add `"b"` to the mode to work with bytes instead. `"rb"` reads bytes, and `"wb"` writes them. What you read is a `bytes` value, which looks like a string with a `b` in front:

::trace
---
code: |
  with open("tiny.bin", "wb") as file:
      file.write(bytes([72, 105, 255]))

  with open("tiny.bin", "rb") as file:
      data = file.read()
  print(data)
  print(len(data), data[0])
---
::

Bytes that happen to be letters show as letters, so `72` and `105` print as `Hi`. Others show as codes, such as `\xff` for 255. Indexing a `bytes` value gives a number, so `data[0]` is `72`.

Many kinds of file start with the same few bytes, called a **signature**. Every PNG image starts with the 8 bytes `b"\x89PNG\r\n\x1a\n"`. A program can check those bytes to tell what a file really is, whatever its name says. `read(8)` reads only the first 8 bytes.

A common mistake: comparing bytes with a string. `b"PNG" == "PNG"` is `False`, because a `bytes` value never equals a `str`. Write the `b` in front.

Your turn: tell whether a file is a PNG image.

::exercise
---
id: w6-l4-ex1
prompt: Finish is_png so that it returns True if the file at path starts with the PNG signature, b"\x89PNG\r\n\x1a\n", and False otherwise.
starter: |
  def is_png(path):
      with open(path) as file:
          return file.read(8) == "\x89PNG\r\n\x1a\n"
hints:
  - The starter opens the file in text mode, so Python tries to read the byte 0x89 as a letter and fails.
  - Open the file with "rb", and compare file.read(8) with b"\x89PNG\r\n\x1a\n".
tests:
  - check: |
      with open("w6_image.png", "wb") as file:
          file.write(b"\x89PNG\r\n\x1a\n" + bytes(20))
      assert is_png("w6_image.png") is True, "is_png should be True for a PNG file"
  - check: |
      with open("w6_photo.jpg", "wb") as file:
          file.write(b"\xff\xd8\xff\xe0" + bytes(20))
      assert is_png("w6_photo.jpg") is False, "is_png should be False for a JPEG file"
solution: |
  def is_png(path):
      with open(path, "rb") as file:
          return file.read(8) == b"\x89PNG\r\n\x1a\n"
---
::
