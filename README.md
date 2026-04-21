# OpenCode Markdown Formatter Skill

A community skill for [OpenCode](https://opencode.ai) that formats all Markdown files to GitHub Flavored Markdown (GFM) standard.

## What It Does

This skill automatically formats any Markdown file to follow GitHub Flavored Markdown conventions. It uses `markdownlint-cli2` via `npx` to ensure consistent, clean Markdown that renders properly on GitHub, GitLab, and other platforms.

### Features

- **Automatic GFM formatting** - Ensures all markdown follows GitHub Flavored Markdown standard
- **Headings** - Validates ATX style (`#`, `##`, `###`) with proper spacing
- **Lists** - Consistent unordered (`-`) and ordered (`1.`) list formatting
- **Code blocks** - Proper fenced code blocks with language identifiers
- **Links** - Validates `[text](url)` format, no bare URLs
- **Tables** - Proper GFM table syntax with alignment
- **Emphasis** - Consistent bold (`**`) and italic (`_`) usage
- **No trailing whitespace** - Removes trailing spaces automatically

## Requirements

- [OpenCode](https://opencode.ai) installed
- Node.js (for running markdownlint via npx)

The skill uses `npx` to run markdownlint on-demand, so no persistent installation needed.

## Installation

### Option 1: Clone to Global Skills Directory

```bash
# Clone the repository
git clone https://github.com/anomalyco/opencode-markdown-formatter-skill.git

# Copy to OpenCode global skills directory
cp -r opencode-markdown-formatter-skill ~/.config/opencode/skills/markdown-formatter
```

### Option 2: Project-Level Installation

```bash
# Clone into your project's .opencode/skills directory
git clone https://github.com/anomalyco/opencode-markdown-formatter-skill.git .opencode/skills/markdown-formatter
```

### Option 3: Symlink (for development)

```bash
# Create symlink to the cloned repository
ln -s ~/projects/opencode-markdown-formatter-skill ~/.config/opencode/skills/markdown-formatter
```

## Usage

The skill automatically triggers when you create or modify any `.md` file.

### Manual Trigger

```
/skill markdown-formatter
```

### Format Command

The skill runs this command to format Markdown files:

```bash
npx markdownlint-cli2 {filename} --fix
```

### Example Workflow

1. Create or edit a Markdown file in OpenCode
2. The skill automatically detects the .md file
3. After writing, run: `npx markdownlint-cli2 yourfile.md --fix`
4. The file is automatically formatted to GFM standard

## Two-Step Pipeline (Recommended)

For docs with tables, use both fix-tables.py and markdownlint:

```bash
fix-tables.py {filename} && npx markdownlint-cli2 {filename} --fix
```

Step 1 normalizes table separators. Step 2 fixes everything else.

## Skills Directory

OpenCode searches for skills in these locations (in priority order):

1. Project: `.opencode/skills/<skill-name>/`
2. Global: `~/.config/opencode/skills/<skill-name>/`

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

## Related Skills

- [code-review-checklist](https://github.com/anomalyco/opencode-code-review-checklist) - Python code review checklist
- [skill-creator](https://github.com/anomalyco/opencode-skill-creator) - Create and test OpenCode skills

## Skill Development Best Practices

This skill follows the [official skill specification](https://open-code.ai/docs/en/skills):

- **Naming**: kebab-case, lowercase letters and numbers only
- **Description**: Include both what the skill does AND when to trigger
- **Progressive Disclosure**: Keep SKILL.md under 500 lines
- **Frontmatter**: Only required fields (`name`, `description`) + optional (`license`, `compatibility`)

### Three-Level Loading System

OpenCode loads skills progressively:

1. **Metadata** (name + description) - Always in context (~100 tokens)
2. **SKILL.md body** - Loaded when skill triggers (<500 lines ideal)
3. **Bundled resources** - As needed (scripts, references)

### Directory Structure

```
markdown-formatter/
├── SKILL.md           # Required: skill definition
├── references/        # Optional: additional resources
│   ├── fix-tables.py  # Table separator normalizer
│   └── .markdownlint.json  # Lint configuration
```

See [Best Practices Guide](https://open-code.ai/docs/en/skills) for more.

## Official Documentation

- [OpenCode Skills Documentation](https://open-code.ai/docs/en/skills) - Official skill format guide
- [OpenCode Agent Skills](https://dev.opencode.ai/docs/skills) - Full API reference
- [Anthropic Agent Skills Spec](https://agentskills.io) - Official skill specification

## License

MIT License - see [LICENSE](LICENSE) file.

## Contributing

Contributions welcome! Please open an issue or pull request on GitHub.

## Acknowledgments

- [markdownlint](https://github.com/DavidAnson/markdownlint) - Markdown linting tool
- [markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli) - Command-line interface
- [OpenCode](https://opencode.ai) - AI coding agent