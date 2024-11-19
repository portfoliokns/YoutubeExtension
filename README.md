# このアプリケーションについて
これはyoutubeの動画を視聴する際に視聴者の手助けとなる機能を搭載したChrome専用の拡張機能です。機能は以下の通りです。
- フィルタリング機能
- 画像保存

※状況に応じて、機能をアップデートしていく予定です。

# 事前準備
## Google Chromeをインストールしてください
ほとんどの方がChromeを使用していると思うので、インストール手順は省略。

## 拡張機能のファイルをダウンロード
以下のコマンドを実行し、YoutubeExtensionをクローンしてください。
```
git clone https://github.com/portfoliokns/YoutubeExtension.git
```

「YoutubeExtension」フォルダの中に、以下のファイルがあればダウンロード完了となります。
- manifest.json
- content.js
- popup.html
- popup.css
- popup.js

## 拡張機能のインストール
1. Google Chromeを開いて、「設定 > 拡張機能」を開いてください。
2. 「デベロッパー モード」のチェックをONにしてください。
3. 「パッケージ化されていない拡張機能を読み込む」をクリックしてください。
4. 先ほどダウンロードした「YoutubeExtension」フォルダを選択してください。
5. 「すべての拡張機能」の中に、"YouTube動画拡張"が追加されていることを確認してください。
6. 拡張機能一覧から"YouTube動画拡張"を見つけ、ピン留めをしてください。

# 使い方
あらかじめ視聴したい動画のYouTubeページを開いておいてください。
## フィルタリング機能
- "YouTube動画拡張"をクリックすると、ポップアップが開きます。
- ポップアップのスライダーを動かすと、その項目に応じて動画がフィルターされます。
- リセットボタンを押すと、フィルターの値が初期値に戻り、動画のフィルターも解除されます。
- 不具合などの影響で機能しない場合は、ブラウザをリロードしなおしてください。
## 画像保存
- 撮影したいシーンで動画を停止してください。
- "YouTube動画拡張"をクリックすると、ポップアップが開きます。
- 必要に応じてフィルタリング機能でフィルタリングしてください。
- キャプチャボタンを押すとそのシーンの画像（png）をダウンロードすることができます。
- 不具合などの影響で機能しない場合は、ブラウザをリロードしなおしてください。
- 動画の画質が高ければ、画像の画質も高くなります。なおその分画像ファイルの容量も大きくなります。

# 免責事項
- この拡張機能はGitHub上で公開されています。この拡張機能を使用したことにより発生した被害や損害について、このアプリの開発者は一切関与致しません。
