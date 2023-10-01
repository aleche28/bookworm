import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

async function getList(uid, type) {
  if (type !== "read_books" && type !== "toread_books" && type !== "reading_books") {
    throw new Error("This type of list does not exist.");
  }

  const docRef = doc(db, "read_books", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const list = [];
    // console.log("Document data:", docSnap.data());
    docSnap.data().list.forEach(b => list.push(b));
    return list;
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
    return [];
  }
}

export { getList };