import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const { _isSeparatorLine, _fixFileInContent, _isSeparatorAlreadyCorrect, _buildAlignedSeparator } = await import('../references/fix-tables.js');

describe('_isSeparatorLine', () => {
  it('detects separator lines', () => {
    assert.strictEqual(_isSeparatorLine('|---|---|'), true);
    assert.strictEqual(_isSeparatorLine('| :--- | :--- |'), true);
    assert.strictEqual(_isSeparatorLine('|-----:|---:'), true);
  });

  it('rejects non-separator lines', () => {
    assert.strictEqual(_isSeparatorLine('| a | b |'), false);
    assert.strictEqual(_isSeparatorLine('no pipes here'), false);
  });
});

describe('_fixFileInContent', () => {
  it('fixes basic separator', () => {
    const content = '| Name | Age |\n|------|-----|\n| Alice | 25 |\n';
    const { content: result, changed } = _fixFileInContent(content);
    assert.strictEqual(changed, 1);
    assert.ok(result.includes('| :--- | :--- |'));
  });

  it('fixes old-style long dashes', () => {
    const content = '| Name | Age |\n|------|-----|\n';
    const { content: result, changed } = _fixFileInContent(content);
    assert.strictEqual(changed, 1);
  });

  it('skips already-correct separators', () => {
    const content = '| Name | Age |\n| :--- | :--- |\n';
    const { changed } = _fixFileInContent(content);
    assert.strictEqual(changed, 0);
  });

  it('handles alignment', () => {
    const content = '| Left | Center | Right |\n|:----:|-------:|------|\n';
    const { content: result, changed } = _fixFileInContent(content);
    assert.strictEqual(changed, 1);
    assert.ok(result.includes(':---:'));
    assert.ok(result.includes('---:'));
  });

  it('aligns pipes with header columns', () => {
    const content = '| Name  | Age |\n| ----- | --- |\n';
    const { content: result, changed } = _fixFileInContent(content);
    assert.strictEqual(changed, 1);
    const lines = result.split('\n');
    assert.strictEqual(lines[0].length, lines[1].length);
  });

  it('handles empty cells', () => {
    const content = '| A | B | C |\n|---|---|---|\n| x | | z |\n';
    const { content: result, changed } = _fixFileInContent(content);
    assert.strictEqual(changed, 1);
    assert.ok(result.includes('| :--- | :--- | :--- |'));
  });

  it('handles multiple tables', () => {
    const content = '| T1 | T1 |\n|---|---|\n| a | b |\n\n| T2 |\n|---|\n| c |\n';
    const { content: result, changed } = _fixFileInContent(content);
    assert.strictEqual(changed, 2);
    assert.ok(result.includes('| :--- | :--- |'));
    assert.ok(result.includes('| :--- |'));
  });

  it('preserves cell content', () => {
    const content = '| **bold** | `code` | [link](url) |\n|----------|--------|----------|\n| text    | more   | data     |\n';
    const { content: result, changed } = _fixFileInContent(content);
    assert.strictEqual(changed, 1);
    assert.ok(result.includes('**bold**'));
    assert.ok(result.includes('`code`'));
    assert.ok(result.includes('[link](url)'));
  });

  it('handles trailing pipes', () => {
    const content = '| A | B |\n|----|----|\n| x | y |\n';
    const { content: result } = _fixFileInContent(content);
    assert.ok(result.includes('|'));
  });

  it('handles many columns', () => {
    const content = '| A | B | C | D | E |\n|----|----|----|----|----|\n| 1 | 2 | 3 | 4 | 5 |\n';
    const { changed } = _fixFileInContent(content);
    assert.strictEqual(changed, 1);
  });
});

describe('_isSeparatorAlreadyCorrect', () => {
  it('accepts exact :---', () => {
    assert.strictEqual(_isSeparatorAlreadyCorrect([' :--- ']), true);
  });

  it('accepts exact ---:', () => {
    assert.strictEqual(_isSeparatorAlreadyCorrect([' ---: ']), true);
  });

  it('accepts exact :---:', () => {
    assert.strictEqual(_isSeparatorAlreadyCorrect([' :---: ']), true);
  });

  it('accepts variable width left-aligned', () => {
    assert.strictEqual(_isSeparatorAlreadyCorrect([' :--- ']), true);
    assert.strictEqual(_isSeparatorAlreadyCorrect([' :----- ']), true);
  });

  it('accepts variable width right-aligned', () => {
    assert.strictEqual(_isSeparatorAlreadyCorrect([' ---: ']), true);
    assert.strictEqual(_isSeparatorAlreadyCorrect([' ----: ']), true);
  });

  it('accepts variable width center-aligned', () => {
    assert.strictEqual(_isSeparatorAlreadyCorrect([' :--: ']), false);
    assert.strictEqual(_isSeparatorAlreadyCorrect([' :---: ']), true);
    assert.strictEqual(_isSeparatorAlreadyCorrect([' :----: ']), true);
  });

  it('rejects plain dashes (no colons)', () => {
    assert.strictEqual(_isSeparatorAlreadyCorrect([' --- ']), false);
  });

  it('rejects too short', () => {
    assert.strictEqual(_isSeparatorAlreadyCorrect([' -- ']), false);
  });
});

describe('_buildAlignedSeparator', () => {
  it('basic table', () => {
    const result = _buildAlignedSeparator('| Name | Age |', '|------|-----|\n');
    assert.ok(result.includes(':---'));
  });

  it('preserves right alignment', () => {
    const result = _buildAlignedSeparator('| Name | Age |', '|------:-----:\n');
    assert.ok(result.includes('---:'));
  });

  it('preserves center alignment', () => {
    const result = _buildAlignedSeparator('| Name | Age |', '|:----:|-----:|\n');
    assert.ok(result.includes(':---:'));
  });

  it('uses VSCode formula (stringWidth - 1)', () => {
    const result = _buildAlignedSeparator('| Name |', '|-----|\n');
    assert.ok(result.length >= 8);
  });

  it('longer header = more dashes', () => {
    const short = _buildAlignedSeparator('| A |', '|---|\n');
    const long = _buildAlignedSeparator('| Longer |', '|---|\n');
    assert.ok(long.length > short.length);
  });

  it('minimum 3 dashes', () => {
    const result = _buildAlignedSeparator('| A |', '|---|\n');
    assert.ok(result.includes(':---'));
  });

  it('multiple cells', () => {
    const result = _buildAlignedSeparator('| A | B | C |', '|---|---|---|\n');
    const parts = result.split('|');
    assert.strictEqual(parts.length, 5);
  });
});

describe('string-width handling', () => {
  it('handles emoji (double-width)', () => {
    const result = _buildAlignedSeparator('| 😀 |', '|---|\n');
    assert.ok(result.includes(':---'));
  });

  it('handles CJK (double-width)', () => {
    const result = _buildAlignedSeparator('| 中文 |', '|---|\n');
    assert.ok(result.includes(':---'));
  });
});