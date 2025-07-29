import { Printer } from "lucide-react";
import { Button } from "./ui/button";
import { useReactToPrint } from "react-to-print";
import { RefObject } from "react";

interface Props {
  contentRef: RefObject<HTMLDivElement | null>;
}

export function PrintPDFButton({ contentRef }: Props) {
  const reactToPrintFn = useReactToPrint({
    contentRef,
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 1cm;
      }
      body {
        font-family: 'IBM Plex Sans Thai', sans-serif;
        font-size: 14px;
        color: #000;
      }
    `,
  });

  return (
    <Button variant="outline" onClick={reactToPrintFn}>
      <Printer className="mr-2" />
      บันทึกเป็น PDF
    </Button>
  );
}
