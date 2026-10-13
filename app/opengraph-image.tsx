import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Static export: rendered once at build time into out/.
export const dynamic = "force-static";
export const alt =
  "QUANTT — Queen's University Algorithmic Network & Trading Team";

/**
 * The white QUANTT wordmark, inlined as a data URI.
 *
 * The bundled `next/og` renderer only ships Geist *Regular* — there is no bold
 * face available — so the real logo asset is used for the wordmark rather than
 * asking satori to fake a heavy weight. Read at render time (build time, since
 * metadata image routes are statically generated) from the Node filesystem.
 */
export function wordmarkDataUri() {
  const file = readFileSync(
    join(process.cwd(), "public", "images", "logos", "quantt-text-white.png")
  );
  return `data:image/png;base64,${file.toString("base64")}`;
}

/** Intrinsic aspect ratio of quantt-text-white.png (877 × 399). */
const WORDMARK_RATIO = 399 / 877;

type OgImageOptions = {
  /** Small all-caps line above the wordmark. Omit for none. */
  eyebrow?: string;
  /** Large headline rendered instead of a descriptor-only layout. */
  headline?: string;
  /** Supporting line beneath the wordmark / headline. */
  descriptor: string;
  /** Rendered width of the wordmark in px. */
  wordmarkWidth?: number;
  /**
   * Wrap width for the descriptor. Satori has no `text-wrap: balance`, so the
   * only way to avoid an orphaned last word is to constrain the measure.
   */
  descriptorWidth?: number;
};

/**
 * Shared composition for every QUANTT OG card: flat royal blue, a cyan accent
 * bar, the wordmark, and one supporting line. Deliberately low-density — these
 * render as ~300px-wide thumbnails in the Instagram and LinkedIn feeds.
 */
export function renderOgImage({
  eyebrow,
  headline,
  descriptor,
  wordmarkWidth = 620,
  descriptorWidth = 940,
}: OgImageOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 92px",
          // Flat royal blue, matching the site's hero panel and bands.
          backgroundColor: "#1c409b",
          position: "relative",
        }}
      >
        {/* Cyan accent bar at the left edge, as on the site's hero panel. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 16,
            backgroundColor: "#6ee8e9",
          }}
        />

        {eyebrow ? (
          <div
            style={{
              fontSize: 26,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#6ee8e9",
              marginBottom: 34,
            }}
          >
            {eyebrow}
          </div>
        ) : null}

        <img
          src={wordmarkDataUri()}
          width={wordmarkWidth}
          height={Math.round(wordmarkWidth * WORDMARK_RATIO)}
          alt=""
          style={{
            // The source PNG carries symmetric transparent padding; pull the
            // optical edges back in so the wordmark aligns to the text below.
            marginLeft: -Math.round(wordmarkWidth * 0.022),
            marginTop: -Math.round(wordmarkWidth * 0.075),
            marginBottom: -Math.round(wordmarkWidth * 0.06),
          }}
        />

        {headline ? (
          <div
            style={{
              fontSize: 86,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              marginTop: 28,
            }}
          >
            {headline}
          </div>
        ) : null}

        <div
          style={{
            fontSize: 40,
            lineHeight: 1.25,
            color: "#ffffff",
            letterSpacing: "-0.01em",
            marginTop: 34,
            maxWidth: descriptorWidth,
          }}
        >
          {descriptor}
        </div>

      </div>
    ),
    { ...size }
  );
}

export default async function OpengraphImage() {
  return renderOgImage({
    // 720px breaks this as "Queen's University Algorithmic" /
    // "Network & Trading Team" instead of orphaning "Team" on its own line.
    descriptorWidth: 720,
    descriptor: "Queen's University Algorithmic Network & Trading Team",
  });
}
