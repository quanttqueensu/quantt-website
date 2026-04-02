import Image from "next/image";
import type { Partner } from "@/lib/content";

interface PartnerCardProps {
  partner: Partner;
  muted?: boolean;
}

export default function PartnerCard({ partner, muted = false }: PartnerCardProps) {
  const content = (
    <div
      className={`rounded-lg border p-5 backdrop-blur-md ${
        muted
          ? "border-white/10 bg-white/[0.04]"
          : "border-white/10 bg-white/[0.07]"
      } ${partner.url ? "transition-colors hover:border-white/20 hover:bg-white/[0.10]" : ""}`}
    >
      <div className="mb-3">
        {partner.logo ? (
          <div className={`inline-flex items-center justify-center rounded-md bg-white px-4 py-3 ${muted ? "opacity-40" : ""}`}>
            <div className="relative h-14 w-[180px]">
              <Image
                src={partner.logo}
                alt={`${partner.name} logo`}
                fill
                className="object-contain"
                sizes="180px"
              />
            </div>
          </div>
        ) : (
          <div
            className={`inline-flex h-10 items-center rounded-md px-3 text-xs font-semibold ${
              muted ? "bg-white/[0.06] text-white/40" : "bg-white/10 text-white/50"
            }`}
          >
            {partner.name}
          </div>
        )}
      </div>
      <h3 className={`text-sm font-semibold ${muted ? "text-white/50" : "text-white"}`}>
        {partner.name}
      </h3>
      <p className={`mt-1 text-xs leading-relaxed ${muted ? "text-white/40" : "text-white/60"}`}>
        {partner.description}
      </p>
    </div>
  );

  if (partner.url) {
    return (
      <a href={partner.url} target="_blank" rel="follow" className="block">
        {content}
      </a>
    );
  }

  return content;
}
