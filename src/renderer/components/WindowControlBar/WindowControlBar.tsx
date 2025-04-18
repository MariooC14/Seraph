import { Maximize, Minimize, Minus, X } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

export default function WindowControlBar() {
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    // User can maximize by e.g. double clicking the title bar
    window.app.onMaximized(maximized => setMaximized(maximized));
  });

  const handleMinimize = () => {
    window.app.minimize();
  };

  const handleMaximize = () => {
    if (maximized) {
      window.app.unmaximize();
    } else {
      window.app.maximize();
    }
    setMaximized(!maximized);
  };

  const handleClose = () => {
    window.app.exit();
  };
  
  return (
    <div className="nonDraggable">
      <Button variant="ghost" onClick={handleMinimize}><Minus /></Button>
      <Button variant="ghost" onClick={handleMaximize}>
       {maximized ? <Minimize />:  <Maximize /> }
      </Button>
      <Button variant="link" className="text-muted-foreground hover:text-white hover:bg-destructive"
      onClick={handleClose}><X /></Button>
    </div>
  )
};
