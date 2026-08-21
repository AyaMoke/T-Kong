# AMO（addons.mozilla.org）Listed 登録文案

Developer Hub にコピー＆ペースト用。  
既定ロケールは **日本語（ja）** を推奨。英語（en-US）も併記しておくと審査・検索に有利です。

関連リンク:

- Homepage: https://ayamoke.github.io/T-Kong/
- Support / Source: https://github.com/AyaMoke/T-Kong
- Issues: https://github.com/AyaMoke/T-Kong/issues

カテゴリ候補: **News & Reading** / **Bookmarks**（近いもの。なければ Miscellaneous）  
対応: **Android** を主、Desktop は「一部動作」程度の扱いでよい

---

## 日本語（ja）

### 名前

```
T-Kong
```

### 要約（Summary・250文字以内）

```
日経電子版の記事タイトルを端末内だけに保存し、楽天証券版日経テレコンでの同一記事探しを補助する非公式拡張です。ログイン代行や有料本文の取得はしません。
```

（約 78 文字）

### 説明（Description）

AMO は Markdown 相当が使えます。

```markdown
**非公式**の Firefox for Android 向け拡張です。日経電子版で開いている記事の手がかりを端末内に保存し、すでにご利用の**楽天証券版 日経テレコン**で同じ記事を探しやすくします。

日経・楽天証券の公式プロダクトではありません。楽天証券版日経テレコンを**正規に利用できる方**向けの操作補助です。

## できること
- nikkei.com の記事ページに「テレコンで読む」ボタンを表示
- 記事タイトルなどを**端末内のストレージだけ**に保存（独自サーバーへは送りません）
- 保存後に楽天証券アプリ（iSPEED）の起動を促す（オフ可。認証はしません）
- テレコン側でタイトル検索〜見出しオープンを補助（各ステップは設定でオフ可）
- 楽天の許諾画面の自動同意は**初期オフ**（内容を確認したうえで必要な場合のみオン）

## やらないこと
- ログイン代行、ID / パスワード / Cookie / SSO の取得・保存
- 有料記事本文の取得・保存・配布
- テレコンに無い記事を無理に表示すること

## 使い方（概要）
1. Firefox で nikkei.com の記事を開く
2. 「テレコンで読む」をタップ
3. iSPEED のメニュー → マーケット →「日経テレコン」へ進む
4. テレコンが Firefox で開いたら、保存したタイトルでの検索・オープンを補助します

Discover などから記事が Chrome / アプリ内ブラウザで開くとボタンが出ません。デフォルトブラウザを Firefox にし、Google アプリの「アプリ内でウェブページを開く」をオフにすると快適です（詳しくは [GitHub README](https://github.com/AyaMoke/T-Kong)）。

## 権限
- `storage` のみ（設定と一時的な記事メタデータ）

利用は自己責任で、各サービスの利用規約・契約条件を守ってください。
```

### プライバシーポリシー（Privacy Policy）

```markdown
T-Kong（以下「本拡張」）のプライバシーに関する方針です。

## 収集する情報
本拡張は、記事探しの補助に必要な次の情報を、ご利用の端末上のブラウザストレージ（`browser.storage.local`）にのみ保存します。

- 記事ID、タイトル、URL、取得時刻など

これらは T-Kong 独自のサーバーへ送信しません。保存データは一定時間（約24時間）で無効になります。

## 収集しない情報
- 楽天証券・日経などの ID / パスワード
- Cookie、SSO トークン、セッション情報
- 有料記事の本文

## 通信について
本拡張は独自サーバーと通信しません。ユーザーが開いた日経電子版、楽天証券、日経テレコンなどのサイトとの通常の HTTPS 通信のみ発生します（ブラウザの通常動作です）。

## 権限
- `storage` のみ

## お問い合わせ
https://github.com/AyaMoke/T-Kong/issues
```

### 審査担当者向けメモ（Notes for Reviewers）※重要

```markdown
T-Kong is an unofficial helper for users who already have legitimate access to Rakuten Securities' Nikkei Telecon.

What it does:
- On nikkei.com article pages, saves article metadata (id/title/URL) to browser.storage.local only
- Optionally prompts opening the installed iSPEED app via Android intent (ispeed://launch). No credentials are entered or captured
- On Rakuten consent page (opt-in setting, default OFF), may click the visible Agree control
- On t21.nikkei.co.jp, assists searching by the saved title and opening a matching headline

What it does NOT do:
- No login automation, no password/cookie/SSO capture
- No scraping or storing of paywalled article bodies
- No T-Kong backend; data_collection_permissions required: none
- Host permissions are limited to nikkei.com articles, t21.nikkei.co.jp, and the specific Rakuten consent URL

Primary target: Firefox for Android. Please test with a nikkei.com /article/ URL in Firefox Android.
Homepage: https://ayamoke.github.io/T-Kong/
Source: https://github.com/AyaMoke/T-Kong
```

### バージョンノート（0.3.5 提出時の例）

```
- AMO Listed（全公開）向けの再提出版
- 機能は 0.3.4 相当（ispeed://launch 起動、Firefox 快適設定の案内など）
```

### バージョンノート（0.3.4）

```
- iSPEED 起動を ispeed://launch に変更（Play ストア誤爆を抑制）
- README に Firefox をデフォルトにする手順・Discover 対策を追加
- iSPEED Deep Link 調査メモを追加
```

---

## English（en-US）※併記推奨

### Name

```
T-Kong
```

### Summary

```
Unofficial helper that saves Nikkei article titles on-device and helps find the same story in Rakuten Securities’ Nikkei Telecon. No login automation or paywalled body capture.
```

### Description

```markdown
**Unofficial** Firefox for Android extension. It saves on-device clues from a Nikkei Digital article page and helps you find the **same article** in Rakuten Securities’ Nikkei Telecon—if you already have legitimate access.

Not affiliated with Nikkei or Rakuten Securities.

## Features
- “Read in Telecon” button on nikkei.com article pages
- Stores title/metadata in **local browser storage only** (no T-Kong server)
- Optionally prompts opening the iSPEED app (no authentication by the add-on)
- Helps Telecon title search / open matching headlines (each step can be disabled)
- Auto-agree on the consent screen is **off by default** (opt-in)

## Non-goals
- No login automation; no passwords, cookies, or SSO tokens
- No capture of paywalled article bodies
- Cannot invent articles that Telecon does not carry

## Permissions
- `storage` only

Use at your own risk and follow each service’s terms.
Homepage: https://ayamoke.github.io/T-Kong/
```

### Privacy Policy（English）

```markdown
## Data we store
Only on-device in browser.storage.local, for article matching:

- article id, title, URL, capture time

Nothing is sent to a T-Kong server. Pending data expires after about 24 hours.

## Data we do not collect
- Brokerage / Nikkei credentials
- Cookies or SSO tokens
- Paywalled article body text

## Network
No T-Kong backend. Only normal HTTPS traffic to sites you visit (Nikkei, Rakuten, Telecon).

## Permission
- storage only

Contact: https://github.com/AyaMoke/T-Kong/issues
```

---

## 提出チェックリスト

1. Visibility を **Listed on addons.mozilla.org**（全公開）に変更／選択
2. 上記 Summary / Description / Privacy Policy を入力（ja + en 推奨）
3. Homepage / Support URL を設定
4. Notes for Reviewers を必ず入れる（ログイン代行ではない旨）
5. スクリーンショット（推奨）
   - nikkei.com の「テレコンで読む」ボタン
   - 設定画面
   - テレコン側の「保存記事を開く」（可能なら）
6. `data_collection_permissions: none` と listing の説明が一致していること
7. ソースは GitHub Release の zip / リポジトリを示せるようにする

### スクリーンショット用キャプション例

```
日経電子版の記事ページに「テレコンで読む」を表示
```

```
設定で自動化のオン／オフを切り替え（許諾の自動同意は初期オフ）
```

```
テレコン側で保存タイトルの検索・オープンを補助
```
