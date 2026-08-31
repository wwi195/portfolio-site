import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findWorkById, renderDetailHTML } from '../detail.js';

const sampleWorks = [
  { id: 'a', title: 'A', description: 'desc-a', category: 'パチンコ・スロット', tags: ['tag1'], url: 'https://example.com/a', status: '公開中' },
  { id: 'b', title: 'B', description: 'desc-b', category: '日常ツール', tags: ['tag2'], url: 'https://example.com/b', status: '公開中' },
];

test('findWorkById は一致する id の作品を返す', () => {
  const work = findWorkById(sampleWorks, 'b');
  assert.equal(work.title, 'B');
});

test('findWorkById は一致しない場合 null を返す', () => {
  assert.equal(findWorkById(sampleWorks, 'not-exist'), null);
});

test('renderDetailHTML は作品情報を含むHTMLを返す', () => {
  const html = renderDetailHTML(sampleWorks[0]);
  assert.match(html, /A/);
  assert.match(html, /desc-a/);
  assert.match(html, /パチンコ・スロット/);
  assert.match(html, /href="https:\/\/example\.com\/a"/);
  assert.match(html, /tag1/);
});

test('renderDetailHTML は work が null のとき見つからないメッセージを返す', () => {
  const html = renderDetailHTML(null);
  assert.match(html, /見つかりません/);
});
