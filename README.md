# ts-react-template

React + TypeScript + Vite を使用した開発のためのテンプレートリポジトリです。すぐに開発を始められるように必要な設定が整っています。

## 概要

このテンプレートは以下の技術スタックを使用しています：

- **React** - UIライブラリ
- **TypeScript** - 静的型付け
- **Vite** - 高速な開発環境とビルドツール ([公式サイト](https://ja.vitejs.dev/))
- **React Router** - ページナビゲーション ([チュートリアル](https://reactrouter.com/en/main/start/tutorial))
- **Material UI (MUI)** - UIコンポーネントライブラリ ([公式サイト](https://mui.com/))

## 始め方

### 前提条件

- [Node.js](https://nodejs.org/) (LTS版を推奨)
- [npm](https://www.npmjs.com/) (Node.jsに同梱) または [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

### リポジトリのクローン

```bash
git clone https://github.com/Buntamatsushita/ts-react-template.git
cd ts-react-template
```

### 依存関係のインストールと開発サーバーの起動

```bash
# 依存関係のインストール
npm install
# または、yarn を使用する場合
# yarn install

# 開発サーバーの起動
npm run dev
# または、yarn を使用する場合
# yarn dev
```

開発サーバーが起動したら、ブラウザで `http://localhost:5173` (Viteのデフォルトポート) にアクセスしてアプリケーションを確認できます。

## 主な設定ファイル

- `vite.config.ts`: Viteの設定ファイル。プラグインの追加やビルドオプションのカスタマイズが可能です。
- `tsconfig.json`: TypeScriptのコンパイラオプションを設定します。
- `package.json`: プロジェクトの依存関係やスクリプトを定義します。
- `.eslintrc.cjs`: ESLintの設定ファイル。コードの静的解析ルールを定義します。

## ディレクトリ構成

```
.
├── public/          # 静的アセット (ビルド時にそのままコピーされる)
├── src/
│   ├── assets/      # 画像などのアセット
│   ├── components/  # 再利用可能なReactコンポーネント
│   ├── pages/       # 各ページのコンポーネント
│   ├── types/       # TypeScriptの型定義
│   ├── App.tsx      # アプリケーションのルートコンポーネント (ルーティング設定など)
│   └── main.tsx     # アプリケーションのエントリーポイント
├── index.html       # HTMLのテンプレート
├── package.json
├── README.md        # このファイル
└── vite.config.ts
```

## スクリプト

- `npm run dev`: 開発モードでViteサーバーを起動します。
- `npm run build`: 本番用にプロジェクトをビルドします (`dist` フォルダに出力)。
- `npm run lint`: ESLintを実行してコードの静的解析を行います。
- `npm run preview`: ビルド成果物をローカルでプレビューします。

## ライブラリ

このテンプレートには、以下の主要なライブラリが事前に導入されています。

- **@mui/material**: Material Design に準拠したUIコンポーネントを提供します。
- **@emotion/react**, **@emotion/styled**: CSS-in-JS ライブラリで、MUIのスタイリングに使用されます。
- **react-router-dom**: クライアントサイドルーティングを実現します。
- **notistack**: 通知（スナックバー）を簡単に表示するためのライブラリです。
- **uuid**: UUIDを生成するためのライブラリです。

### ライブラリの追加例 (MUI)

Material UI は既に `package.json` に含まれていますが、手動でインストールする場合は以下のコマンドを実行します。

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

#### MUIの基本的な使い方

`src/main.tsx` でテーマプロバイダーを設定し、各コンポーネントでMUIのコンポーネントを利用できます。

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // 必要に応じてグローバルCSSをインポート
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// カスタムテーマの定義 (任意)
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // 例: 青系のプライマリカラー
    },
    secondary: {
      main: '#dc004e', // 例: ピンク系のセカンダリカラー
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* MUIのベースラインCSSを適用 */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
```

コンポーネントでの使用例 (`src/pages/HomePage.tsx` など):

```tsx
import { Button, Typography, Container, Box } from '@mui/material';

function HomePage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ようこそ！
        </Typography>
        <Button variant="contained" color="primary">
          はじめる
        </Button>
      </Box>
    </Container>
  );
}

export default HomePage;
```

## コントリビューション

バグ報告や機能改善のプルリクエストを歓迎します。

## ライセンス

このプロジェクトは [MIT License](LICENSE) のもとで公開されています。
