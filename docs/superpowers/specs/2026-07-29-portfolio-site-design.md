# ポートフォリオサイト 設計

## 目的

製造業の営業職を本業としながら、Claude Codeを使ったWeb制作・シミュレーター開発を副業で行っている個人のポートフォリオサイト。

主目的は副業の制作依頼獲得だが、実績の記録・発信、将来的なキャリアの選択肢を広げることも同時に満たす設計とする（いずれか一つに絞らない）。依頼が来なくても実績ページとして機能し、転職を検討する際にもそのまま使えることを意識する。

## 技術構成

- 素のHTML/CSS/JS（フレームワークなし）。ユーザーの他の全プロジェクトと同じパターンで、GitHub Pagesにそのまま公開できることを重視。
- リポジトリ名（仮）: `portfolio-site`

## ファイル構造

```
portfolio-site/
├── index.html          # Home（ヒーロー）
├── works.html          # 作品一覧（カテゴリ別）
├── detail.html         # 作品詳細（1テンプレート、?id=xxx で切替）
├── about.html
├── contact.html
├── style.css            # 全ページ共通
├── data/works.json       # 作品データ（16件）
└── script.js             # 共通JS（ナビ・detail.htmlのデータ読み込みなど）
```

## ビジュアルスタイル

たたき台（ダーク＋アンバーの「ランプパネル」演出、スロットのインジケーターランプをモチーフにしたデザイン）をベースに、以下の方向で調整する（3案から選定: A=たたき台そのまま／B=白背景の王道エンジニアポートフォリオ／**C=ダーク基調は維持しつつ配色を落ち着かせた案**）。

- 背景: ダーク基調（`#161a20`系。たたき台の`#12141c`に近い色を継続）
- アクセントカラー: ミント系（`#7fe0c4`）。たたき台のアンバー（`#f2a93b`）から変更し、遊技機っぽさを抑えて信頼感とのバランスを取る
- ヒーローの「ランプパネル」ウィジェット（RECENT BUILDS表示）は構造として維持するが、点滅LED演出は最小限に抑える
- フォント: Sora / Noto Sans JP / JetBrains Mono を継続使用

## ナビゲーション

全ページ共通、4項目を明示: `Home / Works / About / Contact`

## ページ構成

### Home（index.html）
たたき台のヒーロー構成をベースに、共通ナビを追加し配色をC案に変更。RECENT BUILDSパネルには実際のカテゴリ代表作を数件表示する。

### Works（works.html）
全16件をカテゴリ別（パチンコ・スロット／シミュレーター／日常ツール）にグループ化して表示。各カードはテキストのみ（タイトル・一行説明・タグ・リンク）、スクリーンショット画像は使わない（後日追加できる構造にはしておく）。カードクリックで `detail.html?id=xxx` へ遷移。

### detail.html
`data/works.json` から `id` に対応するデータを読み込んで表示する共通テンプレート1枚。表示項目: タイトル、概要、使用技術タグ、公開URL、カテゴリ、ステータス。

### About（about.html）
以下を含む（具体的な文章は仮テキストで用意し、後で本人が差し替える前提）:
- 経歴（製造業の営業職 → Claude Codeでの開発プロセス）
- 使える技術・ツール（Claude Code、HTML/CSS/JSなど）
- 制作スタンス（企画〜実装〜公開まで一人で対応する強み）

### Contact（contact.html）
入力フォームを設置する。送信先（Formspree等）は未定のため、`<form>` の `action` は仮の値とし、後から差し替えやすい構造にする。

## 作品データ（data/works.json、全16件）

各作品の一行説明は仮テキストで埋め、後で自由に差し替えられるようにする。

### パチンコ・スロット（9件）
| id | タイトル | 公開URL |
|---|---|---|
| ghoul | 東京喰種 パチンコシミュレーター | https://wwi195.github.io/pachinko-simulator-ghoul/ |
| ghouldeka | e 東京喰種 超デカ超一撃ver. シミュレーター | https://wwi195.github.io/pachinko-simulator-ghouldeka/ |
| ghouldeka-analysis | e 東京喰種 超デカ超一撃ver. 長期収支分析ツール | https://wwi195.github.io/pachinko-simulator-ghouldeka-analysis/ |
| kinniku | キン肉マン パチンコシミュレーター | https://wwi195.github.io/pachinko-simulator-kinniku/ |
| lycoris | リコリス・リコイル パチンコシミュレーター | https://wwi195.github.io/pachinko-simulator-lycoris/ |
| garo7500 | 牙狼7500 シミュレーター | https://wwi195.github.io/garo7500/ |
| okidoki | 沖ドキ シミュレーター | https://wwi195.github.io/okidoki-simulator/ |
| juggler | ジャグラー シミュレーター | https://wwi195.github.io/juggler-simulator/juggler-simulator.html（※ルートに index.html がないため直リンク必須） |
| milliongod | GODガイアステージ シミュレーター | https://wwi195.github.io/million-god-simulator/ |

### シミュレーター（4件）
| id | タイトル | 公開URL |
|---|---|---|
| keiba-jockey | G1単勝購入シミュレーター | https://wwi195.github.io/keiba-jockey-simulator/ |
| diet-psychology | ダイエット心理シミュレーター | https://wwi195.github.io/diet-psychology-simulator/ |
| umaren-takarakuji | 馬連 vs 宝くじ 比較シミュレーター | https://wwi195.github.io/takarakuji-payout-simulator/webapp/（※リポジトリ名が umaren-vs-takarakuji ではなく takarakuji-payout-simulator、index.html は /webapp 配下） |
| birthday-keiba | 誕生日馬券シミュレーター | https://wwi195.github.io/keiba-jockey-simulator2/ |

### 日常ツール（3件）
| id | タイトル | 公開URL |
|---|---|---|
| health-calendar | ヘルスカレンダー | https://wwi195.github.io/health-calendar/ |
| conbini-tracker | コンビニ割高トラッカー | https://wwi195.github.io/conbini-tracker/ |
| price-comparator | 単価比較ツール | https://wwi195.github.io/price-comparator/ |

### 除外
- `kanda-dump-site`（関東大興運輸株式会社 コーポレートサイト試作） — クライアント向け試作で `robots.txt` により noindex 設定済み。個人ポートフォリオの対象外とする。

## スコープ外（今回はやらない）

- スクリーンショット画像の追加（後日、本人が撮影して追加できる構造にはしておく）
- Contactフォームの実送信先設定（Formspree等への接続は本人が後日行う）
- 各作品ページの本文（一行説明）の最終確定（仮テキストで実装し、後日差し替え）
