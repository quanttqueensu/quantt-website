import Image from "next/image";
import type { CSSProperties } from "react";
import type { Partner } from "@/lib/content";

/** Current partners' logos in one greyscale row; colour returns on hover. */
export default function PartnerLogos({ partners }: { partners: Partner[] }) {
  const withLogos = partners.filter((p) => p.logo);
  return (
    <ul className="cs-logo-row" style={{ "--cols": withLogos.length } as CSSProperties}>
      {withLogos.map((p) => (
        <li key={p.name}>
          <Image src={p.logo!} alt={p.name} fill sizes="(max-width: 900px) 45vw, 220px" />
        </li>
      ))}
    </ul>
  );
}
