import { test } from 'node:test';
import assert from 'node:assert/strict';
import { groupByCategory, renderWorkCard, CATEGORY_ORDER, GENRES, renderGenreCard, renderGenreListHTML, renderGenreWorksHTML } from '../works.js';

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

test('renderGenreListHTML はGENRESの順に4枚のジャンルカードを出力する', () => {
  const html = renderGenreListHTML(sampleWorks, GENRES);
  const pachinkoIndex = html.indexOf('パチンコ・スロット');
  const dailytoolIndex = html.indexOf('日常ツール');
  assert.ok(pachinkoIndex >= 0 && dailytoolIndex >= 0);
  assert.ok(pachinkoIndex < dailytoolIndex, 'GENRES通りパチンコ・スロットが先に出るべき');
  const cardCount = (html.match(/class="genre-card"/g) ?? []).length;
  assert.equal(cardCount, 4);
});

test('renderGenreWorksHTML は該当ジャンルの作品のみを含むグリッドを返す', () => {
  const genres = [
    { slug: 'pachinko', category: 'パチンコ・スロット', label: 'パチンコ・スロット', blurb: 'ダミー' },
    { slug: 'dailytool', category: '日常ツール', label: '日常ツール', blurb: 'ダミー' },
  ];
  const html = renderGenreWorksHTML('pachinko', sampleWorks, genres);
  assert.match(html, /パチンコ・スロット/);
  assert.match(html, /href="detail\.html\?id=a"/);
  assert.match(html, /href="detail\.html\?id=c"/);
  assert.doesNotMatch(html, /href="detail\.html\?id=b"/);
  assert.match(html, /href="works\.html">/);
});

test('renderGenreWorksHTML は存在しないジャンルに対してnullを返す', () => {
  const genres = [
    { slug: 'pachinko', category: 'パチンコ・スロット', label: 'パチンコ・スロット', blurb: 'ダミー' },
  ];
  assert.equal(renderGenreWorksHTML('not-exist', sampleWorks, genres), null);
});
