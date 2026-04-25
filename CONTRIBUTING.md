# Contributing

Thank you for your interest in improving the markdown-formatter skill.

## Development Setup

Clone and symlink for development:

```bash
git clone https://github.com/CodeSigils/opencode-markdown-formatter-skill.git
ln -s "$(pwd)" ~/.config/opencode/skills/markdown-formatter
```

Run tests:

```bash
node --test test-js.mjs
```

Lint the skill files themselves:

```bash
npx markdownlint-cli2 SKILL.md README.md --config references/.markdownlint.json
```

## Adding New GFM Rules

When adding support for a new GFM feature:

1. Add the rule to `references/.markdownlint.json`
2. Document in `SKILL.md` under "GFM Requirements"
3. Add test cases to `test-js.mjs` if applicable
4. Update the quick reference table in `SKILL.md`

## Adding fix-tables.js Features

When extending `fix-tables.js`:

1. Add test cases first (TDD)
2. Implement the function
3. Ensure all tests pass: `node --test test-js.mjs`
4. Test CLI flags manually:

```bash
# Check mode (should exit 0 if no changes needed)
node references/fix-tables.js --check file.md && echo "OK"

# Verbose output
node references/fix-tables.js -v file.md

# Stdout mode
cat file.md | node references/fix-tables.js --stdout > fixed.md
```

## Pull Request Checklist

- [ ] All tests pass: `node --test test-js.mjs`
- [ ] Skill files pass lint: `npx markdownlint-cli2 SKILL.md --fix`
- [ ] New features documented in `SKILL.md`
- [ ] New test cases added
- [ ] README.md updated if adding user-facing changes

## Code Style

- JavaScript: Standard style
- Markdown: GFM standard
- No trailing whitespace
- Max line length: 88 (via mdformat --wrap=88)

## Reporting Issues

Please open an issue on GitHub with:

1. The markdown file that doesn't format correctly
2. The expected output
3. The actual output
4. The tool and version used (`npx markdownlint-cli2 --version`)
