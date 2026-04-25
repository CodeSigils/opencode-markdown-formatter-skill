---
name: markdown-formatter
description: >
  Format markdown to GFM standard. Uses fix-tables.js for table separators
  and markdownlint-cli2 for full linting. Run after creating or editing
  any .md file to enforce consistent formatting.
license: MIT
compatibility: opencode
metadata:
  argument-hint: "{filename} or --all {directory}"
  category: "devtools"
---

# Markdown Formatter

Format markdown files to enforce GitHub Flavored Markdown (GFM) rules.

This skill uses **markdownlint** via `npx` — zero install, works anywhere Node.js works.

**Always apply this skill automatically** when working with any Markdown file (`.md` extension). The AI should format markdown to GFM standard without being asked.

## When to Use

- After creating a new `.md` file
- After editing an existing `.md` file
- Before committing Markdown to a repository
- When checking documentation quality

## Prerequisites

This skill uses **npx** which comes with Node.js.

## Quick Start

### One-liner (recommended)

```bash
${OPENCODE_SKILL_DIR}/lint.sh <path>
```

This runs the full two-step pipeline in one command: fix tables, then lint and auto-fix everything else.

### Options

```bash
${OPENCODE_SKILL_DIR}/lint.sh <path>         # Fix file or directory
${OPENCODE_SKILL_DIR}/lint.sh --check <path>  # Read-only check (exit 0 if clean)
${OPENCODE_SKILL_DIR}/lint.sh --all <dir>     # Fix all .md in directory
```

### Two-step pipeline (manual)

If you prefer running steps separately:

```bash
node ${OPENCODE_SKILL_DIR}/references/fix-tables.js <path> && npx markdownlint-cli2 --config ${OPENCODE_SKILL_DIR}/references/.markdownlint.json <path> --fix
```

Step 1 normalizes table separators to `| :--- | :--- |` left-aligned style.
Step 2 fixes everything else.

## Workflows

### 1. After Creating a New File

1. Create the file
2. Run the fix command:

```bash
${OPENCODE_SKILL_DIR}/lint.sh <path>
```

Done — the file is GFM-compliant.

### 2. Batch Fix All Markdown in a Project

```bash
${OPENCODE_SKILL_DIR}/lint.sh --all .
```

### 3. CI / Pre-commit Check (read-only)

```bash
npx markdownlint-cli2 <path>
```

## GFM Rules Reference

markdownlint implements MD001–MD060 rules. Key rules enforced:

| Rule | Title | Description |
| :--- | :---- | :---------- |
| MD003 | heading-style | Use ATX headings (`#` style) |
| MD007 | ul-indent | Unordered list indent = 2 spaces |
| MD009 | no-trailing-spaces | No trailing spaces |
| MD010 | no-hard-tabs | No hard tabs |
| MD012 | no-multiple-blanks | Max one blank line between paragraphs |
| MD029 | ol-prefix | Ordered list prefix style |
| MD030 | list-marker-space | Spaces after list markers |
| MD032 | list-indent | Lists surrounded by blank lines |
| MD035 | hr-style | Horizontal rule style `---` |
| MD046 | code-block-style | Use fenced code blocks |
| MD048 | code-fence-style | Use backticks for code fences |
| MD055 | table-pipe-style | Table pipes on both sides |
| MD060 | table-column-style | Table separator style `---` |

Rules **disabled** (too strict for prose documentation):

| Rule | Title | Why Disabled |
| :--- | :---- | :----------- |
| MD013 | line-length | Prose lines are naturally longer |
| MD024 | multiple-headings | Same h2 text in different sections is valid |
| MD025 | multiple-h1 | Multiple top-level headings allowed |
| MD033 | no-inline-html | GFM supports basic inline HTML |
| MD034 | no-bare-urls | Bare URLs auto-link in GFM |
| MD036 | emphasis-instead-of-heading | Valid use case for emphasis |
| MD040 | fenced-code-language | Code fences don't always need a language |
| MD041 | first-line-heading | Frontmatter makes this noisy |
| MD045 | no-image-size | Images need dimensions sometimes |
| MD052 | no-bare-reference-link | Common in prose |

## fix-tables.js

Normalizes Markdown table separators from old-style `|------|------|` to GFM-compliant
`| :--- | :--- | :--- |` style with left-aligned cells (`---`).

**Features:**

- Auto-width column alignment (matches header column lengths)
- Detects already-correct separators and skips them
- Verbose output option

### Location

```
${OPENCODE_SKILL_DIR}/references/fix-tables.js
```

### Usage

```bash
# Fix specific file
node ${OPENCODE_SKILL_DIR}/references/fix-tables.js notes/file.md

# Fix all .md in directory
node ${OPENCODE_SKILL_DIR}/references/fix-tables.js --all .

# Check only (read-only, exit 0 if clean)
node ${OPENCODE_SKILL_DIR}/references/fix-tables.js --check notes/file.md
```

### How It Works

1. Scans for lines matching the table separator pattern
2. Detects column alignment from separator dashes
3. Replaces old-style separator with `| :--- |` matching the exact column count
4. Auto-width: calculates width based on header column lengths
5. Leaves all data rows and already-correct separators untouched

## Configuration

### Using bundled config

Copy the reference config to your project:

```bash
cp ~/.config/opencode/skills/markdown-formatter/references/.markdownlint.json ./.markdownlint.json
```

Or pass explicitly:

```bash
npx markdownlint-cli2 --config ~/.config/opencode/skills/markdown-formatter/references/.markdownlint.json <path> --fix
```

## Troubleshooting

### npx: command not found

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

Run from the project root or pass the config explicitly:

```bash
npx markdownlint-cli2 --config ${OPENCODE_SKILL_DIR}/references/.markdownlint.json <path> --fix
```

### `--fix` does not fix everything in one pass

Known behavior. Run twice if needed:

```bash
npx markdownlint-cli2 <path> --fix
npx markdownlint-cli2 <path> --fix
```

## Quick Reference

| Task | Command |
| :--- | :------ |
| Fix file | `${OPENCODE_SKILL_DIR}/lint.sh <path>` |
| Fix all | `${OPENCODE_SKILL_DIR}/lint.sh --all .` |
| Check only | `${OPENCODE_SKILL_DIR}/lint.sh --check <path>` |
| Manual steps | `node ${OPENCODE_SKILL_DIR}/references/fix-tables.js <path> && npx markdownlint-cli2 --config ${OPENCODE_SKILL_DIR}/references/.markdownlint.json <path> --fix` |
