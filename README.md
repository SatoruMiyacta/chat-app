# chat-app 　

## はじめに

---

**背景**

日常で一番使っているチャットアプリがどう動いているかを知りたかった

**目的**

アカウント認証やメッセージ送信など、チャットアプリの機能を作りながら理解する

**アプリケーションの概要**

アカウント認証機能を有した、リアルタイムチャットアプリ。

## 環境

---

**ハイレベルアーキテクチャ図**

![ハイレベルアーキテクチャ](https://user-images.githubusercontent.com/89257064/225568391-11a32b52-ff54-40a9-9797-2f7865c3b66f.png 'ハイレベルアーキテクチャ')

**アプリケーション機能一覧**

## デモ

---

**アプリ URL**

[Chat]]("Chat")

**テストアカウント**

メールアドレス：
パスワード：

## アプリを作る上でのこだわり　

- 環境構築

  - 本番環境と開発環境作成

    - 本番環境に直接変更を加えるとバグが発生した際にサービスに悪影響をもたらす。本番環境とは別に開発環境があることで万が一バグが発生してもサービスに影響なく開発することができる。

  - CI/CD を用いて構文チェック、テスト、ビルド、デプロイを自動化した

    - 手動で構文チェックやテストを行うと書き換えた部分しか確認しないためバグの発生に気づけないことがある。一方で自動化するとデプロイまでに毎回全てのコードをテストしているためデプロイ前にバグを見つけることができる。他にも開発スピードが上がり、コードの一貫性も担保される。

  - 新しいビルドツールである Vite を使用

    - 従来のビルドツールはプロジェクト規模が大きくなるほどバンドル処理に時間がかかっていていた。しかし、Vite は修正や変更が加えられたソースだけをコンパイルしてブラウザで読み込んでいるためプロジェクトの起動や更新を高速で行うことができ、開発スピードが上がる。

  - Firebase を使用
    - バックエンドの管理と保守全般を Firebase で担い、フロントエンドに集中して開発を行うことができる。また、Firebase にはデータベース、認証、ホスティング等に無料枠があり、コストがかからず開発時間を十分に取れるため内容を理解して開発できる.

## 環境変数

.env
| key | value |
| - | - |
| VITE_SLACK_WEBHOOK_URL | slack の webhook |
| | |

.env.development

| key                      | value                                      |
| ------------------------ | ------------------------------------------ |
| VITE_API_KEY             | AIzaSyDy0OiER8cpLuV0HcYaZuIK37B3k3Tt7KE"   |
| VITE_AUTH_DOMAIN         | chat-app-dev-3baa1.firebaseapp.com"        |
| VITE_PROJECT_ID          | chat-app-dev-3baa1"                        |
| VITE_STORAGE_BUCKET      | gs://chat-app-dev-3baa1.appspot.com"       |
| VITE_MESSAGING_SENDER_ID | 176954607089"                              |
| VITE_APP_ID              | 1:176954607089:web:8db23c6a70be4fd4ab3050" |
|                          |                                            |

.env.production

| key                      | value                                      |
| ------------------------ | ------------------------------------------ |
| VITE_API_KEY             | AIzaSyAj2derqHXZCLOOrJWVNc3XAcRBgwgSW1s"   |
| VITE_AUTH_DOMAIN         | chat-app-1d2fe.firebaseapp.com"            |
| VITE_PROJECT_ID          | chat-app-1d2fe"                            |
| VITE_STORAGE_BUCKET      | chat-app-1d2fe.appspot.com"                |
| VITE_MESSAGING_SENDER_ID | 334251054968"                              |
| VITE_APP_ID              | 1:334251054968:web:ee3890cefc605cb309da8d" |
|                          |                                            |

.env.test

| key                      | value                                      |
| ------------------------ | ------------------------------------------ |
| VITE_API_KEY             | AIzaSyDy0OiER8cpLuV0HcYaZuIK37B3k3Tt7KE"   |
| VITE_AUTH_DOMAIN         | chat-app-dev-3baa1.firebaseapp.com"        |
| VITE_PROJECT_ID          | chat-app-dev-3baa1"                        |
| VITE_STORAGE_BUCKET      | gs://chat-app-dev-3baa1.appspot.com"       |
| VITE_MESSAGING_SENDER_ID | 176954607089"                              |
| VITE_APP_ID              | 1:176954607089:web:8db23c6a70be4fd4ab3050" |
|                          |                                            |

## ファイル・ディレクトリ構成

- **public/**
  - **css/**
    - **reset.css** - デフォルトのスタイルを打ち消す css  
      （例）ul {list-style-type: none;}
    - **common.css** - 複数回使用する共通の css  
       （例）.inner {padding-right: 16px;
      padding-left: 16px;}
  - **images/**
    - 画像を入れる場所
- **src/**
  - **components/**
    - **atoms/**
      - 機能、役割でこれ以上分割できないもの  
        （例）ボタン、チェックボックス
      - ２ファイル以上で利用するもの
      - ドメインを持たないもの
    - **molecules/**
      - atoms フォルダに 1 つ以上依存しているもの  
        （例）モーダル、メニュー
      - ２ファイル以上で利用するもの
      - ドメインを持たないもの
    - **organisms/**
      - componets 配下の organisms 以外に該当しないもの  
        （例）アバター、ヘッダー
      - ドメインを持つもの
    - **pages/**
      - URL とリンクしたページ  
        （例）ログイン画面、アカウント作成画面
  - **constants/**
    - 複数回使用する定数  
      （例）const INITIAL_ICON_URL = '/images/user-solid.svg'・・・初期設定のアバターアイコン URL
  - **features/**
    - pages コンポーネントの関数や変数など関連する機能のまとまり  
      （例）signIn()・・・アカウントにサインインする関数
  - **hooks/**
    - 複数回使用する関数や変数など関連する機能のまとまり  
      （例）getUser()・・・ユーザーデータのキャッシュが新しければグローバル state からデータ取得、古ければ firestore からデータを取得する関数
  - **provider/**
    - ログイン後最初にレンダリングされるコンポーネント  
      （例）AuthProvider()・・・ログイン認証を監視するコンポーネント
  - **store/**
    - グローバルステートを入れる場所  
      （例）const usersAtom = atom<Users>({})・・・ユーザー情報を管理するステート
  - **stories/**
    - 共通するコンポーネントのカタログ  
      （例）Button.stories.tsx・・・ボタンコンポーネントのカタログ
  - **utils/**
    - 複数回使われている関数  
      （例）fetchUserData()・・・firestore からユーザー情報を取得し、ユーザーデータを返す関数
  - **App.tsx**
  - **main.tsx**
- **tests/**
  - **rules**
    - セキュリティルールのテスト
  - **utils**
    - utils のテスト
