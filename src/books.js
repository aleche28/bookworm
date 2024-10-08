import { db } from "./firebase";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const listTypes = {
  reading_books: "Reading",
  read_books: "Read",
  toread_books: "To read",
};

async function getList(uid, type) {
  if (!(type in listTypes)) {
    throw new Error("This type of list does not exist.");
  }

  const docRef = doc(db, type, uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const list = [];
    docSnap.data().list.forEach((b) => list.push(b));
    return list;
  } else {
    // docSnap.data() will be undefined in this case
    return [];
  }
}

async function updateList(uid, type, newList) {
  if (!(type in listTypes)) {
    throw new Error("This type of list does not exist.");
  }

  const docRef = doc(db, type, uid);
  await setDoc(docRef, { list: newList }, { merge: true });
}

async function addToList(uid, type, book) {
  if (!(type in listTypes)) {
    throw new Error("This type of list does not exist.");
  }

  const docRef = doc(db, type, uid);
  await updateDoc(docRef, { list: arrayUnion(book) });
}

async function getFavorites(uid) {
  /* firebase doesn't support query on multiple collections,
  so three reads are necessary: one for each book list */
  const list = [];
  for (const type in listTypes) {
    if (!type) continue;
    const docRef = doc(db, type, uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      docSnap.data().list.forEach((b) => {
        if (b.favorite) list.push({ ...b, list: type });
      });
    }
  }
  return list;
}

export { getList, updateList, addToList, getFavorites, listTypes };
