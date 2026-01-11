# Repository Guidelines

## プロジェクト構成とモジュール整理
- `src/app/` に Next.js App Router のページ (`page.tsx`, ルート配下フォルダ) を配置します。
- `src/components/` は再利用 UI コンポーネントを格納します（例: `Card/`, `Layout/`, `Map/`）。
- `src/data/` にクイズ/カードの静的データを置きます。
- `src/context/` は収集状況や統計のグローバル状態を管理します。
- `src/hooks/` はカスタムフック（アクセシビリティ/モーション対応など）を置きます。
- `src/lib/` はユーティリティやヘルパー関数を置きます。
- `src/types/` は TypeScript の型定義をまとめます。
- `e2e/` は Playwright の E2E テストです。
- `public/` は静的アセットの配置先です。

## ビルド・テスト・開発コマンド
- `npm run dev`: ローカル開発サーバーを起動（`http://localhost:3000`）。
- `npm run build`: 本番ビルドを作成。
- `npm run start`: ビルド後の本番サーバー起動。
- `npm run lint`: Next.js ESLint チェック。
- `npm run validate:data`: 静的データの検証。
- `npm run test:e2e`: Playwright の E2E テストをヘッドレス実行。
- `npm run test:e2e:ui`: Playwright の UI ランナーで実行。

## コーディング規約・命名
- TypeScript + React（Next.js App Router）。コンポーネントは PascalCase、フックは `use` 接頭辞。
- 既存の整形に合わせ、`npm run lint` で一貫性を担保します。
- Tailwind クラスは可読性を重視し、レイアウト → 余白 → 色の順でまとめます。

## テスト方針
- E2E テストは Playwright（`e2e/`）。
- テスト名は機能/ユーザーフローが分かるように記述します。
- UI やフロー変更時は `npm run test:e2e` を実行してください。

## コミット & PR ルール
- コミットメッセージは **日本語のコンベンショナルコミット** 形式にします。
  - 形式: `type(scope任意): 日本語の要約`
  - type 例: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
  - 例: `feat: クイズ結果画面を追加`
  - 例: `fix: 収集率の計算ミスを修正`
  - 例: `chore: データ検証スクリプトを更新`
- PR には短い概要、UI 変更のスクリーンショット/録画、関連 Issue のリンクを含めます。

## 設定・データの注意点
- アプリのデータは静的です。`src/data/` を更新したら `npm run validate:data` を実行してください。
