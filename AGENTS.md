# AGENTS.md

Instructions for AI agents working in this repository.

## What This Repo Is

This is an **OpenCode skill** for formatting Markdown to GitHub Flavored Markdown (GFM) standard.

- `SKILL.md` — skill definition (for OpenCode)
- `lint.sh` — CLI wrapper (recommended entry point)
- `references/fix-tables.js` — table separator normalizer
- `references/.markdownlint.json` — lint configuration

## For OpenCode Agents

When asked to format or lint markdown files:

1. **Load the skill**: `skill({ name: "markdown-formatter" })`
2. **Or use the wrapper**: `./lint.sh`

The skill instructs the AI to format markdown according to GFM standards automatically.

## Development Commands

Use `lint.sh` for all development tasks:

```bash
# Fix a file
./lint.sh filename.md

# Fix all .md in directory
./lint.sh --all .

# Check only (read-only, exit 0 if clean)
./lint.sh --check filename.md

# Run tests
node --test test/test-js.mjs
```

## Conventions

### Table format

Use this format for all markdown tables:

```
| Column 1 | Column 2 |
| :------- | :------- |
| value    | value    |
```

- Separator widths: `header.length - 1` (matches VSCode/marktext)
- Space after leading `|` and before trailing `|`
- Default alignment: left (`:---`)

### markdownlint rules

| Rule | Status | Note |
| :--- | :----- | :--- |
| MD040 | disabled | Too strict for prose docs |
| MD055 | enabled | Trailing pipes on both sides |
| MD013 | disabled | Prose lines are naturally longer |

### File structure

```
markdown-formatter/
├── SKILL.md                    # Skill definition
├── lint.sh                     # Wrapper (use this)
├── references/
│   ├── fix-tables.js           # Table formatter
│   └── .markdownlint.json      # Lint config
└── test/
    ├── test-js.mjs             # Tests
    └── kitchensink.md           # Test fixtures
```

## What to Avoid

- **Do not add `glob` dependency** — use built-in recursive file-walker
- **Do not reformat already correct files** — the formatter is idempotent
- **Do not change separator width formula** without running tests
- **Do not enable MD040** — produces false positives

## Contribution

1. Branch from `master`
2. Make changes
3. Test: `./lint.sh --check .` and `node --test test/test-js.mjs`
4. Push and open PR against `master`
