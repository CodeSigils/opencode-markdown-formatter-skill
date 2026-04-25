---
name: markdown-formatter
description: Format markdown to GFM standard. Use the @franlol/opencode-md-table-formatter plugin for live formatting, or fix-tables.js CLI for batch processing. Trigger on any .md file creation or modification.
license: MIT
compatibility: opencode
metadata:
  argument-hint: "{filename} or --all {directory}"
  user-invocable: true
---

> This skill follows the [OpenCode Skills Specification](https://opencode.ai/docs/skills) and [Anthropic Agent Skills Spec](https://agentskills.io).

# Markdown Formatter

**Always apply this skill automatically** when working with any Markdown file (`.md` extension). The AI should format markdown to GFM standard without being asked.

## When to Apply (Auto-Trigger)

This skill applies **automatically** in these situations:

1. Creating any new `.md` file (README.md, CHANGELOG.md, CONTRIBUTING.md, etc.)
2. Modifying any existing `.md` file
3. Writing markdown content in any context
4. Generating markdown via AI
5. Before committing or creating PRs

**No manual trigger needed** - the AI should always format markdown to GFM standard.

## Two Approaches

This skill supports two complementary tools:

1. **@franlol/opencode-md-table-formatter** - Plugin for live table formatting (recommended)
2. **fix-tables.js** - CLI tool for batch processing (alternative)

### Recommended: Community Plugin

For automatic table formatting during AI text generation, use the community plugin:

```bash
npm install @franlol/opencode-md-table-formatter
```

Add to your `.opencode/opencode.jsonc`:
```json
{
  "plugins": ["@franlol/opencode-md-table-formatter@latest"]
}
```

This formats tables automatically after AI text completion with proper alignment.

### Alternative: CLI Tool

For batch processing or CI/CD pipelines (no install required):

```bash
node references/fix-tables.js {filename} && npx markdownlint-cli2 {filename} --fix
```

### Recommended: Two-Step Pipeline

For best results, use both tools in sequence:

```bash
node references/fix-tables.js {filename} && npx markdownlint-cli2 {filename} --fix
```

Step 1 normalizes table separators (mdformat misses this).
Step 2 fixes everything else.

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
2. Run: `node references/fix-tables.js {filename} && npx markdownlint-cli2 {filename} --fix`
3. Verify the formatted output
4. Stage and commit

### Recommended: Full Pipeline

1. Write the markdown content
2. Run: `node references/fix-tables.js {filename} && npx markdownlint-cli2 {filename} --fix`
3. Stage and commit

### Batch Fix All Markdown

```bash
find . -name "*.md" -exec node references/fix-tables.js {} \; && npx markdownlint-cli2 . --fix
```

## fix-tables.js

Normalizes table separators from old-style `|------|------|` to GFM-compliant `| :--- | :--- |` style.

**Why?** markdownlint doesn't handle table separator alignment, so this script fills the gap.

### Location

```
~/.config/opencode/skills/markdown-formatter/references/fix-tables.js
```

### Usage

```bash
# Fix specific file
node references/fix-tables.js notes/file.md

# Fix all .md in directory
node references/fix-tables.js --all .

# Check only (exit non-zero if fixes needed)
node references/fix-tables.js --check notes/file.md

# Verbose output
node references/fix-tables.js -v notes/file.md
```

### How It Works

1. Scans for table separator lines (`|---|---|` pattern)
2. Detects already-correct separators (`:---`) and skips them
3. Replaces with `| :--- |` format (left-aligned)
4. Leaves data rows untouched

## Troubleshooting

### MD013: line too long

Disable MD013 in `.markdownlint.json` or use `npx mdformat --extensions gfm --wrap=80 {filename}` instead.

### MD033: inline HTML not allowed

Add to `.markdownlint.json`:

```json
{
  "MD033": { "allowed_elements": ["details", "summary", "br"] }
}
```

### Tables not rendering correctly

Use the two-step pipeline:

```bash
node references/fix-tables.js {filename} && npx markdownlint-cli2 {filename} --fix
```

## Quick Reference

| Feature | GFM Syntax |
| --- | --- |
| Heading | `# Title` |
| Bold | `**bold**` |
| Italic | `_italic_` |
| Code block | ```` `lang` |
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
npx markdownlint-cli2 --config ~/.config/opencode/skills/markdown-formatter/references/.markdownlint.json {filename} --fix
```