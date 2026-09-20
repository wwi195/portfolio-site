# Worksページ ジャンル分離 設計

## 目的

現状 `works.html` は4カテゴリ（パチンコ・スロット／収支分析ツール／シミュレーター／日常ツール）の作品を1ページにまとめて表示している。これを「ジャンル一覧ページ → ジャンル別作品一覧ページ」の2段構成に変更し、パチンコ好きの訪問者に対して「パチンコ・スロット作品だけ」を見せられる共有可能なURLを用意する。パチンコ好きは副業・効率ツール系のコンテンツを見ると現実に引き戻されて嫌な気持ちになるため、ジャンルを跨いだ露出を避ける。

## スコープ

- 対象は `works.html` / `works.js` / `style.css`（ジャンル関連スタイル追加）/ `test/works.test.js`。
- `data/works.json` の `category` フィールド・値は変更しない（既存4カテゴリをそのままジャンル単位とする）。
- `detail.html` / `index.html` / `about.html` / `contact.html` は変更しない。

## アーキテクチャ

`works.html` を1ファイルのまま、URLクエリ `?genre=<slug>` の有無で「ジャンル一覧」と「ジャンル別作品一覧」の2状態を切り替える。

```
works.html                     → ジャンル一覧（4ジャンルのカード）
works.html?genre=pachinko      → 「パチンコ・スロット」の作品グリッド
works.html?genre=analysis      → 「収支分析ツール」の作品グリッド
works.html?genre=simulator     → 「シミュレーター」の作品グリッド
works.html?genre=dailytool     → 「日常ツール」の作品グリッド
```

`genre` の値が上記スラッグのいずれにも一致しない場合は、ジャンル一覧表示にフォールバックする（専用の404表示は作らない）。

ナビゲーションバーの「Works」リンクは常に `works.html`（ジャンル一覧）を指す。ジャンル別ページ表示中もナビは変更しない（他ジャンルへ戻れる状態のままでよい、という前提で確認済み）。

## データモデル

`works.js` 内に新しい定数 `GENRES` を追加する（`data/works.json` は変更しない）。

```js
export const GENRES = [
  { slug: 'pachinko', category: 'パチンコ・スロット', label: 'パチンコ・スロット', blurb: '実機の確率・演出をWebで再現した、無料で遊べるパチンコ・スロットシミュレーター集。' },
  { slug: 'analysis', category: '収支分析ツール', label: '収支分析ツール', blurb: '演出を省き、長期的な収支・出玉傾向だけを検証する分析特化ツール。' },
  { slug: 'simulator', category: 'シミュレーター', label: 'シミュレーター', blurb: '競馬やダイエットなど、日常の意思決定を数値でシミュレーションするツール集。' },
  { slug: 'dailytool', category: '日常ツール', label: '日常ツール', blurb: '体調管理や価格比較など、日々の暮らしをちょっと便利にするツール集。' },
];
```

`blurb` はたたき台であり、実装後にユーザーがレビュー・修正する前提。並び順は既存 `CATEGORY_ORDER` と一致させる。

## works.js の変更

- `CATEGORY_ORDER` / `groupByCategory` / `renderWorkCard` はそのまま維持し、内部で流用する。
- `renderWorksHTML`（全カテゴリを一括で並べる現行の一覧描画関数）は削除する。ジャンル一覧・ジャンル別一覧の2関数に置き換わるため不要。
- `renderGenreCard(genre, works)`: 該当ジャンルの件数を数え、ジャンル名・件数・blurb・`works.html?genre=<slug>` へのリンクを持つカードHTMLを返す純粋関数。
- `renderGenreListHTML(works, genres = GENRES)`: 見出し（`<h1>Works</h1>` 相当）＋リード文＋`GENRES` の順に並べた `renderGenreCard` の一覧をラップしたHTMLを返す。
- `renderGenreWorksHTML(genreSlug, works, genres = GENRES)`: `genreSlug` に一致する `GENRES` の要素を探し、見つからなければ `null` を返す。見つかった場合はジャンル名を見出しにしたHTML＋そのカテゴリの `renderWorkCard` グリッド＋「← すべてのジャンルを見る」（`works.html` への戻りリンク）を返す。
- `init()`: `URLSearchParams(window.location.search)` から `genre` を取得し、`renderGenreWorksHTML` が非 `null` ならその結果を、`null`（`genre` 未指定 or 不正値）なら `renderGenreListHTML` の結果を `#works-container` に描画する。

## works.html の変更

静的な `<h1>Works</h1>` と `<p class="page-lede">` を削除し、`#works-container` のみを残す。見出し・リード文は状態に応じて `works.js` が描画する。

## style.css の変更

- `.genre-grid`: `.work-grid` と同様の `grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))` によるカードグリッド。
- `.genre-card`: `.work-card` をベースにしたカードスタイル。ジャンル名（見出し）・blurb・件数バッジを縦に並べる。
- `.genre-count`: `.tag` に近い見た目の小さな件数バッジ（例: 「12件」）。
- ジャンル別作品一覧側は既存の `.work-category` / `.work-grid` / `.work-card` をそのまま再利用し、新規CSSは追加しない。

## テスト（test/works.test.js）

- 既存の `renderWorkCard` テストは維持する。
- `renderWorksHTML` 関連テストは削除する。
- 新規追加:
  - `renderGenreCard` が正しいジャンル名・件数・`href="works.html?genre=<slug>"` を含むこと。
  - `renderGenreListHTML` が `GENRES` の順序で4枚のジャンルカードを出力すること。
  - `renderGenreWorksHTML('pachinko', works)` が該当カテゴリの作品のみを含むグリッドを返すこと（他カテゴリのタイトルを含まないこと）。
  - `renderGenreWorksHTML('not-exist', works)` が `null` を返すこと。

## 非スコープ

- `data/works.json` のカテゴリ再編（例: 収支分析ツールをパチンコ配下に統合する等）は行わない。既存4カテゴリ＝4ジャンルのまま。
- ジャンル別ページ表示中にナビゲーションの構成やリンク先を変える対応は行わない。
- 不正な `genre` 値に対する専用エラー画面は作らない（一覧へのフォールバックのみ）。
- ジャンルカードの画像・アイコンは追加しない（テキストベースのカードのみ）。
