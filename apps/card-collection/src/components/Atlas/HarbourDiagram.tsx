"use client";

import { useState } from "react";

type Part = "ship" | "berth" | "silo";
const parts: { id: Part; name: string; title: string; text: string }[] = [
  { id: "ship", name: "船", title: "船が運ぶ", text: "船倉に穀物を積んで運ぶ。港で岸壁につける。" },
  { id: "berth", name: "岸壁", title: "岸壁で受け取る", text: "バースは船が接岸する場所。ここで穀物を受け取る。" },
  { id: "silo", name: "サイロ", title: "サイロに蓄える", text: "穀物を保管する施設。知った施設をカードに。" },
];

export default function HarbourDiagram() {
  const [selected, setSelected] = useState<Part>("ship");
  const current = parts.find(part => part.id === selected)!;
  const partProps = (part: Part) => ({
    role: "button", tabIndex: 0, "aria-label": `${parts.find(item => item.id === part)!.name}を知る`,
    "aria-pressed": selected === part, opacity: selected === part ? 1 : .5,
    onClick: () => setSelected(part),
    onKeyDown: (event: React.KeyboardEvent<SVGGElement>) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelected(part); }
    },
  });
  return <section aria-label="港のしくみ" className="atlas-harbour-section">
    <div className="atlas-harbour"><span className="atlas-port-caption">港のしくみを触ってみる</span>
<svg  viewBox="0 0 400 280" role="group" aria-label="船・岸壁・サイロを選んで知る港の自作模式図。実在の施設配置や縮尺を表さない"><rect width="400" height="280" fill="#103c52"/><path d="M0 0H256V170H225V192H0Z" fill="#d5e9e5"/><g data-part="silo" {...partProps("silo")}><rect x="40" y="22" width="184" height="124" fill="transparent"/><circle cx="64" cy="40" r="10" fill="#eaf8f3" stroke="#87c8b8" strokeWidth="2"/><circle cx="91" cy="40" r="10" fill="#eaf8f3" stroke="#87c8b8" strokeWidth="2"/><circle cx="118" cy="40" r="10" fill="#eaf8f3" stroke="#87c8b8" strokeWidth="2"/><circle cx="145" cy="40" r="10" fill="#eaf8f3" stroke="#87c8b8" strokeWidth="2"/><circle cx="172" cy="40" r="10" fill="#eaf8f3" stroke="#87c8b8" strokeWidth="2"/><circle cx="199" cy="40" r="10" fill="#eaf8f3" stroke="#87c8b8" strokeWidth="2"/><circle cx="64" cy="67" r="10" fill="#eaf8f3" stroke="#87c8b8" strokeWidth="2"/><circle cx="91" cy="67" r="10" fill="#eaf8f3" stroke="#87c8b8" strokeWidth="2"/><circle cx="118" cy="67" r="10" fill="#eaf8f3" stroke="#87c8b8" strokeWidth="2"/><circle cx="145" cy="67" r="10" fill="#eaf8f3" stroke="#87c8b8" strokeWidth="2"/><circle cx="172" cy="67" r="10" fill="#eaf8f3" stroke="#87c8b8" strokeWidth="2"/><circle cx="199" cy="67" r="10" fill="#eaf8f3" stroke="#87c8b8" strokeWidth="2"/><circle cx="64" cy="94" r="10" fill="#eaf8f3" stroke="#87c8b8" strokeWidth="2"/><circle cx="91" cy="94" r="10" fill="#eaf8f3" stroke="#87c8b8" strokeWidth="2"/><circle cx="118" cy="94" r="10" fill="#eaf8f3" stroke="#87c8b8" strokeWidth="2"/><circle cx="145" cy="94" r="10" fill="#eaf8f3" stroke="#87c8b8" strokeWidth="2"/><circle cx="172" cy="94" r="10" fill="#eaf8f3" stroke="#87c8b8" strokeWidth="2"/><circle cx="199" cy="94" r="10" fill="#eaf8f3" stroke="#87c8b8" strokeWidth="2"/><circle cx="64" cy="121" r="10" fill="#eaf8f3" stroke="#87c8b8" strokeWidth="2"/><circle cx="91" cy="121" r="10" fill="#eaf8f3" stroke="#87c8b8" strokeWidth="2"/><circle cx="118" cy="121" r="10" fill="#eaf8f3" stroke="#87c8b8" strokeWidth="2"/><circle cx="145" cy="121" r="10" fill="#eaf8f3" stroke="#87c8b8" strokeWidth="2"/><circle cx="172" cy="121" r="10" fill="#eaf8f3" stroke="#87c8b8" strokeWidth="2"/><circle cx="199" cy="121" r="10" fill="#eaf8f3" stroke="#87c8b8" strokeWidth="2"/></g><g data-part="berth" {...partProps("berth")}><path d="M26 165H238V183H26" fill="#86b9ad"/><path d="M198 160V192L239 221M152 160V192L190 221" fill="none" stroke="#153d52" strokeWidth="4"/><rect x="20" y="149" width="228" height="45" fill="transparent"/></g><path d="M270 13V156H302V177" fill="none" stroke="#7fd7ce" strokeWidth="5"/><g data-part="ship" {...partProps("ship")}><path d="M27 201H341L371 224L343 247H25L10 224Z" fill="#fff"/><path d="M82 208H327V239H82Z" fill="#225c70"/><rect x="90" y="212" width="30" height="23" rx="2" fill="#9ebcc4"/><rect x="129" y="212" width="30" height="23" rx="2" fill="#9ebcc4"/><rect x="168" y="212" width="30" height="23" rx="2" fill="#9ebcc4"/><rect x="207" y="212" width="30" height="23" rx="2" fill="#9ebcc4"/><rect x="246" y="212" width="30" height="23" rx="2" fill="#9ebcc4"/><rect x="285" y="212" width="30" height="23" rx="2" fill="#9ebcc4"/><rect x="30" y="210" width="37" height="28" rx="3" fill="#9dc7c0"/><rect x="42" y="198" width="13" height="14" fill="#fff"/></g><path d="M239 221L211 113H87" fill="none" stroke="#19a7a1" strokeWidth="4" strokeDasharray="6 5"/><circle cx="239" cy="221" r="6" fill="#19a7a1"/><circle cx="87" cy="113" r="6" fill="#19a7a1"/><path d="M10 264H390M292 36H378M296 55H364M284 75H378" stroke="#40718a" strokeWidth="1"/><text x="290" y="143" fill="#a7d0df" fontSize="10">船の通り道</text></svg>
      <div className="atlas-harbour-controls">{parts.map((part, index) => <button key={part.id} type="button" aria-pressed={selected === part.id} onClick={() => setSelected(part.id)}>{index + 1} {part.name}</button>)}</div>
    </div>
    <div className="atlas-port-tip" role="status" aria-live="polite"><strong>{current.title}</strong><p>{current.text}</p></div>
    <p className="atlas-muted atlas-port-disclaimer">自作模式図・縮尺なし。実在の施設配置ではありません。</p>
  </section>;
}
