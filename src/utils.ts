import { database, storage } from "./firebase";
// import { onChildAdded, push, ref, set } from "firebase/database";
import { ref, uploadBytes } from "firebase/storage";

// upload a file

const uploadFile = async (
  file: Blob | Uint8Array | ArrayBuffer | any,
  post: string
) => {
  const storageRef = ref(storage);
  const pdfRef = ref(storageRef, `pdf/${file.name}`);
  const result = await uploadBytes(pdfRef, file, {
    customMetadata: {
      test: post,
    },
  });
  if (result) {
    console.log("uploaded");
  }
};

export default uploadFile;
