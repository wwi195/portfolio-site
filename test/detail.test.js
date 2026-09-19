import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findWorkById, renderDetailHTML, renderTabsHTML } from '../detail.js';

const sampleDetails = { background: '背景テキスト', commitment: 'こだわりテキスト', fun: '楽しみ方テキスト' };

const sampleWorks = [
  { id: 'a', title: 'A', description: 'desc-a', category: 'パチンコ・スロット', tags: ['tag1'], url: 'https://example.com/a', status: '公開中', details: sampleDetails },
  { id: 'b', title: 'B', description: 'desc-b', category: '日常ツール', tags: ['tag2'], url: 'https://example.com/b', status: '公開中', details: sampleDetails },
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

test('renderDetailHTML は details があるときタブを含む', () => {
  const html = renderDetailHTML(sampleWorks[0]);
  assert.match(html, /work-tabs/);
  assert.match(html, /背景テキスト/);
  assert.match(html, /こだわりテキスト/);
  assert.match(html, /楽しみ方テキスト/);
});

test('renderDetailHTML は details が無いときタブを含まない', () => {
  const workWithoutDetails = { ...sampleWorks[0], details: undefined };
  const html = renderDetailHTML(workWithoutDetails);
  assert.doesNotMatch(html, /work-tabs/);
});

test('renderTabsHTML は3つのタブボタンと3つのパネルを含む', () => {
  const html = renderTabsHTML(sampleDetails);
  const buttonMatches = html.match(/class="tab-btn/g) ?? [];
  const panelMatches = html.match(/data-tab-panel=/g) ?? [];
  assert.equal(buttonMatches.length, 3);
  assert.equal(panelMatches.length, 3);
});

test('renderTabsHTML は制作背景を初期アクティブにする', () => {
  const html = renderTabsHTML(sampleDetails);
  assert.match(html, /id="tab-background"[^>]*class="tab-btn active"|class="tab-btn active"[^>]*id="tab-background"/);
});
