# 作品詳細ページ タブ機能 設計

## 目的

`detail.html` の各作品ページに、「制作背景」「こだわり」「楽しみ方」の3タブを追加する。単なる一行説明だけでなく、どうやって作ったか・どこにこだわったか・どこが楽しいポイントかを伝え、依頼検討者や閲覧者が制作プロセスへの理解を深められるようにする。

## スコープ

- 対象は `detail.html`（作品詳細ページ）のみ。`works.html` の一覧カードは変更しない。
- 対象作品は `data/works.json` に登録されている全件（27件）。

## データモデル

`data/works.json` の各作品オブジェクトに `details` フィールド（オブジェクト）を追加する。

```json
{
  "id": "ghoul",
  ...既存フィールド...,
  "details": {
    "background": "制作背景の本文（1〜3文程度）",
    "commitment": "こだわりポイントの本文（1〜3文程度）",
    "fun": "楽しみ方の本文（1〜3文程度）"
  }
}
```

- 既存フィールド（id, title, description, category, tags, url, status）は変更しない。`details` は追加のみ。
- 3フィールドとも必須（空文字は不可）。プレーンテキスト（HTML埋め込みなし）とする。

## detail.js の変更

- `renderTabsHTML(details)`: `details` オブジェクトを受け取り、タブボタン3つ + タブパネル3つの HTML 文字列を返す純粋関数。ボタン/パネルには `data-tab` 属性（`background` / `commitment` / `fun`）を付与し、`role="tablist"` / `role="tab"` / `role="tabpanel"` などの最低限の aria 属性を付ける。初期状態は `background` をアクティブにする。
- `renderDetailHTML(work)`: 既存の出力に加え、`work.details` が存在する場合は `renderTabsHTML(work.details)` の出力を追記する。`details` が無い場合（テスト用の簡易データなど）はタブを描画しない。
- `initTabs(container)`: タブボタンのクリックを監視し、クリックされた `data-tab` に応じてボタン/パネルの `active` クラス（および `aria-selected` / `hidden`）を付け替える DOM 操作関数。`init()` から `renderDetailHTML` 実行後に呼び出す。

## style.css の変更

既存のデザイントークン（`--accent`, `--surface`, `--surface-line`, JetBrains Mono のラベル調）に合わせる。

- タブボタン行: `.tag` に近い見た目のピル型ボタンを横並びにし、アクティブなボタンは `--accent` で強調（背景 or 下線）
- タブパネル: `.description` と同様に `max-width: 60ch` 程度の読みやすい本文スタイル。非アクティブなパネルは `hidden` 属性で非表示

## コンテンツ（本文）

27件全作品について、「制作背景」「こだわり」「楽しみ方」をClaudeが下書きする。ユーザーの memory に詳細のある機種は具体的な内容にし、情報が少ない作品はタイトル・カテゴリ・既存 description から妥当な内容を推測する。**下書きはチャット上で提示し、ユーザーのレビュー・修正指示を経てから `works.json` に反映する。**

## テスト

- `test/works-data.test.js`: 全件が `details.background` / `details.commitment` / `details.fun` を持ち、かつ空文字でないことを検証するテストを追加。
- `test/detail.test.js`: `renderTabsHTML` が3つのボタンと3つのパネルを含み、`background` が初期アクティブであることを検証するテストを追加。`renderDetailHTML` に details 付きデータを渡した場合にタブが含まれることを検証するテストを追加。

## 非スコープ

- タブの中身を画像・リッチテキストで表現することは今回は行わない（プレーンテキストのみ）。
- works.html カード一覧への反映は行わない。
- キーボード操作（矢印キーでのタブ切り替え）などの高度なアクセシビリティ対応は行わない（クリック操作のみ）。
