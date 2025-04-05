/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { getList, listTypes, updateList } from "../books";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { useLocation, useNavigate } from "react-router-dom";
import { AddEditForm } from "./AddEditForm";
import { BookRow } from "./BookRow";
import { Book } from "../interfaces/Book";
import { useToastContext } from "../toast-context.tsx";

type ListTypeKey = "toread_books" | "read_books" | "reading_books";

interface BookListProps {
  listType: ListTypeKey;
  listName: string;
}

const BookList = (props: BookListProps) => {
  const { user } = useContext(AuthContext);
  const { showErrorToast, showSuccessToast } = useToastContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);

  const [editBook, setEditBook] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);

  async function fetchBooks() {
    setLoading(true);
    if (!user) {
      setBooks([]);
    } else if (!user.uid) {
      navigate("/login");
    } else {
      try {
        const list = await getList(user.uid, props.listType);
        setBooks(list);
      } catch (err: any) {
        showErrorToast(err.message);
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, [user, location]);

  // TODO: Update this to delete based on book uuid and not based on book position
  const handleDelete = async (index: number) => {
    if (!user || !user.uid) {
      return;
    }
    const newlist: Book[] = [];
    books.map((b, i) => {
      if (index !== i) newlist.push(b);
      return null;
    });
    await updateList(user.uid, props.listType, newlist);
    fetchBooks();
    showSuccessToast("Book removed from the list");
  };

  const handleUpdate = async (id: number, book: Book, showMsg = true) => {
    if (!user || !user.uid) {
      return;
    }
    // temp implementation: old book is deleted and new book is added
    const newlist: Book[] = [];
    books.map((b, i) => {
      if (id !== i) newlist.push(b);
      else newlist.push(book);
      return null;
    });
    setEditBook(false);
    setEditIndex(-1);
    await updateList(user.uid, props.listType, newlist);
    fetchBooks();
    if (showMsg) showSuccessToast("Book updated!");
  };

  return (
    <div className="p-grid p-justify-center">
      {loading ? (
        <div className="p-col-12 p-mt-5 p-d-flex p-jc-center">
          <ProgressSpinner />
        </div>
      ) : (
        user?.uid && (
          <div className="p-col-10">
            <h2 className="list-name">{listTypes[props.listType]}</h2>
            <div className="book-rows-container">
              {books.map((b, i) =>
                editBook && editIndex === i ? (
                  <div
                    key={i}
                    className="book-add-form p-mt-3 p-mb-3 p-p-3 p-border-round p-shadow-1"
                  >
                    <AddEditForm
                      edit={true}
                      handleUpdate={(book) => handleUpdate(i, book)}
                      cancelEditBook={() => {
                        setEditBook(false);
                        setEditIndex(-1);
                      }}
                      book={b}
                    />
                  </div>
                ) : (
                  <BookRow
                    key={i}
                    id={i}
                    book={b}
                    list={props.listType}
                    showBookListTag={false}
                    showFavoriteButton={true}
                    handleRemoveFromList={handleDelete}
                    handleUpdate={(book) => handleUpdate(i, book, false)}
                    toggleEditBook={() => {
                      setEditIndex(i);
                      setEditBook(true);
                    }}
                  />
                )
              )}

              <Button
                icon="pi pi-plus"
                label="Add Book"
                className="p-button-success p-mt-3"
                onClick={() =>
                  navigate("/search", {
                    state: { listType: props.listType },
                  })
                }
              />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export { BookList };
export type { ListTypeKey };
