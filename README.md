# OpenCode Markdown Formatter Skill

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/CodeSigils/opencode-markdown-formatter-skill/pulls)

A skill for [OpenCode](https://opencode.ai) that provides instructions for formatting Markdown to GitHub Flavored Markdown (GFM) standard.

> **Note:** This is a **Skill** (AI instructions), not a **Plugin** (executable code). The skill tells the AI how to format markdown; it doesn't automatically run on save.

## Installation

```bash
# Clone to OpenCode skills directory
git clone https://github.com/CodeSigils/opencode-markdown-formatter-skill.git ~/.config/opencode/skills/markdown-formatter
```

Then tell the AI to load the skill when needed.

## How to Use

### Option 1: Explicitly Load the Skill (Recommended)

When you need to format markdown, tell the AI to load the skill:

```
Load the markdown-formatter skill and format this file.
```

Or the AI can call: `skill({ name: "markdown-formatter" })`

The skill instructs the AI to format markdown according to GFM standards automatically.

### Option 2: Use the Wrapper Script

Run the CLI directly:

```bash
~/.config/opencode/skills/markdown-formatter/lint.sh --check file.md
```

## What It Does

The three-step pipeline fixes markdown violations:

```
fix-tables.js  →  normalizes separator format (:---)
pad-tables.js  →  widens all rows to match column widths
markdownlint   →  verifies MD060 compliance
```

| Feature           | Before              | After                             |
| : ----------------- | : ------------------- | : --------------------------------- |
| Table separator    | `\|------\|------\|` | `\| :--- \| :--- \|` (auto-widths) |
| Table column width | `\|h1\|h2\|`        | `\| h1 \| h2 \|` (matches header)  |
| Table pipe align   | `\| a \|Long\|`     | `\| a    \| Long \|` (MD060)      |
| Heading            | `#Title`            | `# Title`                         |
| Link               | `https://url`       | `[text](https://url)`             |
| List               | `* Item`            | `- Item`                          |

## Features

- **Skill**: Provides AI with GFM formatting instructions
- **CLI**: Batch processing for CI/CD workflows (`lint.sh`)
- **Plugin alternative**: Community plugin for live formatting
- **Auto-width tables**: Separator widths match header column lengths
- **Preserves idempotent changes**: Skips already-correct files

## Requirements

- [OpenCode](https://opencode.ai) installed
- Node.js 18+ (for npx CLI tools)

## lint.sh Reference

Three-step pipeline: fix-tables.js + pad-tables.js + markdownlint-cli2

```bash
# Fix file or directory
lint.sh <path>

# Fix all .md in directory
lint.sh --all <directory>

# Check only (read-only, exit 0 if clean)
lint.sh --check <path>

# Check fenced code blocks (exit 1 if issues found)
lint.sh --fences <path>

# Validate table columns (exit 1 if mismatches)
lint.sh --validate <path>

# Dry-run: preview without applying
lint.sh --dry-run <path>

# Run tests
node --test test/test-js.mjs
```

## Auto-Lint on Write (Optional)

Since OpenCode skills don't support config file hooks, you can use a git pre-commit hook:

```bash
# Add to your project's .git/hooks/pre-commit
#!/bin/bash
git diff --staged --name-only | grep '\.md$' | while read file; do
  ~/.config/opencode/skills/markdown-formatter/lint.sh "$file"
  git add "$file"
done
```

Or use a shell alias in your shell rc file:

```bash
# In ~/.bashrc or ~/.zshrc
alias mdformat='~/.config/opencode/skills/markdown-formatter/lint.sh'
```

Then use: `mdformat filename.md`

## Requirements

- [OpenCode](https://opencode.ai) installed
- Node.js 18+ (for npx CLI tools)
- pnpm (for local development)

## Testing

```bash
node --test test/test-js.mjs
```

## Troubleshooting

### "npx: command not found"

Install Node.js:

```bash
# macOS/Homebrew
brew install node

# Ubuntu/Debian
sudo apt-get install nodejs npm

# Or use fnm/nvm
curl -fsSL https://fnm.install | bash
```

### Config file not found

Run from the project root, or pass the config explicitly:

```bash
npx markdownlint-cli2 --config ~/.config/opencode/skills/markdown-formatter/references/.markdownlint.json <path> --fix
```

## Directory Structure

```text
opencode-markdown-formatter-skill/
├── SKILL.md                    # Skill definition (for OpenCode)
├── README.md                   # This file
├── CHANGELOG.md                # Keep a Changelog
├── lint.sh                     # Wrapper script (fix-tables + pad-tables + markdownlint)
├── CONTRIBUTING.md             # Contribution guidelines
├── LICENSE                     # MIT license
├── package.json                # npm scripts for convenience
├── pnpm-lock.yaml              # Lockfile (committed)
├── .github/workflows/
│   └── ci.yml                 # CI/CD pipeline
├── .gitignore                  # Git ignore rules
├── scripts/
│   └── check-fences.sh        # Fenced code block checker
├── references/
│   ├── fix-tables.js           # Table separator normalizer
│   ├── pad-tables.js           # Table row aligner (MD060)
│   └── .markdownlint.json      # Lint configuration
└── test/
    ├── test-js.mjs             # JavaScript tests
    └── kitchensink.md          # Test data
```

## Related Skills

Other skills available in my [Hermes skills](https://github.com/CodeSigils/hermes-markdown-lint-skill) collection.

## License

MIT License - see [LICENSE](LICENSE) file.
