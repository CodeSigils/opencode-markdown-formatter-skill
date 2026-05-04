# OpenCode Markdown Formatter Skill

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/CodeSigils/opencode-markdown-formatter-skill/pulls)

A skill for [OpenCode](https://opencode.ai) that provides instructions for formatting Markdown to GitHub Flavored Markdown (GFM) standard.

> **Note:** This is a **Skill** (AI instructions), not a **Plugin** (executable code). The skill tells the AI how to format markdown; it doesn't automatically run on save.

## Skill vs Plugin

| Aspect           | Skill                                                | Plugin                                 |
| :--------------- | :--------------------------------------------------- | :------------------------------------- |
| **What it is**   | Instructions for the AI agent                        | Executable code that runs in OpenCode  |
| **When it runs** | When you explicitly load it or AI reads instructions | Automatically on specific events       |
| **Installation** | Clone to `~/.config/opencode/skills/`                | Add to `opencode.jsonc` plugins        |
| **Example**      | This skill                                           | `@franlol/opencode-md-table-formatter` |

## Installation

```bash
# Clone to OpenCode skills directory
git clone https://github.com/CodeSigils/opencode-markdown-formatter-skill.git ~/.config/opencode/skills/markdown-formatter
```

## How to Use

### Option 1: Explicitly Load the Skill

When you need to format markdown, tell the AI to load the skill:

```bash
Load the markdown-formatter skill and format this file.
```

Or the AI can call: `skill({ name: "markdown-formatter" })`

The skill instructs the AI to format markdown according to GFM standards automatically.

### Option 2: Use the Wrapper Script (Recommended)

Run the CLI directly — see full reference below:

```bash
~/.config/opencode/skills/markdown-formatter/lint.sh --check file.md
```

### Option 3: Use the Community Plugin (Live Formatting)

For automatic formatting as you type, install the plugin:

```bash
# Install the plugin
npm install @franlol/opencode-md-table-formatter
```

Add to `.opencode/opencode.jsonc`:

```json
{
  "plugins": ["@franlol/opencode-md-table-formatter@latest"]
}
```

## What It Does

When the skill is active, the AI will format markdown like this:

| Feature            | Before               | After                              |
| :----------------- | :------------------- | :--------------------------------- |
| Table separator    | `\|------\|------\|` | `\| :--- \| :--- \|` (auto-widths) |
| Table column width | `\|h1\|h2\|`         | `\| h1 \| h2 \|` (matches header)  |
| Heading            | `#Title`             | `# Title`                          |
| Link               | `https://url`        | `[text](https://url)`              |
| List               | `* Item`             | `- Item`                           |

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

All-in-one wrapper: fix-tables.js + markdownlint-cli2

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

## Preventing Broken Tables

The most common table error is **column count mismatch** between the header, separator, and data rows. This often happens with:
- Extra `|` characters in type definitions (e.g., `"tab" | "space"`)
- Copy-paste errors in separator rows

### Validate Before You Push

```bash
# Add to CI or pre-commit to catch broken tables
./lint.sh --validate docs/
```

This validates:
- Header columns match separator columns
- All data rows have the correct number of columns
- Pipes inside cells are properly escaped with `&#124;`

### How to Escape Pipes in Tables

If a table cell contains a pipe character, escape it to prevent column misparsing:

| Before (broken)              | After (fixed)                      |
| :--------------------------- | :--------------------------------- |
| `"tab" \| "space"`           | `"tab" &#124; "space"`             |
| `"lf" \| "crlf" \| "cr"`     | `"lf" &#124; "crlf" &#124; "cr"`   |

## Auto-Lint on Write (Optional)

Since OpenCode skills don't support config file hooks, you can use a pre-commit hook at the project level:

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

## Related Skills

Other skills available in my [Hermes skills](https://github.com/CodeSigils/hermes-markdown-lint-skill) collection.

## Directory Structure

```text
opencode-markdown-formatter-skill/
├── SKILL.md                    # Skill definition (for OpenCode)
├── README.md                   # This file
├── CHANGELOG.md                # Keep a Changelog
├── lint.sh                     # Wrapper script (fix-tables + markdownlint + fence check)
├── CONTRIBUTING.md             # Contribution guidelines
├── LICENSE                     # MIT license
├── package.json                # npm scripts for convenience
├── .github/workflows/
│   └── ci.yml                 # CI/CD pipeline
├── .gitignore                  # Git ignore rules
├── scripts/
│   └── check-fences.sh        # Fenced code block checker
├── references/
│   ├── fix-tables.js           # Table separator normalizer
│   └── .markdownlint.json      # Lint configuration
├── test/
│   ├── test-js.mjs             # JavaScript tests
│   └── kitchensink.md          # Test data
└── .hermes/                    # Hermes agent config
```

## License

MIT License - see [LICENSE](LICENSE) file.
