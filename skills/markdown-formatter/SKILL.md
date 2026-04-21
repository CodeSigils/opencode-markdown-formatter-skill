---
name: markdown-formatter
description: Format all markdown files to GitHub Flavored Markdown (GFM) standard. Use this skill whenever creating or updating any .md file including README.md, CHANGELOG.md, CONTRIBUTING.md, API docs, or any documentation. Make sure to apply GFM formatting after writing any markdown, especially before committing or creating PRs.
license: MIT
compatibility: opencode
---

> This skill follows the [OpenCode Skills Specification](https://open-code.ai/docs/en/skills) and [Anthropic Agent Skills Spec](https://agentskills.io).

# Markdown Formatter

Use this skill whenever you create or modify any Markdown file (files with `.md` extension).

## When to Apply

- Creating a new README.md, CHANGELOG.md, CONTRIBUTING.md, or any documentation
- Modifying existing markdown files
- Writing any .md file for project docs, API references, or guides
- After generating markdown via AI, before finalizing

**Trigger phrases**: "format markdown", "GFM", "write markdown", "create README", "update docs"

## Two Approaches

This skill supports two complementary tools:

1. **mdformat** - Formats markdown to GFM standard (primary)
2. **markdownlint** - Lints and fixes GFM rules (alternative)

## Approach 1: mdformat (Primary)

Uses `mdformat` with GFM extensions for automatic formatting.

### Format Command

```bash
uvx --with mdformat-gfm mdformat --extensions gfm --wrap=80 {filename}
```

To format all .md files in current directory:

```bash
uvx --with mdformat-gfm mdformat --extensions gfm --wrap=80 .
```

## Approach 2: markdownlint (Alternative)

Uses `markdownlint-cli2` for linting with comprehensive GFM rules.

### Lint Command

```bash
uvx markdownlint-cli2 {filename} --fix
```

### Recommended: Two-Step Pipeline

For best results, use both tools in sequence:

```bash
fix-tables.py {filename} && uvx markdownlint-cli2 {filename} --fix
```

Step 1 normalizes table separators (mdformat misses this).
Step 2 fixes everything else.

### Why Two Tools?

| Tool | Strength |
|------|----------|
| mdformat | Formats consistently, wraps lines |
| markdownlint | Catches MD001-MD045 rules |
| fix-tables.py | Normalizes table separators |

## GFM Requirements

All markdown must follow these rules:

1. **Headings**: Use ATX style (`#`, `##`, `###`) with exactly one space after hashes
   ```markdown
   # Title
   ## Section
   ```

2. **Lists**: Use `-` for unordered, `1.` for ordered (consistent nesting)
   ```markdown
   - Item one
   - Item two
   ```

3. **Code blocks**: Use triple backticks with language identifier
   ```python
   def hello():
       print("world")
   ```

4. **Links**: Use `[text](url)` format, not bare URLs
   ```markdown
   [OpenCode](https://opencode.ai)
   ```

5. **Images**: Use `![alt](url)` format

6. **Tables**: Use proper GFM table syntax with alignment:
   ```markdown
   | Left | Center | Right |
   | :--- | :---: | ---: |
   | a | b | c |
   ```
   - `|:---|` = left aligned
   - `|:---:|` = center aligned
   - `|---:|` = right aligned
   - Always include the separator row `| --- | --- | --- |`

7. **Line breaks**: Use `<br>` for hard breaks in paragraphs

8. **Emphasis**: Use `**bold**` and `_italic_` consistently

9. **No trailing whitespace**: Remove all trailing spaces

10. **Blank lines**: Single blank line between block elements

11. **Horizontal Rules**: Use `---` (three dashes)

12. **Blockquotes**: Use `>` without blank lines inside
    ```markdown
    > This is a blockquote
    > Continues on next line
    ```

## Workflows

### After Creating a New File

1. Write the markdown content
2. Run: `uvx --with mdformat-gfm mdformat --extensions gfm --wrap=80 {filename}`
3. Verify the formatted output
4. Stage and commit

### Recommended: Full Pipeline

1. Write the markdown content
2. Run table fix: `fix-tables.py {filename}`
3. Run lint: `uvx markdownlint-cli2 {filename} --fix`
4. Stage and commit

### Batch Fix All Markdown

```bash
# mdformat
find . -name "*.md" -exec uvx --with mdformat-gfm mdformat --extensions gfm --wrap=80 {} \;

# or markdownlint
find . -name "*.md" -exec uvx markdownlint-cli2 {} --fix \;
```

## fix-tables.py

Normalizes table separators from old-style `|------|------|` to GFM-compliant `| :--- | :--- |` style.

**Why?** mdformat doesn't handle table separator alignment, so this script fills the gap.

### Location

```
~/.config/opencode/skills/markdown-formatter/references/fix-tables.py
```

### Usage

```bash
# Fix specific file
fix-tables.py notes/file.md

# Fix all .md in directory
fix-tables.py --all notes/

# Dry-run (shows what would change)
fix-tables.py --dry notes/file.md
```

### How It Works

1. Scans for table separator lines (`|---|---|` pattern)
2. Counts columns from header row
3. Replaces with proper `| --- | --- |` format (left-aligned)
4. Leaves data rows untouched

## Quick Reference

| Feature | GFM Syntax |
| --- | --- |
| Heading | `# Title` |
| Bold | `**bold**` |
| Italic | `_italic_` |
| Code block | ``` `lang` |
| Link | `[text](url)` |
| Table | `\| col \|` + `\| :--- \|` |
| Task list | `- [ ] task` |

## Configuration

### markdownlint config

This skill includes a `.markdownlint.json` in references/ for GFM rules.

Copy to your project:

```bash
cp ~/.config/opencode/skills/markdown-formatter/references/.markdownlint.json ./.markdownlint.json
```

Or pass explicitly:

```bash
uvx markdownlint-cli2 --config ~/.config/opencode/skills/markdown-formatter/references/.markdownlint.json {filename} --fix
