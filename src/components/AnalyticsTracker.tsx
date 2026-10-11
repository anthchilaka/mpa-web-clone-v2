"use client";

import { useEffect } from "react";
import { initScrollDepthTracking } from "@/lib/analytics";

// Mounted once per page load in RootLayout. Real MPA navigation means every
// route is a fresh document load, so mount-time firing is sufficient —
// no route-change listener needed. page_render_mode itself is pushed
// earlier, via a plain inline script in layout.tsx's <head>, not here.
export default function AnalyticsTracker() {
  useEffect(() => {
    const cleanup = initScrollDepthTracking();
    return cleanup;
  }, []);

  return null;
}
