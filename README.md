# contents-chat-app (仮)

このプロジェクトは、読んだ本、観た映画やアニメなどの作品情報を記録し、それらの作品についてAI（Gemini）とチャット形式で感想を語り合えるWebアプリケーションです。

React, TypeScript, Vite を使用して構築されており、UIには Material UI (MUI) を採用しています。

## 機能

*   **作品情報の登録・一覧・編集・削除 (CRUD)**
    *   タイトル、カテゴリ、読了日/視聴日、著者/制作者、メモなどを記録できます。
*   **作品ごとのAIチャット機能**
    *   登録した作品について、Google の Gemini API を利用したAIとチャットで会話できます。
    *   （将来的には、ユーザー間のチャット機能も検討）
*   **レスポンシブデザイン**
    *   PC、スマートフォン、タブレットなど、様々なデバイスで快適に利用できます。
*   **ローカルストレージへのデータ保存**
    *   登録した作品情報はブラウザのローカルストレージに保存されます。

## 使用技術

*   **フロントエンド:**
    *   React 18
    *   TypeScript
    *   Vite
    *   React Router v6
    *   Material UI (MUI)
    *   Notistack (通知スナックバー)
*   **AIチャット:**
    *   Google AI JavaScript SDK (`@google/generative-ai`)
    *   Gemini API
*   **開発ツール:**
    *   ESLint, Prettier (コードフォーマット、静的解析)
    *   Volta (Node.js バージョン管理 - 推奨)

## セットアップと実行方法

1.  **リポジトリのクローン:**
    ```bash
    git clone https://github.com/shun-god/ts-react-template.git
    cd ts-react-template
    ```

2.  **Node.js の準備:**
    [Volta](https://volta.sh/) の使用を推奨します。
    ```bash
    # Voltaをインストールしていない場合はインストール
    # Voltaで指定のNodeバージョンをインストール・使用 (package.jsonのvolta設定を参照)
    volta install node # プロジェクトのvolta設定に基づいてインストールされます
    ```
    または、プロジェクトで指定されているNode.jsのバージョン（例: `v20.x.x`）を手動で準備してください。

3.  **依存関係のインストール:**
    ```bash
    npm install
    ```

4.  **環境変数の設定:**
    プロジェクトのルートディレクトリに `.env` ファイルを作成し、以下の内容を記述してください。
    ```env
    VITE_GEMINI_API_KEY=あなたのGoogle_AI_Studioで取得したAPIキー
    ```
    APIキーは [Google AI Studio](https://aistudio.google.com/app/apikey) などで取得してください。

5.  **開発サーバーの起動:**
    ```bash
    npm run dev
    ```
    ブラウザで `http://localhost:5173` を開くと、アプリケーションが表示されます。

## 今後の展望 (TODO)

*   ユーザー認証機能の追加
*   会話ログが残るようにする
*   データベースへのデータ永続化 (Google Cloudなど)
*   作品検索・フィルタリング機能
*   会話中に検索やURLの参照ができるようにする(URL Context、グラウンディング)


## ライセンス

このプロジェクトのライセンスは未定です

---

_このプロジェクトは [Buntamatsushita/ts-react-template](https://github.com/Buntamatsushita/ts-react-template) をベースに開発されました。_
