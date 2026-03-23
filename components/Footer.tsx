import Image from "next/image";
import Link from "next/link";
import { getSiteConfig } from "@/lib/content";

export default function Footer() {
  const config = getSiteConfig();

  return (
    <footer className="bg-navy px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/">
            <Image
              src="/images/logos/quantt-text-white.png"
              alt="QUANTT"
              width={120}
              height={55}
              className="h-6 w-auto"
            />
          </Link>
          <p className="mt-1 text-[10px] text-text-light/60">Canada&apos;s Premier Quantitative Finance Club</p>
          <p className="mt-1 text-[11px] text-text-light">
            <a
              href="mailto:quanttgroup@gmail.com"
              className="hover:text-white transition-colors"
            >
              quanttgroup@gmail.com
            </a>
          </p>
        </div>

        <div className="flex gap-4">
          {[
            { href: "https://www.facebook.com/QUANTTpage", label: "Facebook" },
            {
              href: "https://www.linkedin.com/company/quanttqueens/",
              label: "LinkedIn",
            },
            {
              href: "https://www.instagram.com/quanttqueens",
              label: "Instagram",
            },
            { href: "https://linktr.ee/quantt", label: "Linktree" },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-text-light transition-colors hover:text-white"
            >
              {social.label}
            </a>
          ))}
        </div>

        <p className="text-[10px] text-blue-mid">
          &copy; {config.copyright}
        </p>
      </div>
    </footer>
  );
}
