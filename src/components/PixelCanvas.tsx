"use client";

import { useEffect, useRef } from "react";

type PixelCanvasProps = {
  columns: number;
  rows: number;
  mode: "photo" | "ambient-placeholder";
  photoSrc?: string;
  className?: string;
};

/**
 * Replicates the reference site's pixel technique: a low-resolution canvas
 * buffer stretched via CSS with image-rendering: pixelated. "photo" mode
 * draws a real source image (Anthony's own portrait) into the low-res
 * buffer, same technique already used for /home's static halftone image.
 */
export function PixelCanvas({
  columns,
  rows,
  mode,
  photoSrc,
  className,
}: PixelCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    canvas.width = columns;
    canvas.height = rows;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number | undefined;

    if (mode === "photo" && photoSrc) {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        // Reference site's face content measured at roughly 50%-92% of
        // buffer width, not full-bleed — confine the draw region to match,
        // rest of the buffer left fully transparent/dark.
        const bandStart = Math.round(columns * 0.48);
        const bandEnd = Math.round(columns * 0.94);
        const bandW = bandEnd - bandStart;

        const imgRatio = img.width / img.height;
        const bandRatio = bandW / rows;
        let sx = 0,
          sy = 0,
          sw = img.width,
          sh = img.height;
        if (imgRatio > bandRatio) {
          sw = img.height * bandRatio;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / bandRatio;
          sy = (img.height - sh) / 2;
        }
        ctx.clearRect(0, 0, columns, rows);
        ctx.drawImage(img, sx, sy, sw, sh, bandStart, 0, bandW, rows);

        // Grayscale + dither the edges into transparency so it reads as
        // part of the dark scene rather than a pasted rectangle.
        const frame = ctx.getImageData(0, 0, columns, rows);
        const d = frame.data;
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < columns; x++) {
            const idx = (y * columns + x) * 4;
            const gray = d[idx] * 0.3 + d[idx + 1] * 0.59 + d[idx + 2] * 0.11;
            d[idx] = d[idx + 1] = d[idx + 2] = gray;
            const distIn = Math.min(x - bandStart, bandEnd - x);
            if (distIn < bandW * 0.25 && distIn >= 0) {
              d[idx + 3] = Math.max(0, 255 * (distIn / (bandW * 0.25)));
            }
          }
        }
        ctx.putImageData(frame, 0, 0);
      };
      img.src = photoSrc;
    } else {
      // Ambient cloud placeholder: soft low-frequency noise, warm charcoal —
      // matches the site's own already-built ambient-cloud fix (Phase 3).
      // Reference site's background is purely time-driven (~37% of pixels
      // change every 2s with zero mouse interaction), so this animates the
      // noise field continuously via requestAnimationFrame rather than
      // drawing one static frame. Only the phase/time terms move — the
      // color range (r:42-76, g:34-64, b:32-60) is unchanged.
      const frame = ctx.createImageData(columns, rows);
      const data = frame.data;

      const draw = (timeMs: number) => {
        const time = timeMs * 0.00035; // slow drift, continuous motion

        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < columns; x++) {
            const n =
              Math.sin(x * 0.15 + time * 1.3) * Math.cos(y * 0.12 - time) * 0.5 +
              Math.sin((x + y) * 0.07 + time * 2.1) * 0.5;
            const t = (n + 1) / 2;
            const r = Math.round(42 + t * 34);
            const g = Math.round(34 + t * 30);
            const b = Math.round(32 + t * 28);

            const idx = (y * columns + x) * 4;
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = 255;
          }
        }

        ctx.putImageData(frame, 0, 0);
        rafId = requestAnimationFrame(draw);
      };

      rafId = requestAnimationFrame(draw);
    }

    return () => {
      if (rafId !== undefined) cancelAnimationFrame(rafId);
    };
  }, [columns, rows, mode, photoSrc]);

  return (
    <canvas
      ref={ref}
      className={`block size-full [image-rendering:pixelated] ${className ?? ""}`}
    />
  );
}
