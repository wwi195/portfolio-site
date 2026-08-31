# ポートフォリオサイト Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 素のHTML/CSS/JSで5ページ構成（Home / Works / 作品詳細 / About / Contact）のポートフォリオサイトを構築し、公開済み16作品を一覧・詳細表示できるようにする。

**Architecture:** ビルドツールなしの静的サイト。共通デザインは `style.css` 1枚に集約し、ナビゲーションは各ページに直書き（5ページのみのためテンプレートエンジン不要）。作品データは `data/works.json` に集約し、`works.js`（一覧のグルーピング・カード描画）と `detail.js`（`?id=` によるルックアップ・描画）は DOM 操作から分離した純粋関数として実装し、Node組み込みのテストランナーで単体テストする。

**Tech Stack:** HTML5 / CSS3 / Vanilla JavaScript（ES Modules）。Node.js組み込み `node --test` でロジック部分のみ単体テスト。外部依存・npmパッケージなし。

**参照仕様書:** `docs/superpowers/specs/2026-07-29-portfolio-site-design.md`

---

## File Structure

```
portfolio-site/
├── package.json          # "type": "module" 指定 + testスクリプト
├── index.html             # Home
├── works.html             # 作品一覧
├── detail.html            # 作品詳細（?id=xxx）
├── about.html
├── contact.html
├── style.css              # 全ページ共通スタイル
├── data/
│   └── works.json         # 作品データ（16件）
├── works.js                # works.html 用ロジック（グルーピング・カード描画・DOM描画）
├── detail.js                # detail.html 用ロジック（ID検索・詳細描画・DOM描画）
└── test/
    ├── works.test.js
    └── detail.test.js
```

---

### Task 1: プロジェクトの初期セットアップ

**Files:**
- Create: `package.json`

- [ ] **Step 1: package.json を作成する**

```json
{
  "name": "portfolio-site",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test"
  }
}
```

- [ ] **Step 2: Node のテストランナーが動くことを確認する**

Run: `node --test`
Expected: `test/` にまだファイルが無いため `tests 0` で正常終了する（エラーにならないこと）

- [ ] **Step 3: コミット**

このタスクではgitは未初期化のためコミット操作はスキップする（ユーザーからの指示により、git管理は後日行う）。

---

### Task 2: 共通スタイルシート（style.css）

**Files:**
- Create: `style.css`

配色はブレストで確定した「C. Dark Neutral」案（ダーク基調＋ミント系アクセント）。もらったたたき台の構造（`.hero`, `.lamp-panel` など）は維持し、色トークンのみ差し替える。加えてナビゲーション・作品一覧カード・詳細ページ・Aboutページ・お問い合わせフォーム用のスタイルを追加する。

- [ ] **Step 1: style.css を作成する**

```css
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Noto+Sans+JP:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg: #161a20;
  --surface: #1c212a;
  --surface-line: #2a3540;
  --text: #e8e6de;
  --muted: #8b90a3;
  --accent: #7fe0c4;
  --accent-dim: #2a4a40;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Noto Sans JP', sans-serif;
  line-height: 1.7;
}

a {
  color: inherit;
}

/* --- Navigation --- */
.site-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 8vw;
  border-bottom: 1px solid var(--surface-line);
}

.nav-logo {
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  color: var(--text);
  text-decoration: none;
  font-size: 15px;
}

.nav-links {
  display: flex;
  gap: 28px;
}

.nav-link {
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  color: var(--muted);
  text-decoration: none;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.nav-link:hover {
  color: var(--text);
}

.nav-link.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

@media (max-width: 640px) {
  .site-nav {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  .nav-links {
    gap: 20px;
    flex-wrap: wrap;
  }
}

/* --- Hero (Home) --- */
.hero {
  min-height: 80vh;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: 48px;
  padding: 64px 8vw;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(600px 400px at 85% 20%, rgba(127, 224, 196, 0.08), transparent 70%);
  pointer-events: none;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  letter-spacing: 0.08em;
  color: var(--accent);
  margin-bottom: 28px;
}

.eyebrow .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px 2px rgba(127, 224, 196, 0.6);
  animation: blink 1.8s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
}

h1 {
  font-family: 'Sora', 'Noto Sans JP', sans-serif;
  font-weight: 700;
  font-size: clamp(32px, 4.2vw, 56px);
  line-height: 1.35;
  letter-spacing: -0.01em;
  margin-bottom: 24px;
}

h1 .accent {
  color: var(--accent);
}

.sub {
  font-size: 16px;
  color: var(--muted);
  max-width: 42ch;
  margin-bottom: 40px;
}

.cta-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.btn {
  font-family: 'Sora', sans-serif;
  font-weight: 600;
  font-size: 14px;
  padding: 14px 28px;
  border-radius: 4px;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  display: inline-block;
}

.btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.btn-primary {
  background: var(--accent);
  color: #06231b;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(127, 224, 196, 0.25);
}

.btn-ghost {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--surface-line);
}

.btn-ghost:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* --- Lamp panel (RECENT BUILDS widget) --- */
.lamp-panel {
  background: var(--surface);
  border: 1px solid var(--surface-line);
  border-radius: 8px;
  padding: 28px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
}

.lamp-panel-header {
  display: flex;
  justify-content: space-between;
  color: var(--muted);
  margin-bottom: 20px;
  letter-spacing: 0.04em;
}

.lamp-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid var(--surface-line);
  text-decoration: none;
  color: inherit;
}

.lamp-row:last-child {
  border-bottom: none;
}

.lamp-led {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent-dim);
  flex-shrink: 0;
}

.lamp-led.on {
  background: var(--accent);
  box-shadow: 0 0 10px 2px rgba(127, 224, 196, 0.55);
  animation: blink 2.4s ease-in-out infinite;
}

.lamp-row:nth-child(2) .lamp-led.on { animation-delay: 0.3s; }
.lamp-row:nth-child(3) .lamp-led.on { animation-delay: 0.9s; }

.lamp-label {
  color: var(--text);
}

.lamp-meta {
  margin-left: auto;
  color: var(--muted);
}

.lamp-row:hover {
  background: var(--surface-line);
}

.lamp-row:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 4px;
}

.lamp-arrow {
  color: var(--muted);
  font-family: 'JetBrains Mono', monospace;
  margin-left: 4px;
}

@media (max-width: 860px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 48px 6vw;
  }
}

@media (prefers-reduced-motion: reduce) {
  .eyebrow .dot, .lamp-led.on {
    animation: none;
  }
}

/* --- Generic page container (Works / Detail / About / Contact) --- */
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 64px 8vw 96px;
}

.page h1 {
  font-family: 'Sora', 'Noto Sans JP', sans-serif;
  font-weight: 700;
  font-size: clamp(28px, 3.5vw, 40px);
  margin-bottom: 12px;
}

.page-lede {
  color: var(--muted);
  max-width: 60ch;
  margin-bottom: 48px;
}

/* --- Works grid --- */
.work-category {
  margin-bottom: 56px;
}

.work-category h2 {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  letter-spacing: 0.08em;
  color: var(--accent);
  text-transform: uppercase;
  margin-bottom: 20px;
}

.work-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.work-card {
  display: block;
  background: var(--surface);
  border: 1px solid var(--surface-line);
  border-radius: 8px;
  padding: 20px;
  text-decoration: none;
  color: var(--text);
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.work-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
}

.work-card h3 {
  font-family: 'Sora', sans-serif;
  font-size: 16px;
  margin-bottom: 8px;
}

.work-card p {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 14px;
}

.work-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--muted);
  border: 1px solid var(--surface-line);
  border-radius: 20px;
  padding: 3px 10px;
}

/* --- Detail page --- */
.detail-page .work-category-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 16px;
}

.detail-page p.description {
  color: var(--muted);
  max-width: 60ch;
  margin-bottom: 20px;
}

.work-status {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  margin-bottom: 24px;
}

/* --- About page --- */
.about-section {
  margin-bottom: 48px;
}

.about-section h2 {
  font-family: 'Sora', sans-serif;
  font-size: 18px;
  margin-bottom: 12px;
  color: var(--accent);
}

.skill-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* --- Contact form --- */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 480px;
}

.form-field label {
  display: block;
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 8px;
}

.form-field input,
.form-field textarea {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--surface-line);
  border-radius: 4px;
  padding: 12px 14px;
  color: var(--text);
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 14px;
}

.form-field textarea {
  min-height: 140px;
  resize: vertical;
}

.form-field input:focus,
.form-field textarea:focus {
  outline: none;
  border-color: var(--accent);
}
```

- [ ] **Step 2: コミット**

gitは未初期化のためスキップ（Task 1と同様）。

---

### Task 3: 作品データ（data/works.json）

**Files:**
- Create: `data/works.json`
- Test: `test/works-data.test.js`

- [ ] **Step 1: 失敗するテストを書く**

```js
// test/works-data.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const works = JSON.parse(readFileSync(new URL('../data/works.json', import.meta.url)));

test('works.json には16件のデータがある', () => {
  assert.equal(works.length, 16);
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
```

- [ ] **Step 2: テストを実行し、失敗することを確認する**

Run: `node --test`
Expected: `data/works.json` が存在しないため `ENOENT` エラーで失敗する

- [ ] **Step 3: data/works.json を作成する**

```json
[
  {
    "id": "ghoul",
    "title": "東京喰種 パチンコシミュレーター",
    "description": "「東京喰種」をテーマにしたパチンコの疑似遊技シミュレーター。",
    "category": "パチンコ・スロット",
    "tags": ["個人開発", "確率シミュレーション"],
    "url": "https://wwi195.github.io/pachinko-simulator-ghoul/",
    "status": "公開中"
  },
  {
    "id": "ghouldeka",
    "title": "e 東京喰種 超デカ超一撃ver. シミュレーター",
    "description": "「東京喰種」デカ台バージョンの疑似遊技シミュレーター。",
    "category": "パチンコ・スロット",
    "tags": ["個人開発", "確率シミュレーション"],
    "url": "https://wwi195.github.io/pachinko-simulator-ghouldeka/",
    "status": "公開中"
  },
  {
    "id": "ghouldeka-analysis",
    "title": "e 東京喰種 超デカ超一撃ver. 長期収支分析ツール",
    "description": "グールデカ台の長期的な収支・出玉傾向を検証する分析ツール。",
    "category": "パチンコ・スロット",
    "tags": ["個人開発", "収支分析"],
    "url": "https://wwi195.github.io/pachinko-simulator-ghouldeka-analysis/",
    "status": "公開中"
  },
  {
    "id": "kinniku",
    "title": "キン肉マン パチンコシミュレーター",
    "description": "「キン肉マン」をテーマにしたパチンコの疑似遊技シミュレーター。",
    "category": "パチンコ・スロット",
    "tags": ["個人開発", "確率シミュレーション"],
    "url": "https://wwi195.github.io/pachinko-simulator-kinniku/",
    "status": "公開中"
  },
  {
    "id": "lycoris",
    "title": "リコリス・リコイル パチンコシミュレーター",
    "description": "「リコリス・リコイル」をテーマにしたパチンコの疑似遊技シミュレーター。",
    "category": "パチンコ・スロット",
    "tags": ["個人開発", "確率シミュレーション"],
    "url": "https://wwi195.github.io/pachinko-simulator-lycoris/",
    "status": "公開中"
  },
  {
    "id": "garo7500",
    "title": "牙狼7500 シミュレーター",
    "description": "「牙狼7500」をテーマにしたパチンコの疑似遊技シミュレーター。",
    "category": "パチンコ・スロット",
    "tags": ["個人開発", "確率シミュレーション"],
    "url": "https://wwi195.github.io/garo7500/",
    "status": "公開中"
  },
  {
    "id": "okidoki",
    "title": "沖ドキ シミュレーター",
    "description": "沖ドキシリーズをテーマにしたスロットの疑似遊技シミュレーター。",
    "category": "パチンコ・スロット",
    "tags": ["個人開発", "確率シミュレーション"],
    "url": "https://wwi195.github.io/okidoki-simulator/",
    "status": "公開中"
  },
  {
    "id": "juggler",
    "title": "ジャグラー シミュレーター",
    "description": "ジャグラーシリーズをテーマにしたスロットの疑似遊技シミュレーター。",
    "category": "パチンコ・スロット",
    "tags": ["個人開発", "確率シミュレーション"],
    "url": "https://wwi195.github.io/juggler-simulator/juggler-simulator.html",
    "status": "公開中"
  },
  {
    "id": "milliongod",
    "title": "GODガイアステージ シミュレーター",
    "description": "スマスロミリオンゴッドのガイアステージをテーマにしたスロットの疑似遊戯シミュレーター。",
    "category": "パチンコ・スロット",
    "tags": ["個人開発", "確率シミュレーション"],
    "url": "https://wwi195.github.io/million-god-simulator/",
    "status": "公開中"
  },
  {
    "id": "keiba-jockey",
    "title": "G1単勝購入シミュレーター",
    "description": "競馬G1レースの単勝購入戦略を検証するシミュレーター。",
    "category": "シミュレーター",
    "tags": ["個人開発", "データ分析"],
    "url": "https://wwi195.github.io/keiba-jockey-simulator/",
    "status": "公開中"
  },
  {
    "id": "diet-psychology",
    "title": "ダイエット心理シミュレーター",
    "description": "ダイエットにまつわる心理傾向を検証するシミュレーター。",
    "category": "シミュレーター",
    "tags": ["個人開発", "行動心理"],
    "url": "https://wwi195.github.io/diet-psychology-simulator/",
    "status": "公開中"
  },
  {
    "id": "umaren-takarakuji",
    "title": "馬連 vs 宝くじ 比較シミュレーター",
    "description": "馬連と宝くじ、期待値やお得度を比較するシミュレーター。",
    "category": "シミュレーター",
    "tags": ["個人開発", "データ分析"],
    "url": "https://wwi195.github.io/takarakuji-payout-simulator/webapp/",
    "status": "開発中"
  },
  {
    "id": "birthday-keiba",
    "title": "誕生日馬券シミュレーター",
    "description": "あなたの誕生日から導き出した馬番で、ワイド・馬連を買い続けていたらどうなったかを計算するシミュレーター。",
    "category": "シミュレーター",
    "tags": ["個人開発", "データ分析"],
    "url": "https://wwi195.github.io/keiba-jockey-simulator2/",
    "status": "公開中"
  },
  {
    "id": "health-calendar",
    "title": "ヘルスカレンダー",
    "description": "日々の体調や生活習慣を記録・可視化するカレンダーアプリ。",
    "category": "日常ツール",
    "tags": ["個人開発", "記録・可視化"],
    "url": "https://wwi195.github.io/health-calendar/",
    "status": "公開中"
  },
  {
    "id": "conbini-tracker",
    "title": "コンビニ割高トラッカー",
    "description": "コンビニ商品の価格が他店よりどれだけ割高かを追跡するツール。",
    "category": "日常ツール",
    "tags": ["個人開発", "価格比較"],
    "url": "https://wwi195.github.io/conbini-tracker/",
    "status": "公開中"
  },
  {
    "id": "price-comparator",
    "title": "単価比較ツール",
    "description": "商品の内容量と価格から単価を算出し比較するツール。",
    "category": "日常ツール",
    "tags": ["個人開発", "価格比較"],
    "url": "https://wwi195.github.io/price-comparator/",
    "status": "公開中"
  }
]
```

- [ ] **Step 4: テストを実行し、成功することを確認する**

Run: `node --test`
Expected: `test/works-data.test.js` の4テストがすべて PASS

- [ ] **Step 5: コミット**

gitは未初期化のためスキップ。

---

### Task 4: 作品一覧のロジック（works.js）— TDD

**Files:**
- Create: `works.js`
- Test: `test/works.test.js`

`works.js` はDOM操作部分と、テスト可能な純粋関数（`groupByCategory`, `renderWorkCard`, `renderWorksHTML`）を分離する。

- [ ] **Step 1: 失敗するテストを書く**

```js
// test/works.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { groupByCategory, renderWorkCard, renderWorksHTML, CATEGORY_ORDER } from '../works.js';

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

test('CATEGORY_ORDER は3カテゴリを定義している', () => {
  assert.deepEqual(CATEGORY_ORDER, ['パチンコ・スロット', 'シミュレーター', '日常ツール']);
});
```

- [ ] **Step 2: テストを実行し、失敗することを確認する**

Run: `node --test`
Expected: `works.js` が存在しないため `ERR_MODULE_NOT_FOUND` で失敗する

- [ ] **Step 3: works.js を実装する**

```js
// works.js
export const CATEGORY_ORDER = ['パチンコ・スロット', 'シミュレーター', '日常ツール'];

export function groupByCategory(works) {
  const grouped = {};
  for (const work of works) {
    if (!grouped[work.category]) {
      grouped[work.category] = [];
    }
    grouped[work.category].push(work);
  }
  return grouped;
}

export function renderWorkCard(work) {
  const tags = work.tags.map((tag) => `<span class="tag">${tag}</span>`).join('');
  return `
    <a class="work-card" href="detail.html?id=${work.id}">
      <h3>${work.title}</h3>
      <p>${work.description}</p>
      <div class="work-tags">${tags}</div>
    </a>
  `;
}

export function renderWorksHTML(works) {
  const grouped = groupByCategory(works);
  return CATEGORY_ORDER.filter((category) => grouped[category])
    .map((category) => `
      <section class="work-category">
        <h2>${category}</h2>
        <div class="work-grid">${grouped[category].map(renderWorkCard).join('')}</div>
      </section>
    `)
    .join('');
}

async function init() {
  const container = document.getElementById('works-container');
  if (!container) return;
  try {
    const res = await fetch('data/works.json');
    const works = await res.json();
    container.innerHTML = renderWorksHTML(works);
  } catch (err) {
    container.innerHTML = '<p class="page-lede">作品データの読み込みに失敗しました。</p>';
  }
}

if (typeof document !== 'undefined') {
  init();
}
```

- [ ] **Step 4: テストを実行し、成功することを確認する**

Run: `node --test`
Expected: `test/works.test.js` の5テストがすべて PASS（`test/works-data.test.js` の4テストも引き続きPASS）

- [ ] **Step 5: コミット**

gitは未初期化のためスキップ。

---

### Task 5: 作品一覧ページ（works.html）

**Files:**
- Create: `works.html`

- [ ] **Step 1: works.html を作成する**

```html
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Works | Masato Asano</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<nav class="site-nav">
  <a href="index.html" class="nav-logo">Masato Asano</a>
  <div class="nav-links">
    <a href="index.html" class="nav-link">Home</a>
    <a href="works.html" class="nav-link active">Works</a>
    <a href="about.html" class="nav-link">About</a>
    <a href="contact.html" class="nav-link">Contact</a>
  </div>
</nav>

<main class="page">
  <h1>Works</h1>
  <p class="page-lede">営業の合間にClaude Codeで作った、公開中のツール・シミュレーターです。</p>
  <div id="works-container">読み込み中...</div>
</main>

<script type="module" src="works.js"></script>
</body>
</html>
```

- [ ] **Step 2: ローカルサーバーで動作確認する**

`fetch('data/works.json')` は `file://` では動かないため、ローカルサーバー経由で確認する。

Run: `npx --yes serve .`（またはPythonがあれば `python -m http.server 8000`）
ブラウザで `http://localhost:3000/works.html`（`serve` の場合）または `http://localhost:8000/works.html`（`http.server` の場合）を開く

Expected:
- 「パチンコ・スロット」「シミュレーター」「日常ツール」の3セクションが表示される
- 各カードにタイトル・説明文・タグが表示される
- カードをクリックすると `detail.html?id=xxx` に遷移する（Task 7完了後に確認）

- [ ] **Step 3: コミット**

gitは未初期化のためスキップ。

---

### Task 6: 作品詳細のロジック（detail.js）— TDD

**Files:**
- Create: `detail.js`
- Test: `test/detail.test.js`

- [ ] **Step 1: 失敗するテストを書く**

```js
// test/detail.test.js
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
```

- [ ] **Step 2: テストを実行し、失敗することを確認する**

Run: `node --test`
Expected: `detail.js` が存在しないため `ERR_MODULE_NOT_FOUND` で失敗する

- [ ] **Step 3: detail.js を実装する**

```js
// detail.js
export function findWorkById(works, id) {
  return works.find((work) => work.id === id) ?? null;
}

export function renderDetailHTML(work) {
  if (!work) {
    return '<p class="page-lede">指定された作品が見つかりませんでした。</p>';
  }
  const tags = work.tags.map((tag) => `<span class="tag">${tag}</span>`).join('');
  return `
    <p class="work-category-label">${work.category}</p>
    <h1>${work.title}</h1>
    <p class="description">${work.description}</p>
    <div class="work-tags">${tags}</div>
    <p class="work-status">ステータス: ${work.status}</p>
    <a class="btn btn-primary" href="${work.url}" target="_blank" rel="noopener">アプリを開く</a>
  `;
}

async function init() {
  const container = document.getElementById('detail-container');
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  try {
    const res = await fetch('data/works.json');
    const works = await res.json();
    const work = findWorkById(works, id);
    container.innerHTML = renderDetailHTML(work);
  } catch (err) {
    container.innerHTML = '<p class="page-lede">作品データの読み込みに失敗しました。</p>';
  }
}

if (typeof document !== 'undefined') {
  init();
}
```

- [ ] **Step 4: テストを実行し、成功することを確認する**

Run: `node --test`
Expected: `test/detail.test.js` の4テストがすべてPASS（既存の9テストも引き続きPASS、合計13テスト）

- [ ] **Step 5: コミット**

gitは未初期化のためスキップ。

---

### Task 7: 作品詳細ページ（detail.html）

**Files:**
- Create: `detail.html`

- [ ] **Step 1: detail.html を作成する**

```html
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>作品詳細 | Masato Asano</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<nav class="site-nav">
  <a href="index.html" class="nav-logo">Masato Asano</a>
  <div class="nav-links">
    <a href="index.html" class="nav-link">Home</a>
    <a href="works.html" class="nav-link active">Works</a>
    <a href="about.html" class="nav-link">About</a>
    <a href="contact.html" class="nav-link">Contact</a>
  </div>
</nav>

<main class="page detail-page">
  <div id="detail-container">読み込み中...</div>
</main>

<script type="module" src="detail.js"></script>
</body>
</html>
```

- [ ] **Step 2: ローカルサーバーで動作確認する**

Task 5と同じローカルサーバーを使う。

Run（サーバー起動中の別ターミナルで）: ブラウザで `http://localhost:3000/detail.html?id=ghoul` を開く
Expected: 「東京喰種 パチンコシミュレーター」のタイトル・説明・タグ・「アプリを開く」ボタンが表示される

Run: ブラウザで `http://localhost:3000/detail.html?id=not-exist` を開く
Expected: 「指定された作品が見つかりませんでした。」と表示される

- [ ] **Step 3: works.html からの遷移を確認する**

`works.html` で任意のカードをクリックし、対応する `detail.html?id=xxx` に正しく遷移して詳細が表示されることを確認する。

- [ ] **Step 4: コミット**

gitは未初期化のためスキップ。

---

### Task 8: Home ページ（index.html）

**Files:**
- Create: `index.html`

たたき台のヒーロー構成をベースに、共通ナビを追加し、RECENT BUILDS には各カテゴリ代表作（ghoul / keiba-jockey / health-calendar）へのリンクを設定する。

- [ ] **Step 1: index.html を作成する**

```html
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Masato Asano | Portfolio</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<nav class="site-nav">
  <a href="index.html" class="nav-logo">Masato Asano</a>
  <div class="nav-links">
    <a href="index.html" class="nav-link active">Home</a>
    <a href="works.html" class="nav-link">Works</a>
    <a href="about.html" class="nav-link">About</a>
    <a href="contact.html" class="nav-link">Contact</a>
  </div>
</nav>

<main>
<section class="hero">
  <div>
    <div class="eyebrow"><span class="dot"></span>AVAILABLE FOR WORK</div>
    <h1>営業の合間に、<br>動く<span class="accent">ツール</span>を作ってます。</h1>
    <p class="sub">
      製造業の営業職を本業に、Claude Codeを使ったWeb制作・シミュレーター開発を副業で行っています。
      企画から実装、公開まで一人で対応します。
    </p>
    <div class="cta-row">
      <a href="works.html" class="btn btn-primary">作品を見る</a>
      <a href="contact.html" class="btn btn-ghost">お問い合わせ</a>
    </div>
  </div>

  <div class="lamp-panel">
    <div class="lamp-panel-header">
      <span>RECENT BUILDS</span>
      <span>STATUS</span>
    </div>
    <a href="detail.html?id=ghoul" class="lamp-row">
      <span class="lamp-led on"></span>
      <span class="lamp-label">東京喰種 パチンコシミュレーター</span>
      <span class="lamp-meta">公開中</span>
      <span class="lamp-arrow">→</span>
    </a>
    <a href="detail.html?id=keiba-jockey" class="lamp-row">
      <span class="lamp-led on"></span>
      <span class="lamp-label">G1単勝購入シミュレーター</span>
      <span class="lamp-meta">公開中</span>
      <span class="lamp-arrow">→</span>
    </a>
    <a href="detail.html?id=health-calendar" class="lamp-row">
      <span class="lamp-led on"></span>
      <span class="lamp-label">ヘルスカレンダー</span>
      <span class="lamp-meta">公開中</span>
      <span class="lamp-arrow">→</span>
    </a>
  </div>
</section>
</main>

</body>
</html>
```

**注記:** 当初案では `<main>` ラッパーと `lamp-arrow`（クリック可能であることを示す矢印）が無かったが、Task 8のコード品質レビューで「works.html/detail.htmlとのランドマーク不整合」「lamp-rowがリンクだと分かる視覚的手がかりが無い」と指摘され、上記の内容に修正済み。`style.css` にも `.lamp-row:hover` / `.lamp-row:focus-visible` / `.lamp-arrow` を追加している（Task 2のスタイルシート内に反映済み）。

- [ ] **Step 2: ブラウザで確認する**

Run: ブラウザで `http://localhost:3000/index.html` を開く
Expected:
- ナビの「Home」がアクセントカラーで強調されている
- ヒーロー文言・ボタンが表示される
- RECENT BUILDS の3行がそれぞれ `detail.html?id=...` にリンクしており、クリックすると該当作品の詳細が表示される

- [ ] **Step 3: コミット**

gitは未初期化のためスキップ。

---

### Task 9: About ページ（about.html）

**Files:**
- Create: `about.html`

- [ ] **Step 1: about.html を作成する**

```html
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>About | Masato Asano</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<nav class="site-nav">
  <a href="index.html" class="nav-logo">Masato Asano</a>
  <div class="nav-links">
    <a href="index.html" class="nav-link">Home</a>
    <a href="works.html" class="nav-link">Works</a>
    <a href="about.html" class="nav-link active">About</a>
    <a href="contact.html" class="nav-link">Contact</a>
  </div>
</nav>

<main class="page">
  <h1>About</h1>
  <p class="page-lede">製造業の営業職を本業にしながら、空き時間でWebツールを作っています。</p>

  <section class="about-section">
    <h2>経歴</h2>
    <p>製造業で営業職として勤務する傍ら、Claude Codeを使った個人開発を続けています。もともとは自分自身が遊ぶための遊技シミュレーターやライフログツールを作っていましたが、企画から実装・公開までを一人で回せることに気づき、副業として作品を公開するようになりました。（※仮テキストです。後で差し替えてください）</p>
  </section>

  <section class="about-section">
    <h2>使える技術・ツール</h2>
    <div class="skill-tags">
      <span class="tag">Claude Code</span>
      <span class="tag">HTML / CSS</span>
      <span class="tag">JavaScript</span>
      <span class="tag">GitHub Pages</span>
    </div>
  </section>

  <section class="about-section">
    <h2>制作スタンス</h2>
    <p>企画・設計・実装・公開までを一人で対応します。作りたいものを素早く形にして公開まで完結できるのが強みです。（※仮テキストです。後で差し替えてください）</p>
  </section>
</main>

</body>
</html>
```

- [ ] **Step 2: ブラウザで確認する**

Run: ブラウザで `http://localhost:3000/about.html` を開く
Expected: ナビの「About」が強調され、経歴・技術タグ・制作スタンスの3セクションが表示される

- [ ] **Step 3: コミット**

gitは未初期化のためスキップ。

---

### Task 10: Contact ページ（contact.html）

**Files:**
- Create: `contact.html`

送信先は未定のため `<form>` の `action` は仮の値にしておき、後日 Formspree 等に差し替えられるようにする。

- [ ] **Step 1: contact.html を作成する**

```html
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Contact | Masato Asano</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<nav class="site-nav">
  <a href="index.html" class="nav-logo">Masato Asano</a>
  <div class="nav-links">
    <a href="index.html" class="nav-link">Home</a>
    <a href="works.html" class="nav-link">Works</a>
    <a href="about.html" class="nav-link">About</a>
    <a href="contact.html" class="nav-link active">Contact</a>
  </div>
</nav>

<main class="page">
  <h1>Contact</h1>
  <p class="page-lede">お仕事のご相談・お問い合わせはこちらのフォームからお願いします。<br>※ すべての項目が必須です。</p>

  <!-- TODO: action は仮のURLです。送信先（例: Formspree）が決まったら差し替えてください -->
  <form class="contact-form" action="https://example.com/replace-with-your-form-endpoint" method="POST">
    <div class="form-field">
      <label for="name">お名前</label>
      <input type="text" id="name" name="name" autocomplete="name" required>
    </div>
    <div class="form-field">
      <label for="email">メールアドレス</label>
      <input type="email" id="email" name="email" autocomplete="email" required>
    </div>
    <div class="form-field">
      <label for="message">ご相談内容</label>
      <textarea id="message" name="message" required></textarea>
    </div>
    <button type="submit" class="btn btn-primary">送信する</button>
  </form>
</main>

</body>
</html>
```

**注記:** コード品質レビューで「autocomplete属性が無い」「必須項目の視覚的な明示が無い」と指摘され、上記の内容に修正済み（name/emailにautocomplete属性を追加、リード文に「すべての項目が必須です」を追記）。

- [ ] **Step 2: ブラウザで確認する**

Run: ブラウザで `http://localhost:3000/contact.html` を開く
Expected: ナビの「Contact」が強調され、お名前・メールアドレス・ご相談内容の入力欄と送信ボタンが表示される（送信は仮のURL宛のため、実際の送信テストは送信先確定後に行う）

- [ ] **Step 3: コミット**

gitは未初期化のためスキップ。

---

### Task 11: 全体の最終確認

**Files:** なし（確認のみ）

- [ ] **Step 1: 単体テストを一括実行する**

Run: `node --test`
Expected: `test/works-data.test.js`（4）+ `test/works.test.js`（5）+ `test/detail.test.js`（4）= 13テストすべてPASS

- [ ] **Step 2: 全ページをブラウザで一通り確認する**

ローカルサーバーを起動した状態で、Home → Works → 任意のカード → About → Contact の順に実際にクリックして遷移する。

Expected:
- 全ページでナビゲーションの現在地がハイライトされている
- Works ページの3カテゴリに合計16件のカードが表示されている
- 各カードから詳細ページに遷移でき、正しい情報（タイトル・説明・タグ・公開URLへのリンク）が表示される
- `juggler` と `umaren-takarakuji` の「アプリを開く」リンク先が、それぞれ `.../juggler-simulator.html` と `.../webapp/` を含む正しいURLになっている
- レスポンシブ確認: ブラウザ幅を640px以下に縮めても、ナビゲーションと各ページのレイアウトが崩れない

- [ ] **Step 3: コミット**

gitは未初期化のためスキップ。ユーザーが後日 `git init` する際に、このタイミングで最初のコミットとしてまとめて取り込む想定。
