import type { Card } from "@/types";
import Image from "next/image";

// 写真やロゴをトレースせず、基本図形から作成した説明用図解。
export default function CardArtwork({ card }: { card: Card }) {
  if (card.category === "silo") return <Image data-testid="card-artwork" src="/atlas/card-silo.svg" alt={`${card.name}のオリジナル模式図（施設の実際の外観ではありません）`} width={360} height={180} className="w-full h-full object-contain bg-[#e6f3fa]" />;
  if (card.category === "trader") return <div data-testid="card-artwork" className="h-full w-full flex flex-col items-center justify-center gap-3 px-3 text-center bg-concrete-50">
    <span className="text-[10px] font-mono tracking-widest text-concrete-500">GRAIN TRADING</span>
    <span className="font-display text-lg leading-relaxed text-concrete-900 break-words">{card.name}</span>
    <span className="text-[9px] text-concrete-500">社名テキスト · ロゴではありません</span>
  </div>;
  const isCorn = card.id === "grain-corn";
  const isRice = card.id === "grain-rice";
  const isBean = card.id === "grain-soybean";
  const isCanola = card.id === "grain-canola";
  const isSorghum = card.id === "grain-sorghum";
  return <svg data-testid="card-artwork" role="img" aria-label={`${card.name}のオリジナル図解（実物の写真ではありません）`} viewBox="0 0 320 240" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <rect width="320" height="240" fill="#f2fbf7" />
    <circle cx="259" cy="43" r="22" fill="#e8b850" />
    <>
      <ellipse cx="160" cy="204" rx="87" ry="12" fill="#e5d5b5" />
      {isCanola ? <>{[112,160,208].map((x,i) => <g key={x}><path d={`M${x} 200V${99-i*11}`} stroke="#6f8648" strokeWidth="5" />{[[-11,0],[11,0],[0,-11],[0,11]].map(([dx,dy]) => <circle key={`${dx}-${dy}`} cx={x+dx} cy={96-i*11+dy} r="10" fill="#edc43e" />)}<circle cx={x} cy={96-i*11} r="5" fill="#b99526" /><path d={`M${x} 170Q${x+35} 145 ${x+23} 134Q${x+5} 146 ${x} 170`} fill="#819950" /></g>)}</> : isSorghum ? <>{[116,160,204].map(x => <g key={x}><path d={`M${x} 200V80`} stroke="#718344" strokeWidth="5" />{Array.from({length:30},(_,i) => <circle key={i} cx={x+(i%5-2)*7} cy={80+Math.floor(i/5)*11} r="5" fill={i%2 ? "#a8623b" : "#bf8050"} />)}</g>)}</> : isRice ? <><path d="M77 156H243Q228 204 160 205Q92 204 77 156Z" fill="#6c8791" />{Array.from({length: 24}, (_, i) => <ellipse key={i} cx={103+(i%8)*16} cy={140+Math.floor(i/8)*8} rx="10" ry="4" fill="#fffdf3" stroke="#dfd5b7" transform={`rotate(${i%2 ? 15 : -15} ${103+(i%8)*16} ${140+Math.floor(i/8)*8})`} />)}</> : isBean ? <>{[103,160,217].map((x,i) => <g key={x}><path d={`M${x-15} ${100+i*10}Q${x+38} ${103+i*10} ${x+6} ${178+i*5}Q${x-32} ${166+i*5} ${x-15} ${100+i*10}`} fill="#819650" stroke="#4f6939" strokeWidth="3" /><circle cx={x} cy={127+i*8} r="10" fill="#c9bd7d" /><circle cx={x-3} cy={153+i*6} r="10" fill="#c9bd7d" /></g>)}</> : <>{[119,160,201].map((x,i) => <g key={x}><path d={`M${x} 200V${isCorn ? 90 : 59+i*11}`} stroke="#73834b" strokeWidth="4" />{Array.from({length:isCorn ? 7 : 6}, (_,j) => <g key={j}><ellipse cx={x-8} cy={83+j*13+i*4} rx={isCorn ? 8 : 11} ry="6" fill="#d5a440" transform={`rotate(-30 ${x-8} ${83+j*13+i*4})`} /><ellipse cx={x+8} cy={83+j*13+i*4} rx={isCorn ? 8 : 11} ry="6" fill="#e5ba55" transform={`rotate(30 ${x+8} ${83+j*13+i*4})`} /></g>)}<path d={`M${x} 183Q${x-36} 162 ${x-28} 145Q${x-8} 156 ${x} 183`} fill="#8c9b55" /></g>)}</>}
      <text x="17" y="27" fill="#786541" fontSize="10" letterSpacing="2">GRAIN / ILLUSTRATION</text>
    </>
  </svg>;
}
