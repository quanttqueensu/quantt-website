import { renderOgImage } from "../opengraph-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "QUANTT — this year's portfolios";

export default async function PortfoliosOpengraphImage() {
  return renderOgImage({
    wordmarkWidth: 400,
    headline: "This Year’s Portfolios",
    descriptor:
      "Quantitative research, trading strategy, and engineering at Queen's University.",
  });
}
