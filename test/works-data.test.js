import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const works = JSON.parse(readFileSync(new URL('../data/works.json', import.meta.url)));

test('works.json には26件のデータがある', () => {
  assert.equal(works.length, 26);
});

test('全件が id, title, description, category, tags, url, status を持つ', () => {
  const requiredFields = ['id', 'title', 'description', 'category', 'tags', 'url', 'status'];
  for (const work of works) {
    for (const field of requiredFields) {
      assert.ok(field in work, `${work.id ?? '(id不明)'} に ${field} が無い`);
    }
  }
});

test('id は重複しない', () => {
  const ids = works.map((w) => w.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('category は3種類のいずれか', () => {
  const validCategories = ['パチンコ・スロット', 'シミュレーター', '日常ツール'];
  for (const work of works) {
    assert.ok(validCategories.includes(work.category), `${work.id} の category が不正: ${work.category}`);
  }
});
