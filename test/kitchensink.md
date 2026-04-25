# Markdown Kitchen Sink - GFM Test Document

This file demonstrates all GitHub Flavored Markdown rules for testing the
formatter.

## 1. Headings (ATX Style)

# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

## 2. Emphasis

**Bold text** _Italic text_ **_Bold and italic_** ~~Strikethrough~~

## 3. Lists

### Unordered Lists

-   Item one
-   Item two
  -   Nested item
  -   Another nested
-   Item three

### Ordered Lists

1.  First item
2.  Second item
3.  Third item

### Task Lists

-   [ ] Unchecked task
-   [x] Checked task
-   [ ] Another unchecked

## 4. Code Blocks

### Inline Code

Use the `print()` function.

### Fenced Code Blocks

```python
def greet(name: str) -> str:
    """Greet a user by name."""
    return f"Hello, {name}!"

result = greet("World")
print(result)
```

```javascript
const greet = (name) => {
  return `Hello, ${name}!`;
};

console.log(greet("World"));
```

```bash
#!/bin/bash
echo "Hello, World!"
```

## 5. Links

### Inline Links

[OpenCode](https://opencode.ai) [GitHub](https://github.com)

### Reference Links

[OpenCode docs][opencode-doc] for skills reference.

## 6. Images

![OpenCode Logo](https://opencode.ai/logo.png)

## 7. Tables

### Basic Table

| Name  | Age | City |
| :--- | :--- | :--- |
| Alice | 25  | NYC  |
| Bob   | 30  | LA   |

### Table with Alignment

| Left  | Center | Right |
| :--- | :-----: | ----: |
| a     |   b    |     c |
| align | align  | align |

### Complex Table

| Feature |    Syntax     | Example     |
| :------ | :-----: | :------ |
| Heading |  `# Heading`  | # Title     |
| Bold    |  `**text**`   | **bold**    |
| Italic  |   `*text*`    | _italic_    |
| Code    | `` `code` ``  | `code`      |
| Link    | `[text](url)` | [link](url) |
| Table   |  `\| col \|`  | See above   |

## 8. Blockquotes

> This is a blockquote. It can span multiple lines.

> Nested quotes are supported
>
> > inside quotes also work

## 9. Horizontal Rules

Three ways to write horizontal rules:

______________________________________________________________________

(- - -)

______________________________________________________________________

(\* * \*)

______________________________________________________________________

## 10. Strikethrough (GFM Extension)

~~This text is strikethrough.~~

## 11. Autolinks (GFM Extension)

<https://opencode.ai>

## 12. Inline HTML

<div>
  <strong>HTML works in GFM</strong>
</div>

## 13. Task Lists Multiple

-   [ ] Task one
-   [ ] Task two
-   [x] Completed task

## 14. Complex Nested Elements

> **Note**: This demonstrates nested blockquote with emphasis.
>
> -   List inside quote works
> -   Another item

## 15. Line Breaks

Soft break (double space at end of line)\
Line break with `<br>` tag<br>Another line break

## 16. Unicode and Emoji

| Symbol | Name      |
| :----- | :--- |
| ✅     | Checkmark |
| ❌     | Cross     |
| 🔧     | Wrench    |
| 📝     | Memo      |

## 17. Code in Tables

| Language   | Hello World            |
| :------- | :---------- |
| Python     | `print("Hello")`       |
| JavaScript | `console.log("Hello")` |
| Rust       | `println!("Hello")`    |
| Go         | `fmt.Println("Hello")` |

______________________________________________________________________

End of Kitchen Sink Test File

[opencode-doc]: https://opencode.ai/docs/skills
