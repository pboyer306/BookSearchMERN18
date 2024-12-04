import { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Container } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';  // Import the SAVE_BOOK mutation
import type { Book } from '../models/Book';  // Assuming you have a Book type

const SearchBook = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchedBooks, setSearchedBooks] = useState<Book[]>([]);

  // Use Apollo's useMutation hook to execute the SAVE_BOOK mutation
  const [saveBook, { error: saveBookError }] = useMutation(SAVE_BOOK);

  // Fetch books when the component mounts
  useEffect(() => {
    const fetchDefaultBooks = async () => {
      try {
        const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=javascript');
        const data = await response.json();
        const books = data.items.map((item: any) => ({
          bookId: item.id,
          title: item.volumeInfo.title,
          authors: item.volumeInfo.authors,
          description: item.volumeInfo.description,
          image: item.volumeInfo.imageLinks?.thumbnail || '',
        }));
        setSearchedBooks(books);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchDefaultBooks();
  }, []);  // Empty dependency array means this runs only once when the component mounts

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchInput}`);
      const data = await response.json();
      const books = data.items.map((item: any) => ({
        bookId: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors,
        description: item.volumeInfo.description,
        image: item.volumeInfo.imageLinks?.thumbnail || '',
      }));
      setSearchedBooks(books);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleSaveBook = async (book: Book) => {
    try {
      await saveBook({
        variables: {
          bookId: book.bookId,
          title: book.title,
          authors: book.authors,
          description: book.description,
          image: book.image,
        },
      });
      alert('Book saved successfully!');
    } catch (err) {
      console.error('Error saving book:', err);
    }
  };

  return (
    <Container>
      <h1>Search for Books</h1>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search books"
        />
        <Button type="submit">Search</Button>
      </form>

      <Row>
        {searchedBooks.length > 0 ? (
          searchedBooks.map((book) => (
            <Col md="4" key={book.bookId}>
              <Card>
                {book.image && <Card.Img src={book.image} alt={`Cover for ${book.title}`} />}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <Card.Text>
                    <strong>Authors:</strong> {book.authors?.join(', ')}
                  </Card.Text>
                  <Card.Text>{book.description}</Card.Text>
                  <Button onClick={() => handleSaveBook(book)}>Save Book</Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No books found</p>
        )}
      </Row>

      {saveBookError && <p>Error saving the book!</p>}
    </Container>
  );
};

export default SearchBook;
