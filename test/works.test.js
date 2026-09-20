import { test } from 'node:test';
import assert from 'node:assert/strict';
import { groupByCategory, renderWorkCard, renderWorksHTML, CATEGORY_ORDER, GENRES, renderGenreCard } from '../works.js';

const sampleWorks = [
  { id: 'a', title: 'A', description: 'desc-a', category: 'パチンコ・スロット', tags: ['tag1'], url: 'https://example.com/a', status: '公開中' },
  { id: 'b', title: 'B', description: 'desc-b', category: '日常ツール', tags: ['tag2'], url: 'https://example.com/b', status: '公開中' },
  { id: 'c', title: 'C', description: 'desc-c', category: 'パチンコ・スロット', tags: ['tag3'], url: 'https://example.com/c', status: '公開中' },
];

test('groupByCategory はカテゴリごとに作品をまとめる', () => {
  const grouped = groupByCategory(sampleWorks);
  assert.deepEqual(grouped['パチンコ・スロット'].map((w) => w.id), ['a', 'c']);
  assert.deepEqual(grouped['日常ツール'].map((w) => w.id), ['b']);
});

test('renderWorkCard は id へのリンクとタイトル・タグを含む', () => {
  const html = renderWorkCard(sampleWorks[0]);
  assert.match(html, /href="detail\.html\?id=a"/);
  assert.match(html, /A/);
  assert.match(html, /tag1/);
});

test('renderWorksHTML は CATEGORY_ORDER の順にセクションを並べる', () => {
  const html = renderWorksHTML(sampleWorks);
  const scrollIndex = html.indexOf('パチンコ・スロット');
  const toolIndex = html.indexOf('日常ツール');
  assert.ok(scrollIndex >= 0 && toolIndex >= 0);
  assert.ok(scrollIndex < toolIndex, 'CATEGORY_ORDER 通りパチンコ・スロットが先に出るべき');
});

test('renderWorksHTML はデータが無いカテゴリのセクションを出力しない', () => {
  const html = renderWorksHTML(sampleWorks);
  assert.doesNotMatch(html, /シミュレーター</);
});

test('CATEGORY_ORDER は4カテゴリを定義している', () => {
  assert.deepEqual(CATEGORY_ORDER, ['パチンコ・スロット', '収支分析ツール', 'シミュレーター', '日常ツール']);
});

test('GENRES は4ジャンルをCATEGORY_ORDERの順で定義している', () => {
  assert.deepEqual(GENRES.map((g) => g.category), CATEGORY_ORDER);
  for (const genre of GENRES) {
    assert.equal(typeof genre.slug, 'string');
    assert.equal(typeof genre.label, 'string');
    assert.equal(typeof genre.blurb, 'string');
  }
});

test('renderGenreCard はジャンル名・件数・リンク先を含む', () => {
  const genre = { slug: 'pachinko', category: 'パチンコ・スロット', label: 'パチンコ・スロット', blurb: 'ダミー説明' };
  const html = renderGenreCard(genre, sampleWorks);
  assert.match(html, /href="works\.html\?genre=pachinko"/);
  assert.match(html, /パチンコ・スロット/);
  assert.match(html, />2件</);
});
