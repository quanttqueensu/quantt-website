import type { Partner } from "@/lib/content";

interface PartnerCardProps {
  partner: Partner;
  muted?: boolean;
}

export default function PartnerCard({ partner, muted = false }: PartnerCardProps) {
  return (
    <div
      className={`rounded-lg border p-5 ${
        muted
          ? "border-white/5 bg-white/[0.03]"
          : "border-white/10 bg-white/[0.07] backdrop-blur-md"
      }`}
    >
      <div className="mb-3 flex h-12 items-center">
        <div
          className={`flex h-10 items-center rounded bg-white/10 px-3 text-xs font-semibold ${
            muted ? "text-white/30" : "text-white/50"
          }`}
        >
          {partner.name}
        </div>
      </div>
      <h3 className={`text-sm font-semibold ${muted ? "text-white/50" : "text-white"}`}>
        {partner.name}
      </h3>
      <p className={`mt-1 text-xs leading-relaxed ${muted ? "text-white/35" : "text-white/60"}`}>
        {partner.description}
      </p>
    </div>
  );
}
