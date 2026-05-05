#!/usr/bin/env node
/**
 * pad-tables.js — Pad table data rows so pipes align with header columns.
 *
 * MD060 requires every `|` in every row to align with the column boundaries
 * set by the header. This script pads cell content so pipes line up.
 *
 * Run AFTER fix-tables.js in the pipeline:
 *   fix-tables.js → pad-tables.js → markdownlint
 *
 * Usage:
 *   node references/pad-tables.js <file>          Fix a file
 *   node references/pad-tables.js --check <file>  Read-only check
 *   node references/pad-tables.js --all <dir>      Fix all .md in directory
 */

"use strict";

const fs = require("fs");
const path = require("path");

// Use installed string-width for visual width (emoji/CJK = 2 chars)
// Handle ESM interop: pnpm returns { __esModule, default } for ESM packages
let stringWidth;
try {
    const m = require("string-width");
    stringWidth = m.default ?? m;
} catch {
    // Fallback: counts code units (wrong for emoji/CJK, but safe)
    stringWidth = s => [...s].length;
}

// ── Parsing helpers ───────────────────────────────────────────────────────────

/**
 * Parse a table row line into an array of { raw, width } objects.
 * Strips leading/trailing pipes and whitespace.
 */
function parseTableRow(line) {
    const stripped = line.replace(/^\s*\|\s*/, "").replace(/\s*\|\s*$/, "");
    if (!stripped) return null;
    return stripped.split(/\s*\|\s*/).map(cell => ({
        raw: cell,
        width: stringWidth(cell),
    }));
}

/**
 * Read alignment from a separator row cell.
 * e.g. ":---" → "left", ":---:" → "center", "---:" → "right"
 */
function parseAlignments(separatorLine) {
    const cells = parseTableRow(separatorLine);
    if (!cells) return [];
    return cells.map(cell => {
        const inner = cell.raw.trim();
        if (/^:-+:$/.test(inner)) return "center";
        if (/:$/.test(inner)) return "right";
        return "left";
    });
}

// ── Column width computation ───────────────────────────────────────────────────

/**
 * Compute the display width for each column by scanning the header and all data rows.
 */
function computeColWidths(lines, headerLine, dataStart, end) {
    if (headerLine < 0) return [];
    const headerCells = parseTableRow(lines[headerLine]);
    if (!headerCells) return [];

    const widths = headerCells.map(c => c.width);

    for (let i = dataStart; i <= end; i++) {
        const row = parseTableRow(lines[i]);
        if (!row) continue;
        for (let j = 0; j < row.length && j < widths.length; j++) {
            widths[j] = Math.max(widths[j], row[j].width);
        }
    }

    return widths;
}

// ── Row building ──────────────────────────────────────────────────────────────

/**
 * Build a GFM separator row for given column widths and alignments.
 *
 * For left-aligned: `: ` + dashes where `: ` + dashes has visual width = w.
 * Since `: ` is 2 chars wide, dashes = w - 2 (min 3 for `:---`).
 */
function buildSeparator(colWidths, alignments) {
    return (
        "| " +
        colWidths
            .map((w, i) => {
                const align = alignments[i] || "left";
                if (align === "right") {
                    return "-".repeat(w) + ": |";
                }
                if (align === "center") {
                    const dashes = "-".repeat(Math.max(1, w - 2));
                    return ":" + dashes + ": |";
                }
                // left: ": " + dashes, total width = w
                return ": " + "-".repeat(Math.max(3, w - 2)) + " |";
            })
            .join(" ")
    );
}

/**
 * Rebuild a row with cells padded to match colWidths.
 */
function formatRow(cells, colWidths) {
    const parts = cells.map((cell, i) => {
        const w = colWidths[i] || stringWidth(cell);
        return cell.trim().padEnd(w);
    });
    return "| " + parts.join(" | ") + " |";
}

// ── Table finding ─────────────────────────────────────────────────────────────

/**
 * Find all tables in a file. Returns { lines, tables }.
 * Each table: { start, end, headerLine, dataStart }
 */
function findTables(content) {
    const lines = content.split("\n");
    const tables = [];
    let inTable = false;
    let tableStart = -1;
    let headerLine = -1;
    let dataStart = -1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const isTableLine = /^\|/.test(line.trim()) && line.trim() !== "|";

        if (isTableLine) {
            if (!inTable) {
                inTable = true;
                tableStart = i;
            }
            if (/^\|[\s:|-]+\|$/.test(line.trim())) {
                if (headerLine >= 0) {
                    dataStart = i + 1;
                }
            } else if (headerLine < 0) {
                headerLine = i;
            }
        } else if (inTable) {
            tables.push({ start: tableStart, end: i - 1, headerLine, dataStart });
            inTable = false;
            tableStart = -1;
            headerLine = -1;
            dataStart = -1;
        }
    }

    if (inTable) {
        tables.push({ start: tableStart, end: lines.length - 1, headerLine, dataStart });
    }

    return { lines, tables };
}

// ── Main processing ───────────────────────────────────────────────────────────

/**
 * Pad a single table in-place. Returns the new content string or null if no changes.
 */
function padTable(lines, table) {
    const { start, end, headerLine, dataStart } = table;
    if (headerLine < 0 || dataStart < 0) return null;

    const colWidths = computeColWidths(lines, headerLine, dataStart, end);
    if (colWidths.length === 0) return null;

    const alignments = parseAlignments(lines[dataStart - 1]);

    let changed = false;
    const newLines = [...lines];

    // Rebuild separator row to match column widths
    const newSeparator = buildSeparator(colWidths, alignments);
    if (newSeparator !== lines[dataStart - 1]) {
        newLines[dataStart - 1] = newSeparator;
        changed = true;
    }

    // Rebuild header (pad cells to max width)
    const headerCells = parseTableRow(lines[headerLine]);
    if (headerCells) {
        const padded = headerCells.map((c, i) => c.raw.trim().padEnd(colWidths[i]));
        const newHeader = "| " + padded.join(" | ") + " |";
        if (newHeader !== lines[headerLine]) {
            newLines[headerLine] = newHeader;
            changed = true;
        }
    }

    // Rebuild data rows
    for (let i = dataStart; i <= end; i++) {
        const row = parseTableRow(lines[i]);
        if (!row) continue;
        const newRow = formatRow(row.map(c => c.raw), colWidths);
        if (newRow !== lines[i]) {
            newLines[i] = newRow;
            changed = true;
        }
    }

    return changed ? newLines.join("\n") : null;
}

/**
 * Check if a file needs padding (any cell is narrower than its column max).
 */
function needsPadding(lines, tables) {
    for (const table of tables) {
        const colWidths = computeColWidths(lines, table.headerLine, table.dataStart, table.end);
        if (colWidths.length === 0) continue;
        for (let i = table.headerLine; i <= table.end; i++) {
            const row = parseTableRow(lines[i]);
            if (!row) continue;
            for (let j = 0; j < row.length; j++) {
                if (row[j].width < colWidths[j]) return true;
            }
        }
    }
    return false;
}

/**
 * Process a single file. Returns number of tables padded.
 */
function processFile(filePath, dryRun = false) {
    if (!filePath || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        return 0;
    }

    const content = fs.readFileSync(filePath, "utf8");
    const { lines, tables } = findTables(content);

    if (tables.length === 0) return 0;
    if (!needsPadding(lines, tables)) return 0;

    if (dryRun) {
        console.log(`Would pad table(s) in ${filePath}`);
        return 1;
    }

    let current = content;
    let totalFixed = 0;
    for (const table of tables) {
        const result = padTable(current.split("\n"), table);
        if (result) {
            current = result;
            totalFixed++;
        }
    }

    if (totalFixed > 0) {
        fs.writeFileSync(filePath, current, "utf8");
    }

    return totalFixed;
}

// ── CLI ──────────────────────────────────────────────────────────────────────

function usage() {
    console.error("Usage: node pad-tables.js <file> [--check]");
    console.error("       node pad-tables.js --all <directory>");
    process.exit(1);
}

function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) usage();

    let dryRun = false;
    let allDir = null;
    const files = [];

    for (let i = 0; i < args.length; i++) {
        if (args[i] === "--check") {
            dryRun = true;
        } else if (args[i] === "--all") {
            allDir = args[++i];
            if (!allDir) usage();
        } else if (!args[i].startsWith("-")) {
            files.push(args[i]);
        }
    }

    if (allDir) {
        const matches = findMdFiles(allDir);
        files.push(...matches);
    }

    if (files.length === 0 && !dryRun) usage();

    let total = 0;
    for (const f of files) {
        if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) continue;
        total += processFile(f, dryRun);
    }

    if (dryRun) {
        process.exit(total > 0 ? 1 : 0);
    }

    if (total === 0) {
        console.log("No table padding needed.");
    } else {
        console.log(`Padded ${total} table(s) in ${files.length} file(s).`);
    }
}

// Find all .md files recursively, excluding node_modules
function findMdFiles(dir) {
    const files = [];
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return files;
    function walk(subdir) {
        for (const entry of fs.readdirSync(subdir, { withFileTypes: true })) {
            const full = path.join(subdir, entry.name);
            if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
                walk(full);
            } else if (entry.isFile() && entry.name.endsWith(".md")) {
                files.push(full);
            }
        }
    }
    walk(dir);
    return files;
}

if (require.main === module) {
    main();
}

module.exports = { processFile, findTables, computeColWidths, buildSeparator, formatRow };
