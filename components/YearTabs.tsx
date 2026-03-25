"use client";

import { useState, type ReactNode } from "react";

interface YearTab {
  year: string;
  current: boolean;
  content: ReactNode;
}

export default function YearTabs({ tabs }: { tabs: YearTab[] }) {
  const defaultYear = tabs.find((t) => t.current)?.year ?? tabs[0]?.year;
  const [selected, setSelected] = useState(defaultYear);

  return (
    <>
      <div className="mb-10 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.year}
            onClick={() => setSelected(tab.year)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              selected === tab.year
                ? "bg-primary text-white"
                : "bg-white/[0.07] text-white/60 hover:bg-white/[0.12] hover:text-white"
            }`}
          >
            {tab.year}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div key={tab.year} className={selected === tab.year ? "" : "hidden"}>
          {tab.content}
        </div>
      ))}
    </>
  );
}
