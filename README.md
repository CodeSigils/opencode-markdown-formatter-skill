# OpenCode Markdown Formatter Skill

A community skill for [OpenCode](https://opencode.ai) that formats all Markdown files to GitHub Flavored Markdown (GFM) standard.

## What It Does

This skill automatically formats any Markdown file to follow GitHub Flavored Markdown conventions. It uses `mdformat` with GFM extensions to ensure consistent, clean Markdown that renders properly on GitHub, GitLab, and other platforms.

### Features

- **Automatic GFM formatting** - Ensures all markdown follows GitHub Flavored Markdown standard
- **Headings** - Validates ATX style (`#`, `##`, `###`) with proper spacing
- **Lists** - Consistent unordered (`-`) and ordered (`1.`) list formatting
- **Code blocks** - Proper fenced code blocks with language identifiers
- **Links** - Validates `[text](url)` format, no bare URLs
- **Tables** - Proper GFM table syntax with alignment
- **Emphasis** - Consistent bold (`**`) and italic (`_`) usage
- **No trailing whitespace** - Removes trailing spaces automatically
- **Line wrapping** - Wraps lines at 80 characters for readability

## Requirements

- [OpenCode](https://opencode.ai) installed
- [uv](https://github.com/astral-sh/uv) package manager (for running mdformat)

The skill uses `uvx` to run mdformat on-demand, so no persistent installation needed.

## Installation

### Option 1: Clone to Global Skills Directory

```bash
# Clone the repository
git clone https://github.com/yourusername/opencode-markdown-formatter-skill.git

# Copy to OpenCode global skills directory
cp -r opencode-markdown-formatter-skill ~/.config/opencode/skills/markdown-formatter
```

### Option 2: Project-Level Installation

```bash
# Clone into your project's .opencode/skills directory
git clone https://github.com/yourusername/opencode-markdown-formatter-skill.git .opencode/skills/markdown-formatter
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
uvx --with mdformat-gfm mdformat --extensions gfm --wrap=80 {filename}
```

### Example Workflow

1. Create or edit a Markdown file in OpenCode
2. The skill automatically detects the .md file
3. After writing, run: `uvx --with mdformat-gfm mdformat --extensions gfm --wrap=80 yourfile.md`
4. The file is automatically formatted to GFM standard

## Configuration

### Custom Wrap Width

To use a different wrap width, modify the command in SKILL.md:

```bash
uvx --with mdformat-gfm mdformat --extensions gfm --wrap=100 {filename}
```

### Additional mdformat Options

Add options like `--skip-invalid` or `--compact-tables` as needed:

```bash
uvx --with mdformat-gfm mdformat --extensions gfm --wrap=80 --compact-tables {filename}
```

## Skills Directory

OpenCode searches for skills in these locations (in priority order):

1. Project: `.opencode/skills/<skill-name>/`
2. Global: `~/.config/opencode/skills/<skill-name>/`

## Troubleshooting

### "uvx: command not found"

Install uv:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### "mdformat-gfm not found"

The skill automatically installs mdformat-gfm via `uvx --with mdformat-gfm`. This should work automatically.

### Skill not loading

Verify the skill directory is in the correct location:
```bash
ls -la ~/.config/opencode/skills/markdown-formatter/SKILL.md
```

## Related Skills

- [code-review-checklist](https://github.com/yourusername/opencode-code-review-checklist) - Python code review checklist
- [skill-creator](https://github.com/antongulin/opencode-skill-creator) - Create and test OpenCode skills

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
├── scripts/           # Optional: executable helpers
│   └── format.sh
└── references/       # Optional: additional docs
    └── examples.md
```

See [Best Practices Guide](https://lzw.me/docs/opencodedocs/joshuadavidthomas/opencode-agent-skills/appendix/best-practices/) for more.

## Official Documentation

- [OpenCode Skills Documentation](https://open-code.ai/docs/en/skills) - Official skill format guide
- [OpenCode Agent Skills](https://dev.opencode.ai/docs/skills) - Full API reference
- [SKILL.md Best Practices](https://lzw.me/docs/opencodedocs/joshuadavidthomas/opencode-agent-skills/appendix/best-practices/) - Community best practices
- [Anthropic Agent Skills Spec](https://agentskills.io) - Official skill specification

## License

MIT License - see [LICENSE](LICENSE) file.

## Contributing

Contributions welcome! Please open an issue or pull request on GitHub.

## Acknowledgments

- [mdformat](https://github.com/executablebooks/mdformat) - Python Markdown formatter
- [mdformat-gfm](https://github.com/executablebooks/mdformat-gfm) - GFM plugin for mdformat
- [OpenCode](https://opencode.ai) - AI coding agent
