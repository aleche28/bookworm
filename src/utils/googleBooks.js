const googleAPI = "https://www.googleapis.com/books/v1/volumes?q=";

const searchBook = async (title, author) => {
  let queryString = "";
  title && (queryString += `intitle:${title}+`);
  author && (queryString += `inauthor:${author}`);

  try {
    const res = await fetch(googleAPI + queryString);
    if (res.ok) {
      const list = await res.json();
      if (list.totalItems === 0) return [];

      const books = list.items.map((b) =>
        Object.assign({
          title: b.volumeInfo.title,
          author: b.volumeInfo.authors[0],
          googleBooksId: b.id,
          imageLinks: b.volumeInfo.imageLinks,
          /* if there are no imageLinks, a try can be made calling
           * directly the API for the specific book
           * (just access the field selfLink or make a GET for the specific book Id)
           */
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
