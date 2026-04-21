# OpenCode Markdown Formatter Skill

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/anomalyco/opencode-markdown-formatter-skill/pulls)

Format all Markdown files to GitHub Flavored Markdown (GFM) standard.

## Recommended: Live Table Formatting

For automatic table formatting during AI text generation, use the community plugin:

```bash
npm install @franlol/opencode-md-table-formatter
```

Add to `.opencode/opencode.jsonc`:
```json
{
  "plugin": ["@franlol/opencode-md-table-formatter@latest"]
}
```

## CLI Alternative (Batch Processing)

For CI/CD or batch processing, clone and use directly:

```bash
# Clone or use local copy
git clone https://github.com/anomalyco/opencode-markdown-formatter-skill.git
cd opencode-markdown-formatter-skill

# Run fix-tables.js directly
node references/fix-tables.js README.md

# Or add to PATH
ln -s $(pwd)/references/fix-tables.js /usr/local/bin/fix-tables
```

## What It Does

| Feature | Before | After |
|---------|--------|-------|
| Table separator | `\|------\|------\|` | `\| :--- \| :--- \|` |
| Heading | `#Title` | `# Title` |
| Link | `https://url` | `[text](https://url)` |
| List | `* Item` | `- Item` |

## Features

- **Automatic GFM formatting** - Ensures all markdown follows GitHub Flavored Markdown standard
- **Two-step pipeline** - Fixes tables first, then lints everything else
- **Preserves already-correct files** - Skips idempotent changes
- **CLI flags** - `--check`, `--stdout`, `--verbose`, `--all`

## Requirements

- [OpenCode](https://opencode.ai) installed
- Node.js (for running markdownlint via npx)


## Installation

### Option 1: Clone to Global Skills Directory

```bash
git clone https://github.com/anomalyco/opencode-markdown-formatter-skill.git
cp -r opencode-markdown-formatter-skill ~/.config/opencode/skills/markdown-formatter
```

### Option 2: Project-Level Installation

```bash
git clone https://github.com/anomalyco/opencode-markdown-formatter-skill.git .opencode/skills/markdown-formatter
```

### Option 3: Symlink (for development)

```bash
ln -s ~/projects/opencode-markdown-formatter-skill ~/.config/opencode/skills/markdown-formatter
```

## Usage

The skill automatically triggers when you create or modify any `.md` file.

### Manual Trigger

```
/skill markdown-formatter
```

### Format Command

```bash
npx markdownlint-cli2 {filename} --fix
```

### Two-Step Pipeline (Recommended)

```bash
fix-tables.js {filename} && npx markdownlint-cli2 {filename} --fix
```

### Batch Fix All Markdown

```bash
find . -name "*.md" -exec npx markdownlint-cli2 {} --fix \;
```

## fix-tables.js

Normalizes table separators. markdownlint has no built-in rule for this.

```bash
# Fix specific file
fix-tables.js notes/file.md

# Fix all .md in directory
fix-tables.js --all notes/

# Check only (exit non-zero if fixes needed)
fix-tables.js --check notes/file.md

# Output to stdout
fix-tables.js --stdout < file.md
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

### Skill not loading

Verify the skill directory is in the correct location:

```bash
ls -la ~/.config/opencode/skills/markdown-formatter/SKILL.md
```

## Testing

```bash
node --test test-js.mjs
```

## Related Skills

- [code-review-checklist](https://github.com/anomalyco/opencode-code-review-checklist) - Code review checklist
- [skill-creator](https://github.com/anomalyco/opencode-skill-creator) - Create and test OpenCode skills

## Skill Development

This skill follows the [official skill specification](https://open-code.ai/docs/en/skills):

- **Naming**: kebab-case, lowercase letters and numbers only
- **Description**: Include both what the skill does AND when to trigger
- **Progressive Disclosure**: Keep SKILL.md under 500 lines
- **Three-Level Loading**: Metadata → SKILL.md body → Bundled resources

### Directory Structure

```
markdown-formatter/
├── SKILL.md           # Required: skill definition
├── README.md          # User-facing documentation
├── CONTRIBUTING.md    # Contribution guidelines
├── test-js.mjs        # JavaScript tests
├── references/        # Additional resources
│   ├── fix-tables.js  # Table separator normalizer (Node.js)
│   └── .markdownlint.json  # Lint configuration
└── .github/workflows/  # CI/CD
    └── ci.yml
```

## Official Documentation

- [OpenCode Skills Documentation](https://open-code.ai/docs/en/skills) - Official skill format guide
- [OpenCode Agent Skills](https://dev.opencode.ai/docs/skills) - Full API reference
- [Anthropic Agent Skills Spec](https://agentskills.io) - Official skill specification

## License

MIT License - see [LICENSE](LICENSE) file.

## Acknowledgments

- [markdownlint](https://github.com/DavidAnson/markdownlint) - Markdown linting tool
- [markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli) - Command-line interface
- [OpenCode](https://opencode.ai) - AI coding agent