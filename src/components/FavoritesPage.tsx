/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { BookRow } from "./BookRow";
import { getFavorites, getList, updateList } from "../books";
import { useNavigate } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import { Book } from "../interfaces/Book";
import { useToastContext } from "../toast-context";

const FavoritesPage = () => {
  const { user } = useContext(AuthContext);
  const { showErrorToast } = useToastContext();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);

  const navigate = useNavigate();

  async function fetchBooks() {
    setLoading(true);
    if (!user) {
      setBooks([]);
    } else if (!user.uid) {
      navigate("/login");
    } else {
      try {
        const list = await getFavorites(user.uid);
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
  }, [user]);

  async function handleUpdate(book: Book) {
    if (!user || !user.uid) {
      return;
    }
    const list = await getList(user.uid, book.list);
    const newlist: Book[] = [];
    list.map((b: Book) => {
      if (b.id !== undefined && b.id !== book.id) newlist.push(b);
      else newlist.push(book);
      return null;
    });
    await updateList(user.uid, book.list, newlist);
    fetchBooks();
  }

  return (
    <>
      {user?.uid && (
        <>
          <h2>Favorites</h2>
          {loading ? (
            <div className="p-d-flex p-jc-start p-my-5">
              <ProgressSpinner />
            </div>
          ) : (
            <>
              {books.length > 0 ? (
                <div className="p-grid p-justify-center book-rows-container">
                  {books.map((b, i) => (
                    <BookRow
                      key={i}
                      id={i}
                      book={b}
                      showBookListTag={true}
                      showFavoriteButton={false}
                      handleUpdate={handleUpdate}
                    />
                  ))}
                </div>
              ) : (
                <span>You don't have any favorite book yet.</span>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export { FavoritesPage };
