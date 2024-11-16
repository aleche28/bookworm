export interface Book {
  id: string | undefined,
  title: string,
  author: string,
  googleBooksId: string,
  imageLinks: {
    smallThumbnail: string | undefined,
    thumbnail: string | undefined
  } | undefined,
  isbnCodes: {
    type: string,
    identifier: string
  }[] | undefined,
  favorite: boolean,
  list: any
}