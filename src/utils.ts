import { database, storage } from "./firebase";
// import { onChildAdded, push, ref, set } from "firebase/database";
import { ref, uploadBytes, listAll } from "firebase/storage";

// upload a file

export const uploadFile = async (
  file: Blob | Uint8Array | ArrayBuffer | any,
  post: string
) => {
  const storageRef = ref(storage);
  const pdfRef = ref(storageRef, `posts/${file.name}`);
  const result = await uploadBytes(pdfRef, file, {
    customMetadata: {
      message: post,
    },
  });
  if (result) {
    console.log("uploaded");
  }
};
