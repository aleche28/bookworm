import { useContext, useEffect, useState } from "react";
import { searchBook } from "../utils/googleBooks";
import { AuthContext } from "../auth/AuthContext";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Book } from "../interfaces/Book";
import { FloatLabel } from 'primereact/floatlabel';
import { BookRow } from "./BookRow";
import { useNavigate } from "react-router-dom";
import { ListTypeKey } from "./BookList";
import { getList } from "../books";
import { Dialog } from 'primereact/dialog';
import { BarcodeScanner } from 'react-barcode-scanner'

const SearchBook = () => {
  const { user } = useContext(AuthContext);

  const [readlist, setReadlist] = useState<Book[]>([]);
  const [toreadlist, setToreadlist] = useState<Book[]>([]);
  const [readinglist, setReadinglist] = useState<Book[]>([]);

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [results, setResults] = useState<Book[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [scanDialogVisible, setScanDialogVisible] = useState(false);

  const fetchGoogleBooks = async () => {
    setIsLoading(true);
    const res = await searchBook(title, author, isbn);
    if (!res.error) {
      const resList = res.books?.map(b => {
        if (readlist.find(readBook => readBook.googleBooksId === b.googleBooksId)) {
          return { ...b, list: "read_books" };
        }
        if (readinglist.find(readingBook => readingBook.googleBooksId === b.googleBooksId)) {
          return { ...b, list: "reading_books" };
        }
        if (toreadlist.find(toReadBook => toReadBook.googleBooksId === b.googleBooksId)) {
          return { ...b, list: "toread_books" };
        }
        return b;
      });
      setResults(resList || []);
    } else {
      console.error(res.error);
      setResults([]);
    }
    setIsLoading(false);
  };

  async function fetchList(
    listType: ListTypeKey,
    setList: (list: Book[]) => void
  ) {
    if (!user || !user.uid) return;

    try {
      const list = await getList(user.uid, listType);
      setList(list);
    } catch (err: unknown) {
      console.error(err);
      setList([]);
    }
  }

  const onBarCodeCapture = (ev) => {
    const scannedIsbn = ev[0].rawValue;
    if (!scannedIsbn) {
      console.error("Scanned invalid ISBN");
    }

    setIsbn(scannedIsbn);
    setScanDialogVisible(false);
  }

  useEffect(() => {
    setIsLoading(true);
    if (!user) {
      setReadlist([]);
      setReadinglist([]);
      setToreadlist([]);
    } else if (!user.uid) {
      navigate("/login");
    } else {
      fetchList("read_books", setReadlist);
      fetchList("reading_books", setReadinglist);
      fetchList("toread_books", setToreadlist);
    }
    setIsLoading(false);
    // eslint-disable-next-line
  }, [user]);

  return (
    <div className="centered-full-width">
      <Card title="Search book" className="search-form-card">
        <FloatLabel className="my-4">
          <InputText
            id="title"
            className="search-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="title">Title</label>
        </FloatLabel>
        <FloatLabel className="my-4">
          <InputText
            id="author"
            className="search-input"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <label htmlFor="author">Author</label>
        </FloatLabel>
        <FloatLabel className="my-4">
          <div className="p-inputgroup search-input">
            <InputText
              id="isbn"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
            <Button icon="pi pi-barcode" onClick={() => setScanDialogVisible(true)} />
          </div>
          <label htmlFor="isbn">ISBN</label>
        </FloatLabel>
        <div className="flex justify-content-center">
          <Button
            icon="pi pi-search"
            label="Search"
            disabled={!title && !author && !isbn}
            onClick={fetchGoogleBooks}
          />
        </div>
      </Card>
      <div className="my-5">
        {isLoading && <ProgressSpinner />}
        {!isLoading && results &&
          <div>
            <h2>Results</h2>
            {results.map((book) => (
              <BookRow key={book.googleBooksId} book={book} id={0} showBookListTag={true} handleUpdate={(b) => { console.log(b) }} />
            ))}
            {results.length === 0 &&
              <p>No book found.</p>}
          </div>}
      </div>
      <Dialog header="Header" visible={scanDialogVisible} style={{ width: '20rem' }} onHide={() => { if (!scanDialogVisible) return; setScanDialogVisible(false); }}>
        <BarcodeScanner options={{ formats: ["ean_13", "ean_8"] }} onCapture={onBarCodeCapture} />
      </Dialog>
    </div>
  );
};

export { SearchBook };
