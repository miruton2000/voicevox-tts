# VOICEVOX TTS

[VOICEVOX](https://voicevox.hiroshiba.jp/)を利用してテキスト読み上げ (TTS: Text To Speech) を行うDiscord Bot

## Require

- Node.js v22
- VOICEVOX Engine (実行ファイル)

※ v22より新しいバージョンでは`@discordjs/opus`のインストールでこけるので注意

Windows以外の環境では動作確認を行っていないのであしからず

## Install

### 1. VOICEVOX Engine の導入

[voicevox_engine::Releases](https://github.com/VOICEVOX/voicevox_engine/releases)からエンジンをダウンロードし、`voicevox-engine`としてリポジトリ直下へ配置

フォルダ構成例:

```text
voicevox-tts (root)
  - src
  - .gitignore
  - package.json
  - ...etc
  - voicevox-engine <- windows-cpuとかになっているのでリネームする
    - run.exe <- voicevox-engine直下にrun.exeがあることを確認
    - ...etc
```

### 2. `.env`をリポジトリ直下へ作成

`.env`記述例:

```.env
DISCORD_TOKEN=your-discord-token # 必須 : BotのDiscord Token 
OWNER_ID=your-user-id # 必須 : TTSを行いたいユーザーのID
ENGINE_PORT=port-number # 任意 : VOICEVOX Engineのポート番号 (default: 50021)
```

〇 `OWNER_ID`の取得方法

- ユーザー設定 -> 詳細設定 -> 開発者モード をオンにする
- 自分のアイコンをクリック -> ユーザーIDをコピーを選択

### 3. アプリケーションの実行

```bash
# 依存関係のインストール (初回のみ)
npm install 

# Botの起動 (使いたいときに毎回実行)
npm run do
```

## Usage

### 1. BotをDiscordサーバへ招待する

- Discord開発者ページからApplicationを作成 (すでにある場合はそれを選択)
- Botのページで`Presense Intent`, `Server Members Intent`, `Message Content Intent`をそれぞれオンにする
- OAuth2のページで`OAuth2 URL Generator`から`bot`を選択
- `Bot Permissions`から`Send Messages`, `Read Message History`, `Connect`, `Speak`をオンにする
- `Generated URL`をコピーし、自分のサーバへ招待するならそれを開いて、追加したいサーバを選択。自分のサーバでない場合は管理者にリンクから追加してもらうようお願いする

### 2. ボイスチャットへ追加する

- `npm run do`でbotを起動する
- ボイスチャットへ参加する
- 参加したボイスチャンネル内のテキストチャンネルで`!join`を実行するとbotが入ってくる
- その状態でテキストチャンネルへ書き込みを行うと、書き込んだ内容が読み上げられる

### 3. ボイスチャットからの退出

- `!leave`でbotを退出させることが出来る
- botが起動しているターミナルで`Ctrl + C`を実行するとbotが終了する (この時、botを退出させていない場合は時間がたつと勝手に抜ける)

## 仕組みの話

[VOICEVOX Engine](https://github.com/VOICEVOX/voicevox_engine)をnodeからChildProcessとしてバックグラウンドで起動し、Discord.js (@discordjs/voice) を介して音声データを転送している

## Reference

- [VOICEVOX Engine](https://github.com/VOICEVOX/voicevox_engine)
- [Discord.js](https://github.com/discordjs/discord.js)
- [@discordjs/voice](https://github.com/discordjs/discord.js/tree/main/packages/voice)
