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

## Instructions

Every markdown file MUST be formatted to GitHub Flavored Markdown (GFM) standard using `mdformat` with GFM extensions.

### Format Command

Run this command after writing any markdown content:

```bash
uvx --with mdformat-gfm mdformat --extensions gfm --wrap=80 {filename}
```

To format all .md files in current directory:

```bash
uvx --with mdformat-gfm mdformat --extensions gfm --wrap=80 .
```

### GFM Requirements

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
   <pre>```python
   def hello():
       print("world")
   ```</pre>

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

### Workflow

1. Write the markdown content
2. Run format command: `uvx --with mdformat-gfm mdformat --extensions gfm --wrap=80 {filename}`
3. Verify the formatted output
4. Stage and commit

### Quick Reference

| Feature | GFM Syntax |
| --- | --- |
| Heading | `# Title` |
| Bold | `**bold**` |
| Italic | `_italic_` |
| Code block | ```` ```lang ```` |
| Link | `[text](url)` |
| Table | `\| col \|` + `\| :--- \|` |
| Table align left | `\| :--- ` |
| Table align center | `\| :---: ` |
| Table align right | `\| ---: ` |
| Task list | `- [ ] task` |