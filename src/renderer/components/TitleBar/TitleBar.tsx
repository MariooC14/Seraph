import { Button } from "../ui/button";
import { Home, Plus } from "lucide-react";
import WindowControlBar from "../WindowControlBar";
import CloseableTab from "../NavigationBar/CloseableTab";
import { toast } from "sonner";

const tabs = [
  { name: "Lunar"},
  { name: "Solar"},
  { name: "Planetary"},
]

export default function TitleBar() {
  const handleNewTab = () => {
    toast.warning("New tab not implemented yet");
  };

  return (
      <nav className="draggable flex justify-between select-none text-muted-foreground h-10">
        <div className="flex items-center space-x-2">
          <Button className="cursor-pointer nonDraggable" variant="ghost" size="icon"><Home /></Button>
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <CloseableTab key={tab.name} name={tab.name}/>
            ))}
          </div>
          <Button variant="ghost" size="icon" className="cursor-pointer nonDraggable rounded-full size-8" onClick={handleNewTab}>
            <Plus />
          </Button>
        </div>
        <WindowControlBar />
      </nav>
  );
}
