// src/googleBooks.ts

import { getErrorMessage } from "./errorHelpers";

const googleAPI = "https://www.googleapis.com/books/v1/volumes?q=";

interface Book {
  title: string;
  author: string;
  googleBooksId: string;
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
  };
  isbnCodes?: Array<{ type: string; identifier: string }>;
}

interface BookResult {
  error?: string;
  books?: Book[];
}

const searchBook = async (
  title?: string,
  author?: string,
  isbn?: string
): Promise<BookResult> => {
  let queryString = "";
  if (title) queryString += `intitle:${title}+`;
  if (author) queryString += `inauthor:${author}`;
  if (isbn) queryString += `isbn:${isbn}`;

  try {
    const res = await fetch(googleAPI + queryString);
    if (res.ok) {
      const list = await res.json();
      if (list.totalItems === 0) return { books: [] };

      const books = list.items.map((b: any): Book => {
        const temp: Book = {
          title: b.volumeInfo.title,
          author: b.volumeInfo.authors?.[0] || "Unknown author",
          googleBooksId: b.id,
          imageLinks: b.volumeInfo.imageLinks,
          isbnCodes: b.volumeInfo.industryIdentifiers,
        };

        getBookBySelfLink(b.selfLink).then((res) => {
          temp.author = temp.author || res?.volumeInfo?.authors?.[0] || "Unknown author";
          temp.imageLinks = temp.imageLinks || res?.volumeInfo?.imageLinks;
        });
        return temp;
      });
      return { books };
    } else {
      return { error: await res.text() };
    }
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
};

const getBookBySelfLink = async (selfLink: string): Promise<any> => {
  const res = await fetch(selfLink);

  if (res.ok) {
    return await res.json();
  } else {
    return {};
  }
};

export { searchBook };
