# T-Kong

**非公式**の Firefox（Android向け）拡張です。  
[日経電子版](https://www.nikkei.com/)で開いている記事の手がかりを端末内に保存し、[楽天証券版 日経テレコン](https://www.rakuten-sec.co.jp/)へ進んだあとの **同一記事探し** を補助します。

サイト: [ayamoke.github.io/T-Kong](https://ayamoke.github.io/T-Kong/)

> 日経・楽天証券の公式プロダクトではありません。  
> すでに楽天証券版日経テレコンを **正規利用できる方** 向けの操作補助です。

## できること

- nikkei.com の記事ページに「テレコンで読む」ボタンを追加し、タイトルなどを **端末内だけ** に保存
- 楽天の許諾画面で「同意する」を自動クリック（**初期OFF**。設定でON可）
- テレコンのニュース検索でタイトル検索 → 一致する見出しを開く（設定でオフ可）
- 設定画面で自動化のオン／オフを切り替え

## できないこと・やらないこと

- 楽天証券へのログイン代行
- ID / パスワード / Cookie / SSO トークンの取得・保存
- 有料本文の取得・保存
- T-Kong独自サーバーへのデータ送信
- テレコンに無い記事を無理やり出すこと（収録範囲外の記事は見つかりません）

## 必要なもの

- Firefox for Android（目安: 142 以降）
- 楽天証券版日経テレコンを利用できる契約・アカウント（利用者本人のもの）

PC版 Firefox でも一部動作しますが、想定利用は Android です。

## 使い方

1. nikkei.com で記事を開き、「テレコンで読む」をタップ（保存タイトルがトースト表示されます）
2. いつもの手順で楽天証券アプリなどから日経テレコンを開く
3. 許諾画面は通常どおり確認して同意（自動同意は設定でONにした場合のみ）
4. ニュース検索画面で「保存記事を開く」／自動フローにより検索〜オープンを補助します

## インストール

### 署名済みを使う（常用向け）

AMO で署名した `.xpi` を Firefox for Android に追加します。  
（Self-distributed / Listed のどちらでも可）

開発者向けのビルド:

```bash
npm install --global web-ext
web-ext build
```

成果物は `web-ext-artifacts/` に出力されます。

### GitHub からのビルド / リリース

`main` への push と Pull Request では GitHub Actions が `web-ext lint` と `web-ext build` を実行し、ZIP を Artifact（`t-kong-build`）として保存します。

Git タグを push すると GitHub Release が作られ、`T-Kong-<version>.zip` が添付されます。  
タグ（例: `v0.3.2`）と `manifest.json` の `version`（例: `0.3.2`）は一致させてください。

```bash
# manifest.json の version を確認してから
git tag v0.3.2
git push origin v0.3.2
```

AMO への提出・署名は当面手動です（CI から AMO API は呼びません）。

### 開発用の一時実行

```bash
web-ext lint
web-ext run --target=firefox-android --firefox-apk=org.mozilla.firefox
```

USB デバッグと、Firefox 側の「USB経由のリモートデバッグ」が必要です。

## 設定

拡張の管理画面から **設定** を開きます。

| 項目 | 既定 |
| --- | --- |
| 許諾の自動同意 | **OFF** |
| 同意後に保存記事を自動オープン | ON |
| 検索結果の自動クリック | ON |
| フローティングボタン表示 | ON |
| h1見出しを優先して保存 | ON |
| `決算:` などの接頭辞除去 | ON |

## プライバシー

- T-Kong独自の外部サーバーへのデータ送信は行いません。日経電子版、楽天証券版日経テレコンなど、ユーザーが利用する対象Webサイトとの通常の通信のみ発生します。
- 楽天証券のID・パスワードは取得しません
- Cookie や SSO トークンは取得・保存しません
- 日経の有料記事本文は収集・保存しません
- 記事探しに必要な記事ID・タイトル・URL等は、ブラウザのローカルストレージ内のみで扱います（保存から24時間で無効）
- 権限は `storage` のみ

## 技術概要

| 対象 | 役割 |
| --- | --- |
| `content/nikkei.js` | 記事情報の保存 |
| `content/rakuten-consent.js` | 許諾画面の同意クリック（設定ON時） |
| `content/telecon.js` | 全ニュース切替・検索・結果クリック |
| `options/` | 設定 UI |
| `shared/settings.js` | 設定の読み書き |

Manifest V3 / 拡張 ID: `@t-kong`

## 開発者向けメモ

- テレコン側は DOM 依存が大きいので、サイト変更で壊れることがあります
- 記事ID単体検索はヒットしにくいため、タイトル検索が主です
- 見出しと og:title で表記が違うことがあるため、h1 優先＋接頭辞除去を入れています

## 免責

本ソフトウェアは現状有姿で提供され、利用は自己責任です。  
各サービスの利用規約・契約条件を守ったうえでお使いください。

## ライセンス

[MIT](./LICENSE)
