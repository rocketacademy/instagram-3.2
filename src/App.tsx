import "./App.css";
import { useState, useEffect } from "react";
import { Instafeed } from "./InstaFeed";
import { InstaPost } from "./InstaPost";
import { SideBar } from "./SideBar";

// Save the Firebase message folder name as a constant to avoid bugs due to misspelling

function App() {
  useEffect(() => {
    console.log("App");
  }, []);
  const [view, setView] = useState<string | null | void>("post");

  const toggleView = (newView: string) => setView(newView);

  return (
    <div className="grid grid-cols-4 h-svh">
      {/* Side bar (child) can change the view of the parent component */}
      <SideBar toggleView={toggleView} />
      {view === "post" ? <InstaPost /> : <Instafeed />}
    </div>
  );
}

export default App;
