# T-Kong

**非公式**の Firefox（Android向け）拡張です。  
[日経電子版](https://www.nikkei.com/)で開いている記事の手がかりを端末内に保存し、[楽天証券版 日経テレコン](https://www.rakuten-sec.co.jp/)へ進んだあとの **同一記事探し** を補助します。

サイト: [ayamoke.github.io/T-Kong](https://ayamoke.github.io/T-Kong/)  
インストール: [Firefox Add-ons（AMO）](https://addons.mozilla.org/ja/firefox/addon/t-kong/)

> 日経・楽天証券の公式プロダクトではありません。  
> すでに楽天証券版日経テレコンを **正規利用できる方** 向けの操作補助です。

## できること

- nikkei.com の記事ページに「テレコンで読む」ボタンを追加し、タイトルなどを **端末内だけ** に保存
- 保存後に楽天証券アプリ（iSPEED）の起動を促す（設定でオフ可。認証はしない）
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
2. iSPEED が開いたら、右下の **メニュー** → **マーケット** 内の「市況／ニュース／ランキング」の下にある **日経テレコン** をタップ  
   （起動しない場合は「楽天証券アプリを開く」ボタン、または手動で iSPEED を開く）
3. 許諾画面は通常どおり確認して同意（自動同意は設定でONにした場合のみ）
4. ニュース検索画面で「保存記事を開く」／自動フローにより検索〜オープンを補助します

## Firefox を快適に使う（Android）

T-Kong は **Firefox 上**でのみ動きます。記事が Chrome や Google アプリ内ブラウザで開くとボタンが出ません。次を設定しておくと楽です。

### デフォルトブラウザを Firefox にする

どちらか（できれば両方）:

1. **端末設定** → **アプリ** → **デフォルトのアプリ** → **ブラウザアプリ** → **Firefox**
2. **Firefox** → メニュー（︙）→ **設定** → **デフォルトのブラウザーに設定**

### Google Discover の記事だけ Chrome になるのを避ける

Discover から開くと、デフォルトブラウザ設定とは別に Google アプリ内でページが開くことがあります。

1. **Google アプリ** → 右上のプロフィール画像 → **設定** → **その他の設定**
2. **アプリ内でウェブページを開く** を **オフ**

これで Discover のリンクも、端末のデフォルトブラウザ（Firefox）側に渡りやすくなります。

## インストール

### A. Firefox Add-ons（おすすめ）

1. スマホの Firefox で [T-Kong（AMO）](https://addons.mozilla.org/ja/firefox/addon/t-kong/) を開く
2. **Firefox へ追加** をタップしてインストールする

### A-2. 署名済み `.xpi` をファイルから入れる（代替）

AMO のページから入れない場合や、署名済み `.xpi` を手元に持っている場合向けです。  
GitHub Release の `.zip` はソース用で、この手順には使いません。

1. AMO / Developer Hub から署名済み `.xpi` を入手する
2. スマホへ移す（USB / Drive / 自分宛メールなど）
3. スマホで **Firefox** を開く
4. メニュー（⋮）→ **設定** → 一番下の **Firefox について**
5. 画面の **Firefox ロゴを連続タップ**（5〜10回）  
   「デバッグメニューを有効にしました」などと出たらOK
6. 設定に戻ると **「ファイルからアドオンをインストール」** が出る  
   （英語UI: *Install add-on from file*）
7. それを開き、移した `.xpi` を選んで追加する
8. 拡張機能一覧に **T-Kong** が出ていれば成功

補足:

- ファイルアプリの「共有」に Firefox が出なくても問題ありません（上記の手順を使います）
- `.zip` のままでは追加できないことが多いです。必ず署名済み `.xpi` を使ってください
- 別案: `.xpi` を HTTPS で置ける場所に置き、**スマホの Firefox でそのURLを開いて**ダウンロード／追加する

### B. PCから一時的に入れる（開発・確認用）

常用ではなく、開発中の動作確認向けです。Firefox を閉じると消えることがあります。

#### B-1. Android 実機へ一時インストール（`web-ext`）

前提:

- PCに Node.js / `web-ext` / `adb`
- スマホの USBデバッグ ON
- スマホ Firefox の **USB経由のリモートデバッグ** ON
- USB接続

```bash
npm install --global web-ext
cd /path/to/T-Kong
adb devices
web-ext run --target=firefox-android --firefox-apk=org.mozilla.firefox
```

端末が複数ある場合:

```bash
web-ext run --target=firefox-android --firefox-apk=org.mozilla.firefox --android-device=<DEVICE_ID>
```

PC側の `about:debugging`（USBデバイス）は、一時拡張の読み込みボタンが無いことがあります。  
Android への一時入れは **`web-ext run`** を使ってください。

#### B-2. PCの Firefox だけで一時確認

nikkei.com 側のボタン確認など、PCだけで見る場合:

1. PCの Firefox で `about:debugging` を開く
2. 左の **この Firefox**
3. **一時的な拡張機能を読み込む**
4. このリポジトリの `manifest.json` を選ぶ

※ 楽天証券版テレコン（スマホ前提の導線）の確認には向きません。

### 開発用のビルド（ローカル）

```bash
npm install --global web-ext
web-ext lint
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

## 設定

拡張の管理画面から **設定** を開きます。

| 項目 | 既定 |
| --- | --- |
| 保存後に楽天証券アプリ起動を促す | ON |
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
