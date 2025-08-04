import { Badge } from "./ui/badge";

interface Props {
  sectionCode: string;
}
export function BadgeSectionCode({ sectionCode }: Props) {
  if (sectionCode.includes(",")) {
    return (
      <div className="space-x-1">
        {sectionCode.split(",").map((k) => (
          <Badge key={k} className="print:text-black">
            {k}
          </Badge>
        ))}
      </div>
    );
  }
  return <Badge className="print:text-black">{sectionCode}</Badge>;
}
