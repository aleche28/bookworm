/* eslint-disable @typescript-eslint/no-explicit-any */
// src/books.ts
import { db } from "./firebase";
import {
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  DocumentReference,
} from "firebase/firestore";
import { Book } from "./interfaces/Book";

// interface Book {
//   title: string;
//   author: string;
//   googleBooksId: string;
//   favorite?: boolean;
//   [key: string]: any;
// }

const listTypes: { [key: string]: string } = {
  reading_books: "Reading",
  read_books: "Read",
  toread_books: "To read",
};

async function getList(uid: string, type: string): Promise<Book[]> {
  if (!(type in listTypes)) {
    throw new Error("This type of list does not exist.");
  }

  const docRef: DocumentReference = doc(db, type, uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().list || [];
  } else {
    return [];
  }
}

async function updateList(
  uid: string,
  type: string,
  newList: Book[]
): Promise<void> {
  if (!(type in listTypes)) {
    throw new Error("This type of list does not exist.");
  }

  const docRef: DocumentReference = doc(db, type, uid);
  await setDoc(docRef, { list: newList }, { merge: true });
}

async function addToList(uid: string, type: string, book: Book): Promise<void> {
  if (!(type in listTypes)) {
    throw new Error("This type of list does not exist.");
  }

  const docRef: DocumentReference = doc(db, type, uid);
  await updateDoc(docRef, { list: arrayUnion(book) });
}

async function getFavorites(uid: string): Promise<Book[]> {
  const list: Book[] = [];
  for (const type in listTypes) {
    if (!type) continue;
    const docRef: DocumentReference = doc(db, type, uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      docSnap.data().list.forEach((b: Book) => {
        if (b.favorite) list.push({ ...b, list: type });
      });
    }
  }
  return list;
}

export { getList, updateList, addToList, getFavorites, listTypes };
