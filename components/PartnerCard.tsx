import Image from "next/image";
import type { Partner } from "@/lib/content";

/** One cell of the hairline logo grid. Past partners grey out the logo only. */
export default function PartnerCard({ partner, past = false }: { partner: Partner; past?: boolean }) {
  const body = (
    <>
      {partner.logo && (
        <div className="relative mb-6 h-16 w-full max-w-[220px]">
          <Image
            src={partner.logo}
            alt=""
            fill
            sizes="220px"
            className={`object-contain object-left ${past ? "opacity-50 grayscale" : ""}`}
          />
        </div>
      )}
      <h3 className="text-xl leading-7 tracking-[-0.02em] text-ink">{partner.name}</h3>
      <p className="mt-2 text-base text-body">{partner.description}</p>
    </>
  );

  return (
    <li>
      {partner.url ? (
        <a href={partner.url} target="_blank" rel="noopener noreferrer" className="group block">
          {body}
          <span className="mt-3 inline-block text-sm text-blue-link group-hover:text-blue-hover">
            {new URL(partner.url).hostname.replace(/^www\./, "")}
            <span className="sr-only"> (opens in new tab)</span>
          </span>
        </a>
      ) : (
        body
      )}
    </li>
  );
}
