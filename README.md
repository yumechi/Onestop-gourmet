# ワンストップ　食

料理はエンジニアリングだ！

人が活きていく上で欠かせないのは食事です。

食事といっても、料理(自炊)、冷凍食品やテイクアウトをはじめとした「中食」、外食もありますね。

自炊するうえでのテクニック的なもの、美味しいお店の探し方などもあります。


こういった調理器具もよいぞ、といった話もアリですね！

そういった「食」に関する本です。


## 前提

* [Node.js](https://nodejs.org/en/)

## install

```sh
npm i
```

VFM(Vivliostyle flavored markdown)のパッケージが必要です。

bun install @vivliostyle/vfm

playwrightが入ってないエラーが出ることもある？

npx playwright install

## 本を作成

本を作成するコマンドは `npm run build` と `npm run build:print` です。

```sh:オンラインで使う前提のカラーPDFを作成するコマンド
npm run build
```

```sh:印刷対応の、なるべく白黒に寄せたPDFを作成するコマンド
npm run build:print
```

## プレビュー

```sh
npm run preview
```

## ライセンス

* `src/*` は原稿ファイルと画像ファイルなのでオープンソースとしてのライセンスは付与しません。
* サンプルコードは普通に使っていただいてかまいません
* それ以外のファイルはMIT Licenseのもと使っていただいてかまいません。設定ファイルには筆者の名前や、この本のタイトルなどが書かれいているためご自身の物に書き換えることは忘れないでください。

### 使用しているフォントのライセンス

License: SIL Open Font License, Version 1.1.

* https://github.com/microsoft/cascadia-code
* https://github.com/IBM/plex
* https://github.com/trueroad/HaranoAjiFonts
