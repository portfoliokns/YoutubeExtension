# このアプリケーションについて
これはyoutubeの動画を視聴する際に視聴者の手助けとなる機能を搭載したChrome専用の拡張機能です。機能は以下の通りです。
- フィルタリング機能
  - 暗くてわかりずらい動画を明るくすることで視聴しやすくなります。
  - 動画に緊迫感を演出させながら視聴することができます。
- 上下反転機能
  - 何度も見た動画を反転させて視聴することで、新たな感覚で視聴することができます。
- コントロール表示/非表示機能
  - 余計なオブジェクトを非表示にして、画面全体を綺麗に視聴することができるようになります。
  - PCの画面キャプチャ機能を使用すれば、余計なオブジェクトが入らず、動画を綺麗にキャプチャすることができます。（途中で広告動画が入らないようにするためにはYouTube Premiumに参加してください）
- 画像保存
  - 動画の緊迫した一瞬やお気に入りの場面を画像として保存することができます。
  - "フィルタリング機能"を用いれば、綺麗な一枚の画像を保存することができます。
  - "上下反転機能"を用いれば、反転させた状態の画像を保存することができます。

※状況に応じて、機能をアップデートしていく予定です。

この拡張機能を導入すると、一部デザインやその挙動が変更されます。詳しくは"免責事項"を確認してください。

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

## 上下反転機能
- "左右反転"をクリックすると、動画を左右反転で視聴できるようになります。もう一度、"左右反転"をクリックすると、反転が元に戻ります。
- "上下反転"をクリックすると、動画を上下反転で視聴できるようになります。もう一度、"上下反転"をクリックすると、反転が元に戻ります。

## コントロール表示/非表示機能
- "コントロール非表示"をクリックすると、動画上にあるオブジェクトが非表示となります。
- 非表示となる項目は、"再生ボタン、音量調整、全画面表示ボタンなどの制御盤","動画の最後に表示される情報カード","カーソルを当てると表示される影"となります。
- "コントロール表示"をクリックすると、動画上にあるオブジェクトが再び表示されます。

## 画像保存
- 撮影したいシーンで動画を停止してください。
- "YouTube動画拡張"をクリックすると、ポップアップが開きます。
- 必要に応じて"フィルタリング機能","上下反転機能"でフィルタリングしてください。
- キャプチャボタンを押すとそのシーンの画像（png）をダウンロードすることができます。
- 動画の画質が高ければ、画像の画質も高くなります。なおその分画像ファイルの容量も大きくなります。

## リセット機能
- リセットボタンを押すと、"フィルタリング機能","上下反転機能","コントロール表示/非表示機能"の設定が初期化されます。

## 注意事項
- 視聴している動画から別の動画のページに移動した場合、"フィルタリング機能","上下反転機能","コントロール表示/非表示機能"が初期化されます。
- 動画視聴の途中で、YouTube公式の広告動画が開始された場合、"フィルタリング機能","上下反転機能","コントロール表示/非表示機能"が初期化されます。
- 不具合などの影響で機能しない場合は、ブラウザをリロードしなおしてください。

# 免責事項
- この拡張機能はGitHub上で公開されています。この拡張機能を使用したことにより発生した被害や損害について、このアプリの開発者は一切関与致しません。
- この拡張機能を導入した場合、機能を適応させるにあたり、一部デザイン（動画にカーソルを当てた際に出現する影）が変更されます。そのため、通常のYouTubeのページと異なったデザインや挙動となります。
- YouTubeページ側の仕様変更や運営方針の変更などにより、正しく拡張機能が起動しなくなる場合があります。
