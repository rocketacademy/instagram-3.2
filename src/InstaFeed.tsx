import { useEffect, useState } from "react";
import { storage } from "./firebase";
import logo from "/logo.png";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";

// import { listAllFiles } from "./utils";

export const Instafeed = () => {
  const [imageName, setImageName] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  console.log("start");

  useEffect(() => {
    console.log("test");
    console.log("hello world");
    const postRef = ref(storage, "posts/");
    listAll(postRef).then((res) => {
      const images = res.items.map((item) => item.name);
      setImageName((prev) => [...prev, images]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="col-span-3 col-start-2 mx-0 bg-amber-200 p-10">
      <img src={logo} className="h-20 mb-5 my-0 mx-auto" alt="Rocket logo" />
      <h1 className="text-4xl">Instagram Feed</h1>
      {loading === true ? (
        <h2>Loading</h2>
      ) : (
        imageName.map((i) => (
          <div>
            <h2 key={i}>{i}</h2>
          </div>
        ))
      )}
    </div>
  );
};
