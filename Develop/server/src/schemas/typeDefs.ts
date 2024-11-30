const typeDefs = `
  type User {
    _id: String!
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
    bookCount: Int!
  }

  type Book {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  type Auth {
    token: ID!
    user: User
  }
  
  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  input BookInput {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }


  type Query {
    me: User
  }

  type Mutation {
    login(username: String!, password: String!, email: String!): Auth
    createUser(user: UserInput!): Auth
    saveBook(book: BookInput!): User
    deleteBook(bookId: ID!): User
  }
`;

export default typeDefs;
