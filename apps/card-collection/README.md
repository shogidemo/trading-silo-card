# 穀物サイロカード

公開サイト: https://trading-silo-card.vercel.app

リポジトリ: https://github.com/shogidemo/trading-silo-card

カード収集・復習履歴はブラウザの `silo-card-collection` に保存します。カードID、保存形式、JSON入出力は画像・地図変更で変更していません。

## 素材と依存ソフトウェア

2026年10月12日、利用根拠または出典との同一性が未確認のカード写真・企業ロゴと、それらが写る旧スクリーンショットを現在の配信から外しました。基本図形から作成したSVG模式図と社名テキストへ差し替えています。この差替えはAIのコーディング支援で作成しました。

元の42ファイルは作業環境にハッシュ付きで保管し、Git履歴・過去Vercel配備は削除していません。過去公開版、第三者の複製、端末キャッシュはこの変更で回収できません。共有データと別ゲームの利用経路は変更していません。

[出典・素材・ライセンス](https://trading-silo-card.vercel.app/credits)と [第三者通知全文](public/third-party-notices.txt)を参照してください。React LeafletとCoreはHippocratic License 2.1です。プロジェクト独自コード全体に新しい利用許諾を付与する変更ではありません。

通知はインストール済みの主要・推移依存、Next.js同梱ライセンス、フォントの上流OFL通知を収録しています。`client-only` と `@swc/counter` は配布package内に個別ライセンス本文・copyrightファイルがないため、packageのMIT / Apache-2.0宣言を記録しています。全フォントバイナリの個別メタデータ照合は未実施です。取得元・SHA256は [通知の記録](docs/third-party-notice-sources.json)にあります。

## 検証

`pnpm build` で型検査・lint・本番ビルド、`node scripts/silo-map.test.cjs` で地図データの検証を実行します。E2Eの `media-rights.spec.ts` は、旧素材の直URL・画像最適化URLの配信停止、図解への差替え、収集状態維持を確認します。
