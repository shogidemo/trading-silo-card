export default function Footer() {
  return (
    <footer className="bg-concrete-900 text-concrete-400 mt-auto">
      {/* 上部の装飾ライン */}
      <div className="h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-harvest-400" />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="text-center">
          <h3 className="text-sm font-display text-concrete-300 mb-4">
            免責事項
          </h3>
          <p className="text-xs leading-relaxed mb-4">
            本サイトは穀物業界について学ぶことを目的とした非公式の教育コンテンツです。
          </p>
          <ul className="text-xs space-y-1.5 text-concrete-500">
            <li>
              掲載している企業名・施設名・ロゴ等は各社の商標または登録商標です
            </li>
            <li>
              本サイトは掲載企業・団体とは一切関係がなく、公式情報ではありません
            </li>
            <li>
              画像の一部はWikimedia Commons等のオープンライセンス素材、
              および各社公式サイトからの引用（出典明記）を使用しています
            </li>
            <li>掲載情報の正確性について保証するものではありません</li>
          </ul>
        </div>

        <div className="mt-6 pt-4 border-t border-concrete-800 text-center">
          <p className="text-xs text-concrete-600 font-english">
            Grain Silo Card Collection - Educational Purpose Only
          </p>
        </div>
      </div>
    </footer>
  );
}
