// Shared SVG utilities for card generation and packaging

export async function svgToPng(
  svgString: string,
  width: number,
  height: number,
  _dpi: number = 96,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Set DPI for canvas
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Draw at higher resolution
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Could not convert canvas to blob"));
          }
        },
        "image/png",
        1.0,
      );
    };
    img.onerror = reject;
    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgString)));
  });
}

export async function svgStringToImageElement(
  svgString: string,
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgString)));
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function svgToDataUrl(svgString: string): string {
  return (
    "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgString)))
  );
}

export async function inlineSvgImages(svgMarkup: string): Promise<string> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgMarkup, "image/svg+xml");
  const images = Array.from(doc.querySelectorAll("image"));

  for (const img of images) {
    const href = (
      img.getAttribute("href") ||
      img.getAttribute("xlink:href") ||
      ""
    ).trim();
    if (!href || href.startsWith("data:")) continue;

    let absUrl: string;
    try {
      absUrl = new URL(href, window.location.href).href;
    } catch (_) {
      continue;
    }

    let res: Response;
    try {
      res = await fetch(absUrl, { cache: "force-cache" });
    } catch (_) {
      continue;
    }
    if (!res.ok) continue;

    let blob: Blob;
    try {
      blob = await res.blob();
    } catch (_) {
      continue;
    }

    let dataUrl: string;
    try {
      dataUrl = await blobToDataUrl(blob);
    } catch (_) {
      continue;
    }

    img.setAttribute("href", dataUrl);
    img.removeAttribute("xlink:href");
  }

  return new XMLSerializer().serializeToString(doc.documentElement);
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
