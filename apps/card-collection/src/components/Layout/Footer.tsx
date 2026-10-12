import Link from "next/link";

export default function Footer() {
  return <footer className="atlas-footer">
    <p>穀物業界を学ぶための非公認コンテンツです。掲載企業・団体の協賛や承認を示すものではありません。</p>
    <p>図解は実施設の外観を再現していません。所在地の確認方法・素材・利用条件は、出典ページで確認できます。</p>
    <Link href="/credits" className="atlas-text-link">出典・素材・ライセンス</Link>
  </footer>;
}
