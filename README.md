# OpenCode Markdown Formatter Skill

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/CodeSigils/opencode-markdown-formatter-skill/pulls)

A skill for [OpenCode](https://opencode.ai) that provides instructions for formatting Markdown to GitHub Flavored Markdown (GFM) standard.

> **Note:** This is a **Skill** (AI instructions), not a **Plugin** (executable code). The skill tells the AI how to format markdown; it doesn't automatically run on save.

## Skill vs Plugin

| Aspect | Skill | Plugin |
|--------|-------|--------|
| **What it is** | Instructions for the AI agent | Executable code that runs in OpenCode |
| **When it runs** | When you invoke the skill or AI writes markdown | Automatically on specific events |
| **Installation** | Clone to `~/.config/opencode/skills/` | Add to `opencode.jsonc` plugins |
| **Example** | This skill | `@franlol/opencode-md-table-formatter` |

This skill provides guidance to the AI on how to format markdown correctly. For automatic live formatting, see the community plugin below.

## Quick Start

### Option 1: Use This Skill

Install the skill to provide AI with formatting instructions:

```bash
# Clone to OpenCode skills directory
git clone https://github.com/CodeSigils/opencode-markdown-formatter-skill.git ~/.config/opencode/skills/markdown-formatter
```

The skill triggers when you create or modify `.md` files. It instructs the AI to format markdown according to GFM standards.

### Option 2: Use the Community Plugin (Recommended for Live Formatting)

For automatic formatting as you type:

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

### Option 3: CLI Tool (Batch Processing)

For CI/CD pipelines or manual batch processing (no install required):

```bash
# Clone the repository
git clone https://github.com/CodeSigils/opencode-markdown-formatter-skill.git
cd opencode-markdown-formatter-skill

# Run npx (downloads tools on first run)
npx fix-tables.js README.md && npx markdownlint-cli2 README.md --fix
```

**Note:** `fix-tables.js` handles table separators only. `markdownlint-cli2` handles all other GFM rules (headings, lists, code blocks, links, etc.).

## What It Does

When the skill is active, the AI will format markdown like this:

| Feature | Before | After |
|---------|--------|-------|
| Table separator | `\|------\|------\|` | `\| :--- \| :--- \|` |
| Heading | `#Title` | `# Title` |
| Link | `https://url` | `[text](https://url)` |
| List | `* Item` | `- Item` |

## Features

- **Skill**: Provides AI with GFM formatting instructions
- **CLI**: Batch processing for CI/CD workflows (`fix-tables.js`)
- **Plugin alternative**: Community plugin for live formatting
- **Preserves idempotent changes**: Skips already-correct files

## Requirements

- [OpenCode](https://opencode.ai) installed
- Node.js 18+ (for npx CLI tools)

## npm Scripts (Optional)

If you install dependencies (`npm install`), these scripts are available:

```bash
# Format single file (tables + lint) - RECOMMENDED
npm run format -- README.md

# Format all .md files in current directory
npm run format:all

# Or run individually:
npm run format:table -- file.md     # Tables only
npm run format:lint -- file.md      # Lint only
```

**Alternatively, use npx directly (no install required):**

```bash
npx fix-tables.js README.md && npx markdownlint-cli2 README.md --fix
```

## fix-tables.js CLI Reference

```bash
# Fix specific file
node references/fix-tables.js notes/file.md

# Fix all .md in directory
node references/fix-tables.js --all notes/

# Check only (exits 0 if no changes needed)
node references/fix-tables.js --check notes/file.md

# Output to stdout (for piping)
node references/fix-tables.js --stdout < file.md > fixed.md
```

## Testing

```bash
node --test test-js.mjs
```

## Troubleshooting

### "npx: command not found"

Install Node.js:

```bash
# macOS/Homebrew
brew install node

# Ubuntu/Debian
sudo apt-get install nodejs npm
```

## Related Skills

- [code-review-checklist](https://github.com/CodeSigils/opencode-code-review-checklist) - Code review checklist
- [skill-creator](https://github.com/CodeSigils/opencode-skill-creator) - Create and test OpenCode skills

## Directory Structure

```
markdown-formatter/
├── SKILL.md                    # Skill definition (for OpenCode)
├── README.md                   # This file
├── CONTRIBUTING.md             # Contribution guidelines
├── LICENSE                   # MIT license
├── package.json              # npm scripts for convenience
├── test-js.mjs             # JavaScript tests
├── test-kitchensink.md     # Test data
├── references/
│   ├── fix-tables.js      # Table separator normalizer (CLI)
│   └── .markdownlint.json # Lint configuration
└── .github/workflows/
    └── ci.yml             # CI/CD pipeline
```

## License

MIT License - see [LICENSE](LICENSE) file.
