import { gql } from '@apollo/client';

// Mutation to login a user
export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

// Mutation to create a new user
export const ADD_USER = gql`
  mutation CreateUser( $username: String!, $email: String!, $password: String!) {
  createUser(username: $username, email: $email, password: $password) {
    token
    user {
      _id
      bookCount
      email
      password
      username
    }
  }
}`;

// Mutation to save a book to the user's saved books
export const SAVE_BOOK = gql`
  mutation SaveBook(
    $bookId: String!
    $title: String!
    $authors: [String]
    $description: String
    $image: String
  ) {
    saveBook(
      bookId: $bookId
      title: $title
      authors: $authors
      description: $description
      image: $image
    ) {
      _id
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
`;

// Mutation to remove a saved book
export const REMOVE_BOOK = gql`
  mutation RemoveBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      _id
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
`;
