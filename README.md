# md-memo — Markdown メモ帳

## 概要

**md-memo** は、ブラウザ上で完結する Markdown メモ帳です。  
インストールやサーバー構築は一切不要で、`index.html` を開くだけですぐに使い始められます。

- Markdown のリアルタイムプレビュー
- フォルダツリーによるメモ管理
- ドラッグ＆ドロップでノート / フォルダを自由に整理
- Markdown / PDF へのエクスポート
- 8 種類のエディタテーマ & 6 種類のプレビューテーマ
- データはブラウザの localStorage に自動保存

## 使い方

1. `index.html` をブラウザで開く
2. サイドバーの `+` ボタンからメモ / フォルダを作成
3. 左ペインで Markdown を書くと、右ペインにリアルタイムプレビューが表示される
4. メモは自動保存される（400ms デバウンス）

## 機能一覧

### エディタ

| 機能 | 説明 |
|------|------|
| Markdown 編集 | GFM 対応（改行・テーブル・タスクリスト等） |
| リアルタイムプレビュー | 入力と同時に HTML に変換して表示 |
| スプリットペイン | エディタとプレビューの比率をドラッグで調整可能 |
| レイアウト切替 | 横並び / 縦並びをツールバーから切替 |
| ツールバー | 太字・斜体・見出し・コード etc. をワンクリック挿入 |
| スマートリスト | Enter でリストを自動継続、空行で解除 |
| ショートカット | `Ctrl+B` (太字), `Ctrl+I` (斜体), `Ctrl+K` (リンク), `Ctrl+S` (エクスポート) |
| ステータスバー | 文字数・行数・単語数をリアルタイム表示 |

### メモ管理

| 機能 | 説明 |
|------|------|
| フォルダツリー | ネスト可能なフォルダ構造でメモを整理 |
| インライン編集 | ノード名をクリックしてその場でリネーム |
| ドラッグ & ドロップ | メモやフォルダをドラッグで移動・並び替え |
| 右クリックメニュー | フォルダ内に新規作成・リネーム・削除 |
| 自動保存 | 編集内容は localStorage に自動保存される |
| 復元 | リロード後もアクティブなメモ・サイドバーの状態を保持 |

### エクスポート

| 形式 | 方法 |
|------|------|
| Markdown (`.md`) | ツールバーのエクスポートボタン or `Ctrl+S` |
| PDF | html2canvas + jsPDF でプレビューを PDF 出力（改ページ自動処理） |

### テーマ

- **エディタテーマ（8）**: Cyberpunk, Dracula, Monokai, Nord, GitHub Dark, Solarized Light, Tokyo Night, Ayu Mirage
- **プレビューテーマ（6）**: GitHub, GitHub Dark, Cyberpunk, Dracula, Nord, Simple

## 技術スタック

| 項目 | 内容 |
|------|------|
| 言語 | HTML5 / CSS3 / JavaScript (Vanilla) |
| Markdown パーサー | [marked.js](https://marked.js.org/) v15.0.12 |
| シンタックスハイライト | [highlight.js](https://highlightjs.org/) v11.9.0 |
| PDF 生成 | [jsPDF](https://github.com/parallax/jsPDF) + [html2canvas](https://html2canvas.hertzen.com/) v1.4.1 |
| データ保存 | ブラウザ localStorage |
| ビルドツール | 不要（すべて .min.js を同梱） |

## プロジェクト構成

```
md-memo/
├── index.html                 # エントリポイント
├── css/
│   ├── style.css              # アプリケーションスタイル（1159行）
│   └── highlight-theme.css    # コードハイライトテーマ
├── js/
│   └── app.js                 # メインロジック（1181行）
├── lib/
│   ├── marked.min.js          # Markdown パーサー
│   ├── highlight.min.js       # コードハイライター
│   ├── html2canvas.min.js     # HTML レンダリング（PDF用）
│   └── jspdf.umd.min.js       # PDF 生成
└── README.md
```

## データ保存場所

すべてのデータはブラウザの localStorage に保存されます。

| キー | 内容 |
|------|------|
| `md-notes-data` | メモ・フォルダのツリーデータ（JSON） |
| `md-notes-active` | 最後に開いていたメモの ID |
| `md-sidebar-open` | サイドバーの開閉状態 |
| `md-editor-theme` | 選択中のエディタテーマ |
| `md-preview-theme` | 選択中のプレビューテーマ |
| `md-layout` | レイアウトモード（horizontal / vertical） |

> **注意**: データはブラウザごとに独立して保存されます。別のブラウザや端末との同期は行われません。  
> バックアップとして Markdown エクスポート機能を推奨します。

## ライセンス

このプロジェクトは個人利用のために作成されたものです。  
各ライブラリ（marked.js, highlight.js, html2canvas, jsPDF）はそれぞれのライセンスに従います。
