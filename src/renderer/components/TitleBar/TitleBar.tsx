import { TypographyP } from "@/components/ui/TypographyP";
import "./TitleBar.css";

export default function TitleBar() {
  return (
    <div id="titleBarContainer">
      <div id="titleBar" className="draggable absolute flex top-0 px-2 select-none h-full text-muted-foreground">
        <TypographyP className="draggable">Seraph</TypographyP>
      </div>
    </div>
  )
};
