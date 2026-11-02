import type { ReactNode } from "react";
import { Eyebrow } from "./ui";

export type LegalSection = { id: string; title: string; body: ReactNode };

/** Layout for the Privacy Policy and Terms. `draft`: shows the label until a lawyer has signed off. */
export function LegalPage({ title, updated, draft, sections }: { title: string; updated: string; draft?: boolean; sections: LegalSection[] }) {
  return (
    <div className="wrap py-14 md:py-20">
      <Eyebrow>Legal</Eyebrow>
      <h1 className="display mt-4 text-[clamp(3.5rem,9vw,7rem)] text-balance">{title}</h1>
      <p className="mt-5 text-sm text-muted">Last updated {updated}</p>
      {draft && <p className="eyebrow mt-3 inline-block border border-ink px-3 py-1.5 text-[0.6875rem]">Draft, pending legal review</p>}
      <div className="mt-10 border-t border-ink">
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="grid scroll-mt-6 gap-3 border-b border-ink py-8 md:grid-cols-[20rem_minmax(0,1fr)]">
            <h2 className="display text-3xl">{s.title}</h2>
            <div className="max-w-[38rem] space-y-4 font-serif text-lg leading-relaxed text-muted">{s.body}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
