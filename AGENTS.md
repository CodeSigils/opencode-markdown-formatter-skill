# AGENTS.md

This file provides instructions for AI agents working in this repository.

## Overview

This repo contains an OpenCode skill for formatting Markdown to GitHub Flavored Markdown (GFM) standard. It ships three things: a skill definition for AI agents (`SKILL.md`), a CLI wrapper (`lint.sh`), and a table formatter (`fix-tables.js`).

AI agents should load the `SKILL.md` skill when asked to format or lint markdown files.

## Tech Stack

- **Runtime**: Node.js 18+
- **Linter**: markdownlint-cli2
- **Formatter**: `references/fix-tables.js` (custom, no external deps beyond Node)
- **Config**: `references/.markdownlint.json`

## Development Commands

```bash
# Run tests
node --test test/test-js.mjs

# Fix a single file
node references/fix-tables.js notes/file.md

# Fix all .md in a directory
node references/fix-tables.js --all notes/

# Check only (read-only, exit 0 if clean)
node references/fix-tables.js --check notes/file.md

# Full pipeline (fix + lint)
./lint.sh filename.md
./lint.sh --all .
./lint.sh --check filename.md
```

## Conventions

### Table format

Use this format for all markdown tables:

```
| Column 1 | Column 2 |
| :------- | :------- |
| value    | value    |
```

- Separator widths must match header column lengths minus 1 (`header.length - 1` — matches VSCode/marktext format)
- Always include a space after the leading `|` and before the trailing `|`
- Default column alignment: left (`:---`)

### markdownlint disabled rules

These rules are intentionally disabled in `.markdownlint.json`:

- **MD040** — fenced-code-language (too strict for prose docs)
- **MD055** — table-pipe-style (enforces trailing pipes on both sides)

### File structure

```
markdown-formatter/
├── SKILL.md                    # Skill definition (load this when formatting)
├── lint.sh                     # Full pipeline wrapper
├── references/
│   ├── fix-tables.js           # Table formatter
│   └── .markdownlint.json      # Lint config
└── test/
    ├── test-js.mjs             # Tests
    └── kitchensink.md           # Test fixtures
```

## What to Avoid

- **Do not add `glob` as a dependency.** Use the built-in recursive file-walker in `fix-tables.js` instead.
- **Do not reformat files that are already correct.** The formatter is idempotent — it skips unchanged files.
- **Do not change the separator width formula** (`header.length - 1`) without running tests first.
- **Do not enable MD040** in the markdownlint config — it produces false positives on valid documentation.

## Contribution Workflow

1. Create a branch from `master`.
2. Make changes and add tests if modifying `fix-tables.js`.
3. Run `node --test test/test-js.mjs` to verify nothing breaks.
4. Push and open a pull request against `master`.
