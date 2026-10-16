"use client";

import { useId, useState, ReactNode } from "react";

interface AccordionItem {
  title: string;
  content: ReactNode;
}

/** Square rows under hairline rules; the arrow circle turns down when a row is open. */
export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const id = useId();

  return (
    <ul className="border-b border-line">
      {items.map((item, i) => {
        const open = openIndex === i;
        const buttonId = `${id}-button-${i}`;
        const panelId = `${id}-panel-${i}`;
        return (
          <li key={i} className="border-t border-line">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : i)}
                className="group flex min-h-20 w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span className="text-xl leading-7 tracking-[-0.02em] text-ink">{item.title}</span>
                <span
                  className={`cs-arrow transition-transform duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-navy ${
                    open ? "rotate-90" : ""
                  }`}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 25">
                    <path d="M20.707 12.6875L14.3535 6.33391L13.6464 7.04101L18.7928 12.1874L3.99989 12.1874V13.1874L18.7929 13.1874L13.6464 18.3339L14.3535 19.041L20.707 12.6875Z" />
                  </svg>
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open} className="pb-10">
              {item.content}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
