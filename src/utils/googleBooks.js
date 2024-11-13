const googleAPI = "https://www.googleapis.com/books/v1/volumes?q=";

const searchBook = async (title, author, isbn) => {
  let queryString = "";
  title && (queryString += `intitle:${title}+`);
  author && (queryString += `inauthor:${author}`);
  isbn && (queryString += `isbn:${isbn}`);

  try {
    const res = await fetch(googleAPI + queryString);
    if (res.ok) {
      const list = await res.json();
      if (list.totalItems === 0) return [];

      const books = list.items.map((b) => {
        const temp = Object.assign({
          title: b.volumeInfo.title,
          author: b.volumeInfo.authors && b.volumeInfo.authors[0],
          googleBooksId: b.id,
          imageLinks: b.volumeInfo.imageLinks,
          isbnCodes: b.volumeInfo.industryIdentifiers,
        });

        if (temp.author && temp.imageLinks) {
          return temp;
        }

        getBookBySelfLink(b.selfLink).then((res) => {
          temp.author =
            temp.author || res?.volumeInfo?.authors?.at(0) || "Unknown author";
          temp.imageLinks = temp.imageLinks || res?.volumeInfo?.imageLinks;
        });
        return temp;
      });
      return books;
    } else {
      return { error: await res.text() };
    }
  } catch (error) {
    return { error: error.message };
  }
};

const getBookBySelfLink = async (selfLink) => {
  const res = await fetch(selfLink);

  if (res.ok) {
    return await res.json();
  } else {
    return {};
  }
};

export { searchBook };
