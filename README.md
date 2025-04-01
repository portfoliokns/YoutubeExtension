# このアプリケーションについて

これは youtube の動画を視聴する際に視聴者の手助けとなる機能を搭載した Chrome 専用の拡張機能です。機能は以下の通りです。

- 擬似クリップ機能
  - 「擬似クリップ」とは YouTube 公式のクリップ機能とは異なり、スクリプトを用いて擬似的にクリップ機能を実現する機能です。
  - YouTube 公式の「クリップ機能」と名称や機能を差別化させるため、「擬似クリップ」と呼んでいます。
  - 擬似クリップでは、YouTube の動画の特定の区間を何度も視聴したい場合に使用できます。
  - 擬似クリップの情報を保存できます。ただし外部システムとの連携が必要となるので、"LocalTube"をインストールし、設定してください。
- フィルタリング機能

  - 暗くてわかりずらい動画を明るくすることで視聴しやすくなります。
  - 動画に緊迫感を演出させながら視聴することができます。

- 上下反転機能

  - 何度も見た動画を反転させて視聴することで、新たな感覚で視聴することができます。

- コントロール表示/非表示機能

  - 余計なオブジェクトを非表示にして、画面全体を綺麗に視聴することができるようになります。
  - PC の画面キャプチャ機能を使用すれば、余計なオブジェクトが入らず、動画を綺麗に視聴することができます。（途中で広告動画が入らないようにするためには YouTube Premium に参加してください）

- 画像保存
  - 動画の緊迫した一瞬やお気に入りの場面を画像として保存することができます。
  - "フィルタリング機能"を用いれば、綺麗な一枚の画像を保存することができます。
  - "上下反転機能"を用いれば、反転させた状態の画像を保存することができます。

※状況に応じて、機能をアップデートしていく予定です。

この拡張機能を導入すると、一部デザインやその挙動が変更されます。詳しくは"免責事項"を確認してください。

記事は[こちら](https://my-blog-one-taupe.vercel.app/blog/fc5oscnrumh)。

# 事前準備

## Google Chrome をインストールしてください

ほとんどの方が Chrome を使用していると思うので、インストール手順は省略。

## 拡張機能のファイルをダウンロード

GitHub から拡張ファイルをダウンロードしてください。

または以下のコマンドを実行し、YoutubeExtension をクローンしてください。

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

1. Google Chrome を開いて、「設定 > 拡張機能」を開いてください。
2. 「デベロッパー モード」のチェックを ON にしてください。
3. 「パッケージ化されていない拡張機能を読み込む」をクリックしてください。
4. 先ほどダウンロードした「YoutubeExtension」フォルダを選択してください。
5. 「すべての拡張機能」の中に、"YouTube 動画拡張"が追加されていることを確認してください。
6. 拡張機能一覧から"YouTube 動画拡張"を見つけ、ピン留めをしてください。

## LocalTube のインストール

設定等は[LocalTube の ReadMe](https://github.com/portfoliokns/LocalTube)をご確認ください。

# 使い方

あらかじめ視聴したい動画の YouTube ページを開き、"YouTube 動画拡張"のアイコンをクリックすると、ポップアップ画面が表示されます。

## 擬似クリップ機能

- "クリップ設定を表示"をクリックすると、クリップ用の設定ボードが表示されます。
- 視聴したい区間の開始時刻、終了時刻に設定し、"クリップ適応"をクリックすると、動画に適応され、その区間の動画視聴が繰り返し行われます。
- "クリップ解除"をクリックすると、適応した設定が解除され、通常通りに動画を視聴することができます。
- "クリップ設定を閉じる"をクリックすると、クリップ用の設定ボードが閉じます。なお適応した設定は解除されません。
- 設定する開始時刻が終了時刻よりも遅い時刻を設定した場合、設定は適応されません。また不適切な文字などを入力した場合でも、設定が適応されません。
- 設定する時刻は動画の開始から終了までの間を設定してください。それ以外を設定して適応した場合、不具合を起こす可能性があります。
- 設定する時刻は、何時何分何秒何ミリ秒を設定できます。表記に"hh:mm:ss:ms"と記載しています。
- "hh:mm:ss:ms"の表記をクリックすることで、現在再生されている時刻がテキストに反映されます。
- "保存(localhost 連携)"をクリックすると、擬似クリップ情報が LocalTube に保存できます。
- 広告再生時は機能しません。

## フィルタリング機能

- "フィルター設定を表示"をクリックすると、フィルター用の設定ボードが表示されます。
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
- "YouTube 動画拡張"をクリックすると、ポップアップが開きます。
- 必要に応じて"フィルタリング機能","上下反転機能"でフィルタリングしてください。
- キャプチャボタンを押すとそのシーンの画像（png）をダウンロードすることができます。
- 動画の画質が高ければ、画像の画質も高くなります。なおその分画像ファイルの容量も大きくなります。

## リセット機能

- リセットボタンを押すと、"擬似クリップ機能","フィルタリング機能","上下反転機能","コントロール表示/非表示機能"の設定が初期化されます。

## その他

- テキストやボタンなどにフォーカスが当たっていない場合、画面上からプレーヤーを操作することができます。

  - Spage キー：動画の再生/停止
  - J キーまたは左矢印キー：動画を 5 秒戻す(広告再生時は機能しません)
  - L キーまたは右矢印キー：動画を 5 秒進める(広告再生時は機能しません)
  - I キーまたは上矢印キー：音量を上げる
  - K キーまたは下矢印キー：音量を下げる
  - 0〜9 の数字キー：数字に応じた時刻にプレーヤーを設定する

## 注意事項

- 視聴している動画から別の動画のページに移動した場合、"擬似クリップ機能","フィルタリング機能","上下反転機能","コントロール表示/非表示機能"が初期化されます。
- 動画視聴の途中で、YouTube 公式の広告動画が開始された場合、"擬似クリップ機能","フィルタリング機能","上下反転機能","コントロール表示/非表示機能"が初期化されます。
- 不具合などの影響で機能しない場合は、ブラウザをリロードしなおしてください。
- このアプリは YouTube の広告ブロッカーとしての機能を提供するものではありません。そのため広告が流れた場合、再生時間を早めるといった機能は無効となるように実装しています。ただし YouTube 側のシステム変更などに伴い、誤って機能してしまう場合があるかもしれないため、広告再生時には再生時間を早めるといった操作を行わないように努めてください。なお YouTube 側では広告ブロッカーを検知するための仕組みを実装しており、このアプリも例外なく、検知されます。

# 免責事項

- この拡張機能は GitHub 上で公開されています。この拡張機能を使用したことにより発生した被害や損害について、このアプリの開発者は一切関与致しません。
- この拡張機能を導入した場合、機能を適応させるにあたり、一部デザイン（動画にカーソルを当てた際に出現する影）が変更されます。そのため、通常の YouTube のページと異なったデザインや挙動となります。
- YouTube ページ側の仕様変更や運営方針の変更などにより、正しく拡張機能が起動しなくなる場合があります。
