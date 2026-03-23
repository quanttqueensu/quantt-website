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
          ? "border-text-dark/10 bg-white/30"
          : "border-white/10 bg-white/[0.07]"
      }`}
    >
      <div className="mb-3 flex h-12 items-center">
        <div
          className={`flex h-10 items-center rounded px-3 text-xs font-semibold ${
            muted ? "bg-text-dark/10 text-text-dark" : "bg-white/10 text-white/50"
          }`}
        >
          {partner.name}
        </div>
      </div>
      <h3 className={`text-sm font-semibold ${muted ? "text-text-dark" : "text-white"}`}>
        {partner.name}
      </h3>
      <p className={`mt-1 text-xs leading-relaxed ${muted ? "text-text-dark-body" : "text-white/60"}`}>
        {partner.description}
      </p>
    </div>
  );
}
