// GTM/GA4 wiring ported from the SPA vs MPA blueprint
// (D:\AI Tools\Claude Code\Outputs\SPA vs MPA\repo-push-drafts\blueprint.md).
// page_render_mode is the canonical SPA/MPA signal in BigQuery — never omit it.

export const GTM_CONTAINER_ID = "GTM-MQV493DM";
export const GA4_MEASUREMENT_ID = "G-GFK6117QNY";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export function pushPageView(): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "page_render_mode_set",
    page_render_mode: "mpa",
  });
}

const SCROLL_DEPTH_THRESHOLDS = [25, 50, 75, 90] as const;

// Fires each threshold once per page load, mirroring the SPA's
// session_max_scroll_v3 gold-layer scroll-depth event pattern.
export function initScrollDepthTracking(): () => void {
  if (typeof window === "undefined") return () => {};

  const fired = new Set<(typeof SCROLL_DEPTH_THRESHOLDS)[number]>();

  const handleScroll = () => {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    if (scrollableHeight <= 0) return;

    const scrolledPercent = Math.round(
      (window.scrollY / scrollableHeight) * 100
    );

    for (const threshold of SCROLL_DEPTH_THRESHOLDS) {
      if (scrolledPercent >= threshold && !fired.has(threshold)) {
        fired.add(threshold);
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "scroll_depth",
          scroll_depth_threshold: threshold,
        });
      }
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  return () => window.removeEventListener("scroll", handleScroll);
}
