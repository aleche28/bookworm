/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { searchBook } from "../utils/googleBooks.js";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Book } from "../interfaces/Book.js";

interface AddEditFormProps {
  book: Book;
  edit: boolean;
  handleUpdate: (b: Book) => void;
  cancelEditBook: () => void;
  handleAdd?: (b: Book) => void;
  setAddBook?: (val: boolean) => void;
}

const AddEditForm = (props: AddEditFormProps) => {
  const [title, setTitle] = useState<string>(props.book?.title || "");
  const [author, setAuthor] = useState<string>(props.book?.author || "");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [googleBooksResults, setGoogleBooksResults] = useState<Book[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const handleSave = (event: any) => {
    event.preventDefault();
    const book = {
      ...props.book, // edited fields will be overwritten
      title,
      author,
      favorite: props.book?.favorite || false,
    };

    if (selectedIndex !== -1) {
      const { googleBooksId, imageLinks } = googleBooksResults[selectedIndex];
      book.googleBooksId = googleBooksId;
      if (imageLinks !== undefined) {
        book.imageLinks = imageLinks;
      }
    }

    // props.edit ? props.handleUpdate(book) : props.handleAdd(book);
    if (props.edit) {
      props.handleUpdate(book);
    }
  };

  const fetchGoogleBooks = async () => {
    setSelectedIndex(-1);
    const res = await searchBook(title, author);
    if (!res.error) setGoogleBooksResults(res.books || []);
    else setGoogleBooksResults([]);
  };

  const handleSelectChange = (event: any) => {
    event.preventDefault();
    const selectedOption = event.target.value;
    setSelectedIndex(selectedOption);
    const selectedBook = googleBooksResults[selectedOption];
    setTitle(selectedBook.title);
    setAuthor(selectedBook.author);
  };

  return (
    <>
      {
        <form onSubmit={handleSave}>
          <div className="p-field">
            <label htmlFor="title">Title</label>
            <div className="p-inputgroup">
              <InputText
                required
                placeholder="Title"
                value={title}
                onChange={(ev) => {
                  setTitle(ev.target.value);
                }}
              />
              <Button
                disabled={!title}
                icon="bi bi-search"
                onClick={() => {
                  fetchGoogleBooks();
                  setShowDropdown(true);
                }}
              />
            </div>
          </div>
          {showDropdown && (
            <Dropdown
              placeholder="Select book from Google Books"
              value={selectedIndex}
              onChange={handleSelectChange}
              options={googleBooksResults.map((b, i) => ({
                label: `${b.title} - ${b.author}`,
                value: i,
              }))}
            />
          )}

          <div className="p-field">
            <label htmlFor="author">Author</label>
            <InputText
              required
              placeholder="Author"
              value={author}
              onChange={(ev) => {
                setAuthor(ev.target.value);
              }}
            />
          </div>

          <div className="p-grid">
            <div className="p-col-12 p-md-3 p-mb-2">
              <Button label="Save" disabled={!title || !author} type="submit" />
            </div>
            <div className="p-col-12 p-md-3 p-mb-2">
              <Button
                label="Cancel"
                onClick={() =>
                  // props.edit ? props.cancelEditBook() : props.setAddBook?(false)
                  props.edit && props.cancelEditBook()
                }
              />
            </div>
          </div>
        </form>
      }
    </>
  );
};

export { AddEditForm };
