# iSPEED Deep Link / Intent 調査メモ

## 調査環境

| 項目 | 値 |
| --- | --- |
| 調査日 | 2026-08-21 |
| 端末 | Pixel 10 Pro（USB、シリアルは記録しない） |
| Android | 17 |
| package | `jp.co.rakuten_sec.ispeed` |
| iSPEED version | `11.7.0`（versionCode `235`） |
| 取得元 | `adb shell dumpsys package` → `docs/ispeed-package.txt` |
| 補足 | base.apk を一時 pull し `aapt dump xmltree` / 文字列検索のみ（認証ロジック解析なし）。APKはリポジトリに含めない |

### 制約どおり実施していないこと

- 認証回避 / ID・パスワード / Cookie / SSO 取得
- TLS復号 / Frida / 改変 / root前提解析
- 注文・売買・入出金系Deep Linkの起動試験
- T-Kong本体コードの変更

---

## 確認した Activity（VIEW / Deep Link関連）

### SplashActivity（`jp.co.rakuten_sec.ispeed/.SplashActivity`）

```text
exported: 実質外部から起動可（Resolverに登録）
Actions: android.intent.action.VIEW / MAIN
Categories: DEFAULT, BROWSABLE（一部）, LAUNCHER
```

主な scheme `ispeed`:

| Authority | Path | 用途推定 |
| --- | --- | --- |
| `launch` | （なし） | アプリ起動 |
| `stock` | `/detail` | 銘柄詳細 |
| `mynumber` | `/register` | マイナンバー（非対象） |
| `market` | `/indices`, `/detail` | マーケット系 |

### AppIndexingActivity（`.../.AppIndexingActivity`）

```text
Actions: VIEW
Categories: DEFAULT, BROWSABLE
```

`ispeed`（注文系・**起動試験しない**）:

- `us_stk` `/detail`
- `order` `/us_stk/buy`, `/us_mgn/new`
- `order_top` `/jp`
- `order_list` `/us_stk`, `/us_mgn`
- `order_detail` `/us_stk`

`https` + host `www.rakuten-sec.co.jp`:

| Path | 用途推定 |
| --- | --- |
| `/smartphone/market/info/pagecontent` | マーケット情報 |
| `/web/market/`（LITERAL） | マーケット |
| `/web/market/data/` | マーケットデータ |
| `/web/market/search/quote.html` | 検索 |
| `/web/market/search/result.html` | 検索結果 |
| `/web/market/news/` | ニュース |
| `/web/market/ranking/` | ランキング |

### InterstitialActivity

```text
Scheme: ispeed
Authority: app, browser
Categories: DEFAULT（BROWSABLEなし）
```

ブラウザ／アプリ間の中間画面と推定。日経テレコン専用ではない。

### PasskeyCallbackActivity

```text
Scheme: fido2-callback
Authority: complete
```

認証コールバック。起動試験しない。

### Domain verification

```text
www.rakuten-sec.co.jp → Selection state: Disabled
```

→ https App Link は OSデフォルトで iSPEED に自動割当されていない（ブラウザ側に流れやすい）。

---

## Deep Link 候補一覧

| 候補 | scheme | host | path | Activity | BROWSABLE | 備考 |
| --- | --- | --- | --- | --- | --- | --- |
| `ispeed://launch` | ispeed | launch | - | SplashActivity | yes | 起動 |
| `ispeed://market/indices` | ispeed | market | /indices | SplashActivity | yes | **有望（マーケット）** |
| `ispeed://market/detail` | ispeed | market | /detail | SplashActivity | yes | マーケット詳細系 |
| `ispeed://stock/detail` | ispeed | stock | /detail | SplashActivity | yes | 銘柄 |
| `https://www.rakuten-sec.co.jp/web/market/` | https | www.rakuten-sec.co.jp | /web/market/ | AppIndexingActivity | yes | ドメイン検証 Disabled |
| `https://www.rakuten-sec.co.jp/web/market/news/` | https | www.rakuten-sec.co.jp | /web/market/news/ | AppIndexingActivity | yes | 同上 |
| `ispeed://nikkei` / `ispeed://telecon` | - | - | - | - | - | **query 結果: No activities** |
| `ispeed://order/...` 等 | ispeed | order* | ... | AppIndexingActivity | yes | **注文系・非対象** |

APK文字列には内部ルートらしきキーが存在:

- `MENU_TELECON`
- `market:news:telecom:news`
- `setting:menu:telecom:news`
- `NEWS_TELECOM`
- `MYPAGE_MARKET_TODAY_TELECOM`
- `today:mypage:telecom:news`

→ **アプリ内ナビゲーション用**であり、外部向け `ispeed://...telecon...` Intent Filter としては **未公開／未登録**。

---

## query-activities 結果

| URL | 解決先 |
| --- | --- |
| `ispeed://launch` | SplashActivity |
| `ispeed://market/indices` | SplashActivity |
| `ispeed://market/detail` | SplashActivity |
| `https://www.rakuten-sec.co.jp/web/market/` | AppIndexingActivity + Firefox |
| `https://www.rakuten-sec.co.jp/web/market/news/` | AppIndexingActivity + Firefox |
| `ispeed://nikkei` | **No activities** |
| `ispeed://telecon` | **No activities** |
| `ispeed://news` | **No activities** |

---

## 起動テスト結果（閲覧系のみ）

| 入力 | 起動後の top Activity（観測） | 表示の解釈 |
| --- | --- | --- |
| `ispeed://launch` | `SplashActivity` | 起動／スプラッシュ（ログインゲート含む） |
| `ispeed://market/indices` | 数秒後 `MarketTabActivity` | **マーケットタブまで到達を確認** |
| `https://.../web/market/`（通常） | Firefox | ドメイン検証 Disabled のためブラウザ優先 |
| `https://.../web/market/`（`-p ispeed`） | Bitwarden / Credential UI が前面に出る場合あり | セッション／パスキー介入。安定してマーケット直結とは言えない |
| `ispeed://browser` / `ispeed://app` | Credential / Bitwarden 等が前面 | テレコン直結ではない |

注文系（`ispeed://order...`）は **未実施**。

---

## 実UI上の日経テレコン位置（ユーザー確認）

```text
右下メニュー
  → マーケット（市況 / ニュース / ランキング）
      → ★ 日経テレコン（その下のボタン）
```

`ispeed://market/indices` で開いた `MarketTabActivity`（指数／市場タブ）は、**このメニュー一覧そのものではない**。
テレコン入口は「市場タブの中の1ボタン」ではなく、**右下メニュー → 市場セクション内**の項目。

APK内の対応しそうな内部キー（外部Intentではない）:

| キー | 意味の推定 |
| --- | --- |
| `setting:menu:telecom:news` | メニュー経由のテレコン |
| `MENU_TELECON` | メニュー項目 |
| `menu_title_nikkei` | メニュー表示名まわり |
| `smt_homeid_nikkei_telecom` | スマホWeb／ホーム遷移ID |
| `market:news:telecom:news` | 市場ニュース系の内部ルート |
| `telecom_btn` / `telecon_icon` | UIリソース |

推測URIの query 結果（いずれも **No activities**）:

- `ispeed://market/news`
- `ispeed://market/ranking`
- `ispeed://market/telecom` / `ispeed://market/telecon`
- `ispeed://setting/menu/telecom`

---

## 日経テレコンへの直接遷移

### 判定: **C 寄り（アプリ起動〜市場周辺まで。テレコンボタン直下までは不可）**

- **A（テレコン直通）:** 不可。メニューの「日経テレコン」相当の外部 Deep Link は無い。
- **B（そのメニュー画面／テレコン直前まで）:** **未確認／実質不可に近い。** `MarketTabActivity` 到達はあるが、右下メニュー→市場の一覧（ニュース／ランキングの下）ではない。
- **C:** `ispeed://launch` / `ispeed://market/indices` でアプリ（〜市場タブ）起動は可能。その後は従来どおり手動。
- **D:** Deep Link が全く無いわけではない（起動・市場タブ用はある）。

---

## T-Kongへの採用可否

| 方式 | 採用判断 |
| --- | --- |
| メニュー「日経テレコン」直通 Deep Link | **不可（未発見）** |
| `ispeed://launch` | **採用済み（0.3.4）**。Play ストア誤爆を避ける起動 URL |
| `ispeed://market/indices` | **短縮効果は限定的**（市場タブ止まりで、目的のメニュー項目ではない） |
| `https://www.rakuten-sec.co.jp/web/market/news|ranking/` | ニュース／ランキングWeb向け。メニューのテレコンボタンではない |
| 内部キー `setting:menu:telecom:news` 等 | 外部 Intent ではないため **採用不可** |

### 現実的な手動フロー（現状の正）

```text
T-Kong → iSPEED起動（ispeed://launch）
↓
（必要ならログイン）
↓
右下メニュー → マーケット → 日経テレコン
↓
ブラウザ表示確認 → Firefox
```

### 残る手動操作

- ログイン（未ログイン時）
- 右下メニュー → マーケット → 日経テレコン
- 「ブラウザで表示しますか？」→ はい

---

## 次のアクション

1. ~~起動 Intent を `ispeed://launch` に変更~~ → **0.3.4 で実装済み**
2. 実機で「テレコンで読む」後に Play ストアへ飛ばないことを再確認
3. それ以上の自動化は Accessibility 等の別手段検討（今回は実装しない）

---

## 付録: 再調査コマンド

```powershell
$adb = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
$d = "<DEVICE_ID>"
& $adb -s $d shell dumpsys package jp.co.rakuten_sec.ispeed > docs/ispeed-package.txt
& $adb -s $d shell cmd package query-activities --brief -a android.intent.action.VIEW -d "ispeed://market/indices"
& $adb -s $d shell am start -a android.intent.action.VIEW -d "ispeed://market/indices"
```
