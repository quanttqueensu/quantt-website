import Image from "next/image";
import type { ResearchPaperDetail } from "@/lib/content";

export interface ResearchPaper {
  team: string;
  pdf: string;
  detail?: ResearchPaperDetail;
}

/** One row per paper: first page, full title, team and date, opening the PDF. */
export default function ResearchList({ papers }: { papers: ResearchPaper[] }) {
  return (
    <ul className="cs-papers-list">
      {papers.map(({ team, pdf, detail }) => (
        <li key={team}>
          <a href={encodeURI(pdf)} target="_blank" rel="noopener noreferrer">
            {detail?.image ? (
              <Image src={detail.image} alt="" width={850} height={1100} sizes="96px" />
            ) : (
              <span aria-hidden="true" />
            )}
            <div>
              <h3>{detail?.title ?? team}</h3>
              <p className="cs-meta">
                {team} team{detail?.date ? `, ${detail.date}` : ""}
              </p>
            </div>
            <span className="cs-papers-list__pdf">
              Read paper (PDF)<span className="sr-only"> (opens in new tab)</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
