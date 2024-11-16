import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { searchBook } from "../utils/googleBooks";
import { SearchResultRow } from "./SearchResultRow";
import { addToList } from "../books";
import { AuthContext } from "../auth/AuthContext";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { ProgressSpinner } from "primereact/progressspinner";
import { Book } from "../interfaces/Book";

const SearchBook = () => {
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const listType = location.state?.listType;

  const handleSave = async (selectedIndex: number) => {
    if (!user || !user.uid) {
      return;
    }
    setIsLoading(true);

    const book = {
      id: uuidv4(),
      title: results[selectedIndex].title,
      author: results[selectedIndex].author,
      favorite: false,
      googleBooksId: results[selectedIndex].googleBooksId,
      imageLinks: results[selectedIndex].imageLinks || {},
      isbnCodes: results[selectedIndex].isbnCodes || {},
    };

    try {
      await addToList(user.uid, listType, book);
      const path = "/" + listType.split("_")[0];
      navigate(path, {
        state: { infoMsg: "Book successfully added to the list!" },
      });
    } catch (err) {
      setErrMsg("An error occurred while trying to add the book!");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGoogleBooks = async () => {
    setIsLoading(true);
    const res = await searchBook(title, author, isbn);
    if (!res.error) {
      setResults(res);
    } else {
      console.error(res.error);
      setResults([]);
    }
    setIsLoading(false);
  };

  return (
    <Card className="p-shadow-6 p-p-4">
      <h2>Search for a Book</h2>
      <Divider />
      <form>
        <div className="p-field p-grid p-my-3">
          <label htmlFor="title" className="p-col-12 p-md-2">
            Title
          </label>
          <div className="p-col-12 p-md-8">
            <span className="p-input-icon-right">
              <i className="pi pi-search" />
              <InputText
                id="title"
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </span>
            <Button
              icon="pi pi-search"
              label="Search"
              className="p-ml-2"
              disabled={!title && !author && !isbn}
              onClick={fetchGoogleBooks}
            />
          </div>
        </div>
        <div className="p-field p-grid p-my-3">
          <label htmlFor="author" className="p-col-12 p-md-2">
            Author
          </label>
          <div className="p-col-12 p-md-8">
            <InputText
              id="author"
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
        </div>
        <div className="p-field p-grid p-my-3">
          <label htmlFor="isbn" className="p-col-12 p-md-2">
            ISBN
          </label>
          <div className="p-col-12 p-md-8">
            <InputText
              id="isbn"
              type="text"
              placeholder="ISBN"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
          </div>
        </div>
      </form>
      {errMsg && (
        <Message
          severity="error"
          text={errMsg}
          className="p-mt-3"
          onClose={() => setErrMsg("")}
        />
      )}
      <Divider />
      <div className="p-d-flex p-flex-column p-ai-center">
        {isLoading && <ProgressSpinner />}
        {!isLoading &&
          results.map((book, i) => (
            <SearchResultRow
              key={i}
              book={book}
              handleSelected={() => handleSave(i)}
            />
          ))}
      </div>
    </Card>
  );
};

export { SearchBook };
