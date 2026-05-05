# AGENTS.md

Instructions for AI agents working in this repository.

## Agent Best Practices

Follow these principles in all work:

1. **Read first, then act** — read existing files before editing. Understand the current state.
2. **Verify before committing** — test changes. Run linters. Don't assume it works.
3. **Use tools actively** — file read/search instead of grep/cat. Use `lint.sh --check` before push.
4. **Be incremental** — commit logical chunks. One concern per commit.
5. **Handle errors gracefully** — show actionable error messages. Don't hide failures.
6. **Preserve working behavior** — don't break what's already correct. The formatter is idempotent.
7. **Learn from mistakes** — if something fails, understand why before retrying.
8. **Use best practices proactively** — add input validation, security checks, proper error handling without being asked.

## Official Standards

When working in OpenCode skill repos, follow these conventions:

- **Skill structure**: Use `${SKILL_DIR}/SKILL.md` as the entry point
- **Metadata**: Only recognize `name`, `description`, `license`, `compatibility`, `metadata` in frontmatter
- **Entry commands**: Use `${OPENCODE_SKILL_DIR}/lint.sh` or documented CLI tools
- **No config hooks**: Skills don't support `opencode.jsonc` hooks — use git pre-commit or plugins instead

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

# Check code fences (empty openers, bad closers, mismatched counts)
./lint.sh --fences filename.md

# Dry-run: preview changes without applying
./lint.sh --dry-run filename.md

# Validate table columns (exit 1 if mismatches)
./lint.sh --validate filename.md

# Run tests
node --test test/test-js.mjs
```

### Code Fence Check

Fenced code blocks are easily corrupted by shell tools (backtick content interpreted as command substitution). Before committing, always run:

```bash
./scripts/check-fences.sh <file-or-dir>
```

Or via lint.sh:

```bash
./lint.sh --fences <path>
```

Exit 0 = all fences clean. Checks: no empty openers, no bare-lang closers, matched backtick counts.

### Table Validation (Critical)

Before committing any markdown changes, validate table column consistency:

```bash
# Validate column counts in all tables
./lint.sh --validate filename.md

# Validate all .md in directory
./lint.sh --validate --all docs/
```

This catches:

- Header columns ≠ separator columns
- Data rows with wrong column count
- Pipes inside cells (unescaped)

**Always run `--validate` before pushing to catch the exact issue that broke free-ai-models.md.**

## Conventions

### Table format

Use this format for all markdown tables:

```text
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

```text
opencode-markdown-formatter-skill/
├── SKILL.md                    # Skill definition
├── lint.sh                     # CLI wrapper (use this)
├── CHANGELOG.md               # Keep a Changelog format
├── CONTRIBUTING.md            # Contribution guidelines
├── README.md                 # Documentation
├── LICENSE                  # MIT license
├── package.json              # Node.js metadata
├── .github/workflows/ci.yml  # CI pipeline
├── .gitignore                # Git ignore rules
├── scripts/
│   └── check-fences.sh        # Code fence verifier
├── references/
│   ├── fix-tables.js           # Table formatter
│   └── .markdownlint.json      # Lint config
└── test/
    ├── test-js.mjs             # Tests
    └── kitchensink.md         # Test fixtures
```

## What to Avoid

- **Do not add `glob` dependency** — use built-in recursive file-walker
- **Do not reformat already correct files** — the formatter is idempotent
- **Do not change separator width formula** without running tests
- **Do not enable MD040** — produces false positives

## Contributing

### Other Skills

For reference, see other CodeSigils skills:

- [hermes-markdown-lint-skill](https://github.com/CodeSigils/hermes-markdown-lint-skill) — hermes agent version with similar goals

### Documentation

- [OpenCode Agent Skills](https://opencode.ai/docs/skills) — official skill format
- [OpenCode Plugins](https://opencode.ai/docs/plugins) — for hooks (not in config)

## SKILL.md Verification

When editing `SKILL.md`, verify frontmatter follows official spec:

```yaml
---
name: <skill-name>        # required, 1-64 chars, lowercase alphanumeric with hyphens
description: >           # required, multi-line with >
license: MIT             # optional
compatibility: opencode  # optional
metadata:               # optional, string-to-string map
  key: value
---
```

**Rules:**

- `name` must match directory and regex `^[a-z0-9]+(-[a-z0-9]+)*$`
- `description` max 1024 chars
- Unknown fields are ignored (keep it minimal)
- Only recognize: `name`, `description`, `license`, `compatibility`, `metadata`

## Version Policy

- Update `metadata.version` in SKILL.md frontmatter on each meaningful change
- Document changes in CHANGELOG.md
- Test before commit: `./lint.sh --check .` and `node --test test/test-js.mjs`

## Contribution

1. Branch from `master`
2. Make changes
3. Test: `./lint.sh --check .` and `node --test test/test-js.mjs`
4. Push and open PR against `master`
