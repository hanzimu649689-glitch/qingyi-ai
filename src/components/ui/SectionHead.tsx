import Reveal from "./Reveal";
import type { ReactNode } from "react";

export default function SectionHead({
  eyebrow,
  title,
  lead,
  align = "left",
  right,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  right?: ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-6 ${align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}>
      <div className={align === "center" ? "max-w-2xl" : "max-w-2xl"}>
        <Reveal>
          <div className="eyebrow mb-4">{eyebrow}</div>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="h2">{title}</h2>
        </Reveal>
        {lead && (
          <Reveal delay={2}>
            <p className="lead mt-5">{lead}</p>
          </Reveal>
        )}
      </div>
      {right && <Reveal delay={3}>{right}</Reveal>}
    </div>
  );
}
