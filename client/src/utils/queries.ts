import { gql } from '@apollo/client';

// Define the GET_ME query
export const GET_ME = gql`
  query getMe {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
      }
    }
  }
`;
