import Image from "next/image";
import type { Partner } from "@/lib/content";

interface PartnerCardProps {
  partner: Partner;
  muted?: boolean;
}

export default function PartnerCard({ partner, muted = false }: PartnerCardProps) {
  return (
    <div
      className={`rounded-lg border p-5 backdrop-blur-md ${
        muted
          ? "border-white/10 bg-white/[0.04]"
          : "border-white/10 bg-white/[0.07]"
      }`}
    >
      <div className="mb-3 flex h-12 items-center">
        {partner.logo ? (
          <div className="relative h-10 w-[120px]">
            <Image
              src={partner.logo}
              alt={`${partner.name} logo`}
              fill
              className={`object-contain object-left ${muted ? "opacity-50" : ""}`}
              sizes="120px"
            />
          </div>
        ) : (
          <div
            className={`flex h-10 items-center rounded px-3 text-xs font-semibold ${
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
}
