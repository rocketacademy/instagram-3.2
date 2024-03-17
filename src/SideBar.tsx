import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";

export const SideBar = ({ toggleView }: any) => {
  // "post" or "view"
  const [view, setView] = useState<string | null>(null);

  useEffect(() => {
    setView("post");
  }, []);
  return (
    <div className="grid-start-1 grid-span-1 bg-red-200 p-5">
      <h1 className="text-3xl text-zinc-950">Menu</h1>
      {view === "post" ? (
        <div className="flex flex-col gap-5 pt-10">
          <Button
            variant={"secondary"}
            className="text-lg bg-red-500"
            size={"lg"}
          >
            Make a Post
          </Button>
          <Button
            variant={"secondary"}
            className="text-lg"
            size={"lg"}
            onClick={() => {
              setView("view");
              toggleView("view");
            }}
          >
            View feed
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-5 pt-10">
          <Button
            variant={"secondary"}
            className="text-lg"
            size={"lg"}
            onClick={() => {
              setView("post");
              toggleView("post");
            }}
          >
            Make a Post
          </Button>
          <Button
            variant={"secondary"}
            className="text-lg bg-red-500"
            size={"lg"}
          >
            View feed
          </Button>
        </div>
      )}
    </div>
  );
};
