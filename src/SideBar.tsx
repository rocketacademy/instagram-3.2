import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";

export const SideBar = ({ toggleView }: any) => {
  // "post" or "view"
  const [sidebarState, setSidebarState] = useState<string | null>("post");
  console.log(sidebarState);
  return (
    <div className="grid-start-1 grid-span-1 bg-red-200 p-5">
      <h1 className="text-3xl text-zinc-950">Menu</h1>
      {sidebarState === "post" ? (
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
              toggleView("view");
              setSidebarState("view");
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
              toggleView("post");
              setSidebarState("post");
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
