import { Button } from "primereact/button";
import { Book } from "../interfaces/Book";

interface SearchResultRowProps {
  book: Book;
  handleSelected: () => void;
}

const SearchResultRow = ({ book, handleSelected }: SearchResultRowProps) => {
  return (
    <div className="p-grid p-align-center p-justify-between book-row border rounded p-p-2">
      <div className="p-col-2 book-row-thumbnail">
        <img
          src={book.imageLinks?.thumbnail || ""}
          alt={book.title}
          className="p-mb-2"
          style={{ maxWidth: "100%" }}
        />
      </div>
      <div className="p-col-8 book-row-title-author">
        <div className="book-row-title p-text-bold">{book.title}</div>
        <div className="book-row-author p-mt-1">{book.author}</div>
      </div>
      <div className="p-col-2 p-d-flex p-jc-end">
        <Button icon="pi pi-check" onClick={handleSelected} />
      </div>
    </div>
  );
};

export { SearchResultRow };
