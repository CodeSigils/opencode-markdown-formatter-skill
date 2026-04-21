# OpenCode Markdown Formatter Skill

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/CodeSigils/opencode-markdown-formatter-skill/pulls)

Format all Markdown files to GitHub Flavored Markdown (GFM) standard.

## Quick Start

### Recommended: Live Formatting (Plugin)

For automatic formatting during AI text generation:

```bash
# Install the community plugin
npm install @franlol/opencode-md-table-formatter
```

Add to your `.opencode/opencode.jsonc`:

```json
{
  "plugins": ["@franlol/opencode-md-table-formatter@latest"]
}
```

This automatically formats markdown tables as you type.

### Alternative: CLI Tool

For CI/CD pipelines or batch processing without the plugin:

```bash
# Clone the repository
git clone https://github.com/CodeSigils/opencode-markdown-formatter-skill.git
cd opencode-markdown-formatter-skill

# Run fix-tables.js directly
node references/fix-tables.js README.md

# Or add to PATH for convenient access
ln -s $(pwd)/references/fix-tables.js /usr/local/bin/fix-tables
fix-tables README.md
```

## What It Does

| Feature | Before | After |
|---------|--------|-------|
| Table separator | `\|------\|------\|` | `\| :--- \| :--- \|` |
| Heading | `#Title` | `# Title` |
| Link | `https://url` | `[text](https://url)` |
| List | `* Item` | `- Item` |

## Features

- **Plugin**: Live auto-formatting during AI text generation
- **CLI**: Batch processing for CI/CD workflows
- **Preserves idempotent changes**: Skips already-correct files
- **CLI flags**: `--check`, `--stdout`, `--verbose`, `--all`

## Requirements

- [OpenCode](https://opencode.ai) installed
- Node.js 18+ (for npm and npx)

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
├── SKILL.md                    # Skill definition
├── README.md                   # This file
├── CONTRIBUTING.md             # Contribution guidelines
├── LICENSE                     # MIT license
├── test-js.mjs                 # JavaScript tests
├── test-kitchensink.md         # Test data
├── references/
│   ├── fix-tables.js          # Table separator normalizer (CLI)
│   └── .markdownlint.json     # Lint configuration
└── .github/workflows/
    └── ci.yml                 # CI/CD pipeline
```

## License

MIT License - see [LICENSE](LICENSE) file.
