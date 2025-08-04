import { DownloadIcon } from "lucide-react";
import { Button } from "./ui/button";
import { RefObject } from "react";

let html2canvas: typeof import("html2canvas-pro").default;

async function loadHtml2Canvas() {
  if (!html2canvas) {
    const mod = await import("html2canvas-pro");
    html2canvas = mod.default;
  }
  return html2canvas;
}

interface Props {
  contentRef: RefObject<HTMLDivElement | null>;
}
export function DownloadScreenshotButton({ contentRef }: Props) {
  const downloadFn = async () => {
    const input = contentRef.current;
    if (!input) return;

    const hiddenElements = input.querySelectorAll(".export-hidden");
    hiddenElements.forEach(
      (el) => ((el as HTMLElement).style.display = "none")
    );

    await document.fonts.ready;
    await new Promise((resolve) => setTimeout(resolve, 300)); // รอเพิ่ม
    await loadHtml2Canvas();
    const canvas = await html2canvas(input, {
      useCORS: true,
      scale: 2,
      logging: true,
      onclone: (doc) => {
        const container = doc.querySelector(
          ".data-container"
        ) as HTMLElement | null;
        if (container) {
          container.style.padding = "1rem 1rem 1rem 1rem";
        }
        const endCredit = doc.querySelector(
          ".end-credit"
        ) as HTMLElement | null;
        if (endCredit) {
          endCredit.style.display = "block";
        }
        const elements = doc.querySelectorAll("*");
        elements.forEach((el) => {
          const existingStyle = el.getAttribute("style") || "";
          el.setAttribute(
            "style",
            existingStyle +
              "; font-family: 'IBM Plex Sans Thai', sans-serif !important"
          );
        });
      },
    });

    const imgData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imgData;
    link.download = "exam-schedule.png";
    link.click();

    hiddenElements.forEach((el) => ((el as HTMLElement).style.display = ""));
  };

  return (
    <Button type="button" onClick={downloadFn} className="w-full">
      <DownloadIcon className="mr-2" />
      ดาวน์โหลด
    </Button>
  );
}
