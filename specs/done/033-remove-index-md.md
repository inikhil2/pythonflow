# 033: Remove the old content home page (shell step 4)
Run after: spec 032 is done and `npm run generate` passes.

`app/pages/index.vue` now owns `/`, so `content/index.md` is dead content. The
`[...slug].vue` catch-all still serves `content/about.md`.

## Steps
```sh
git -C ~/Desktop/AiderThings rm cs50p-tutor/content/index.md
cd ~/Desktop/AiderThings/cs50p-tutor && npm run generate
```

## Acceptance gates
- `npm run generate` exits 0.
- `.output/public/index.html` contains `Start with Hello, world`.
- `.output/public/about/index.html` still exists.
