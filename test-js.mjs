import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const { _isSeparatorLine, _fixFileInContent } = await import('./references/fix-tables.js');

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
});