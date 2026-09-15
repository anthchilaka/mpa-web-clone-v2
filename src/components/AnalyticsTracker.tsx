"use client";

import { useEffect } from "react";
import { pushPageView, initScrollDepthTracking } from "@/lib/analytics";

// Mounted once per page load in RootLayout. Real MPA navigation means every
// route is a fresh document load, so mount-time firing is sufficient —
// no route-change listener needed.
export default function AnalyticsTracker() {
  useEffect(() => {
    pushPageView();
    const cleanup = initScrollDepthTracking();
    return cleanup;
  }, []);

  return null;
}
