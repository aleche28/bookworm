const googleAPI = "https://www.googleapis.com/books/v1/volumes?q=";

const searchBook = async (title, author) => {
  let queryString = "";
  title && (queryString += `intitle:${title}+`);
  author && (queryString += `intuthor:${author}`);

  try {
    const res = await fetch(googleAPI + queryString);
    if (res.ok) {
      const list = await res.json();
      if (list.totalItems === 0) return [];

      const books = list.items.map((b) =>
        Object.assign({
          title: b.volumeInfo.title,
          author: b.volumeInfo.authors[0],
          imageLinks: b.volumeInfo.imageLinks,
        })
      );
      return books;
    } else {
      return { error: await res.text() };
    }
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = searchBook;
