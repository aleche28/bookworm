import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { BookRow } from "./BookRow";
import { getFavorites, getList, updateList } from "../books";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import * as React from "react";
import { Book } from "../interfaces/Book";

const FavoritesPage = () => {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [books, setBooks] = useState<Book[]>([]);

  const toast = React.useRef<any>(null);
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
        setErrMsg("");
        setBooks(list);
      } catch (err: any) {
        setErrMsg(err.message);
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
      <Toast ref={toast} />
      {errMsg &&
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: errMsg,
          life: 3000,
        })}
      {infoMsg &&
        toast.current?.show({
          severity: "info",
          summary: "Info",
          detail: infoMsg,
          life: 3000,
        })}

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
                    <Card key={i} className="p-col-12 p-md-8 p-lg-6">
                      <BookRow
                        key={i}
                        id={i}
                        book={b}
                        favoritesPage={true}
                        handleUpdate={handleUpdate}
                      />
                    </Card>
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
