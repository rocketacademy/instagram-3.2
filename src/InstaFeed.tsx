import { useEffect, useState } from "react";
import { storage } from "./firebase";
import logo from "/logo.png";
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  getMetadata,
  FullMetadata,
} from "firebase/storage";
import { randomUUID } from "crypto";

// import { listAllFiles } from "./utils";

export const Instafeed = () => {
  const [imageObject, setImageObject] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  type Image = {
    url: string;
    data: FullMetadata;
    updatedAt: string;
  };
  const sortByUpdatedAt = (a: Image, b: Image) => {
    return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
  };
  console.log("start");
  useEffect(() => {
    const retrieveImageObjects = async () => {
      const postRef = ref(storage, "posts/");
      const postReferences = await listAll(postRef);
      postReferences.items.forEach((p_ref) => {
        const fullPathRef = p_ref.fullPath;
        // const imageUrl = await getDownloadURL(ref(storage, fullPathRef));
        getDownloadURL(ref(storage, fullPathRef)).then((imageUrl) => {
          getMetadata(ref(storage, fullPathRef)).then((imageData) => {
            return setImageObject((prev) => [
              ...prev,
              {
                url: imageUrl,
                data: imageData.customMetadata?.message,
                updatedAt: imageData.updated,
              },
            ]);
          });
        });
      });

      setLoading(false);
    };
    retrieveImageObjects();
  }, []);

  const images = imageObject.sort(sortByUpdatedAt).map((imgObj, ind) => (
    <figure key={ind}>
      <img loading="lazy" src={imgObj.url} className="h-48 mx-auto p-3" />
      <figcaption className="text-2xl bg-red-300 p-2">{imgObj.data}</figcaption>
      <span className="text-m">{new Date(imgObj.updatedAt).toUTCString()}</span>
    </figure>
  ));
  console.log("images", images);

  return (
    <div className="col-span-3 col-start-2 mx-0 bg-amber-200 p-10">
      <img src={logo} className="h-20 mb-5 my-0 mx-auto" alt="Rocket logo" />
      <h1 className="text-4xl">Instagram Feed</h1>
      {loading === true ? <h2>Loading</h2> : images}
    </div>
  );
};
