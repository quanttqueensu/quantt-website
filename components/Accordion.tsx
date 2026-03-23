"use client";

import { useState } from "react";

interface AccordionItem {
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-white/10">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className={`flex w-full items-center justify-between px-5 py-4 text-left transition-colors ${
              openIndex === i
                ? "bg-primary text-white"
                : "bg-white/[0.08] g-heading hover:bg-white/[0.12]"
            }`}
          >
            <span className="text-sm font-semibold">{item.title}</span>
            <span
              className={`text-lg transition-transform duration-300 ${
                openIndex === i ? "rotate-180" : ""
              }`}
            >
              ▾
            </span>
          </button>
          <div
            className="grid transition-[grid-template-rows] duration-300 ease-in-out"
            style={{
              gridTemplateRows: openIndex === i ? "1fr" : "0fr",
            }}
          >
            <div className="overflow-hidden">
              <div className="px-5 py-4 text-sm leading-relaxed g-body">
                {item.content}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
