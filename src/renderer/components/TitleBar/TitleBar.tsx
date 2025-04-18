import { Button } from "../ui/button";
import { Home } from "lucide-react";
import WindowControlBar from "../WindowControlBar";

export default function TitleBar() {
  return (
      <nav className="draggable flex justify-between select-none text-muted-foreground h-10">
        <div className="flex items-center space-x-2">
        <Button className="cursor-pointer nonDraggable" variant="ghost" size="icon"><Home /></Button>
        </div>
        <WindowControlBar />
      </nav>
  );
}
