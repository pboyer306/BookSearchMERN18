import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useMutation } from '@apollo/client'; // Import useMutation
import { REMOVE_BOOK } from '../utils/mutations'; // Import REMOVE_BOOK mutation
import { GET_ME } from '../utils/queries'; // Import GET_ME for cache updating
import { removeBookId } from '../utils/localStorage';
import Auth from '../utils/auth';
import type { User } from '../models/User';
import type { Book } from '../models/Book';

const SavedBooks = () => {
  const [userData, setUserData] = useState<User>({
    username: '',
    email: '',
    password: '',
    savedBooks: [],
  });

  const [removeBook] = useMutation(REMOVE_BOOK, {
    update(cache, { data: { removeBook } }) {
      try {
        // Specify the expected type of the query result
        const cachedData = cache.readQuery<{ me: { savedBooks: Book[] } }>({
          query: GET_ME,
        });
  
        if (cachedData?.me) {
          cache.writeQuery({
            query: GET_ME,
            data: {
              me: {
                ...cachedData.me,
                savedBooks: removeBook.savedBooks,
              },
            },
          });
        }
      } catch (e) {
        console.error('Error updating the cache:', e);
      }
    },
    onError(err) {
      console.error('Error executing REMOVE_BOOK mutation:', err);
    },
  });
  
  const userDataLength = Object.keys(userData).length;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
          return false;
        }

        const response = await fetch('/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `
              query GetMe {
                me {
                  username
                  email
                  savedBooks {
                    bookId
                    title
                    authors
                    description
                    image
                  }
                }
              }
            `,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const { data } = await response.json();
        setUserData(data.me);
      } catch (err) {
        console.error(err);
        alert('Failed to load user data. Please try again.');
      }
    };

    getUserData();
  }, [userDataLength]);

  const handleDeleteBook = async (bookId: string) => {
    try {
      const { data } = await removeBook({ variables: { bookId } });

      if (data) {
        setUserData(data.removeBook);
        removeBookId(bookId);
      } else {
        throw new Error('Failed to delete book');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete the book. Please try again.');
    }
  };

  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          <h1>Viewing {userData.username || 'your'} saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book: Book) => (
            <Col md="4" key={book.bookId}>
              <Card border="dark">
                {book.image && <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant="top" />}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors.join(', ')}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
