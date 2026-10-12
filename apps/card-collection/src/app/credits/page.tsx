import Link from "next/link";

const retiredGrains = [
  { name: "小麦", file: "Wheat_close-up.JPG", author: "Bluemoose", license: "CC BY-SA 3.0", url: "https://creativecommons.org/licenses/by-sa/3.0/" },
  { name: "大豆", file: "Soybean_Pods_(10059842724).jpg", author: "United Soybean Board", license: "CC BY 2.0", url: "https://creativecommons.org/licenses/by/2.0/" },
  { name: "トウモロコシ", file: "Corncobs.jpg", author: "Asbestos", license: "CC BY-SA 2.0", url: "https://creativecommons.org/licenses/by-sa/2.0/" },
  { name: "米", file: "A_bowl_of_rice.jpg", author: "Douglas Perkins", license: "CC0 1.0", url: "https://creativecommons.org/publicdomain/zero/1.0/" },
  { name: "大麦", file: "Barley_ears.jpg", author: "Christoph Strässler", license: "CC BY-SA 2.0", url: "https://creativecommons.org/licenses/by-sa/2.0/" },
];

export default function CreditsPage() {
  return <article className="max-w-3xl mx-auto px-5 py-8 text-concrete-800 leading-relaxed">
    <Link href="/collection" className="inline-flex min-h-11 items-center underline underline-offset-4">カードコレクションに戻る</Link>
    <h2 className="font-display text-2xl mt-4 mb-6">出典・素材・ライセンス</h2>
    <section className="mb-8"><h3 className="font-display text-lg mb-2">カードの図解と社名</h3>
      <p>カードの図解は、AIによるコーディング支援を用い、基本図形から新たに作成しました。実施設・穀物の写真や企業ロゴをトレースしたものではありません。サイロの図解は共通の模式図で、各施設の外観や設備を再現していません。</p>
      <p className="mt-3">企業名・施設名は識別と学習のためのテキストです。各企業・団体との提携や承認を示すものではありません。</p>
    </section>
    <section className="mb-8"><h3 className="font-display text-lg mb-2">所在地と地図</h3>
      <p>所在地は施設の公式案内と国土地理院の航空写真を照合しています。新潟支店は公式施設案内に対応する事務所・受付側の地点で、サイロ本体の位置は未確定です。測量値・訪問経路・立入り許可を示すものではありません。</p>
      <p className="mt-3">背景地図: <a className="underline" href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>。所在地の照合資料: <a className="underline" href="https://maps.gsi.go.jp/development/ichiran.html#seamlessphoto">国土地理院・地理院タイル（全国最新写真）</a>。</p>
      <p className="mt-3">航空写真は拡大時（ズーム14〜18）に表示し、広域では通常地図を表示します。国土地理院の写真には複数機関の撮影画像が含まれます。一部地域のGRUS画像の出典は「GRUS画像（© Axelspace）」です。撮影時期は地域によって異なり、リアルタイムの船舶情報ではありません。</p>
    </section>
    <section className="mb-8"><h3 className="font-display text-lg mb-2">ソフトウェアとフォント</h3>
      <p>React Leaflet 4.2.1 / @react-leaflet/core 2.1.0 はHippocratic License 2.1、Leaflet 1.9.4はBSD 2-Clauseです。Next.js 14.2.35、React / React DOM 18.3.1、Framer Motion 12.26.1はMITです。各ライセンスはそれぞれのソフトウェアに適用されます。</p>
      <p className="mt-3">現行画面はOSの日本語フォントを使用します。以前利用したZen Maru Gothic、M PLUS Rounded 1c、JetBrains Mono、Nunitoと保存されているGeistフォントの上流OFL 1.1通知を保管・掲載しています。</p>
      <a href="/third-party-notices.txt" className="inline-flex min-h-11 items-center underline font-bold mt-2">著作権・ライセンス全文を読む</a>
      <p className="text-sm mt-2">Hippocratic Licenseの利用条件は全文で確認できます。依存ソフトウェアの通知は、このプロジェクト全体のライセンス指定を意味しません。フォントの全配信バイナリを個別に照合したものではありません。</p>
    </section>
    <section><h3 className="font-display text-lg mb-2">旧画像の配信停止（2026年10月12日）</h3>
      <p>旧施設写真・企業ロゴ・穀物写真は、利用根拠または配信ファイルと出典の一致を確認できていないため、現在の配信から外しました。出典表示だけで利用許可を得たことにはなりません。元ファイルは保管しており、Git履歴や過去の公開版からの削除は行っていません。</p>
      <p className="mt-3 text-sm">以下は旧データが参照していたCommonsページの記録です。旧配信画像がこれらと同一であることや、各ライセンスの対象であることは未確認です。旧ファイルの加工有無も未確認で、再利用は停止しています。</p>
      <ul className="mt-3 space-y-4 text-sm">{retiredGrains.map(image => <li key={image.file}>
        <span className="font-bold">{image.name}</span>: <a className="underline" href={`https://commons.wikimedia.org/wiki/File:${image.file}`}>{image.file}</a><br />
        参照ページの作者: {image.author} · <a className="underline" href={image.url}>{image.license}</a> · 現行配信なし
      </li>)}</ul>
    </section>
  </article>;
}
