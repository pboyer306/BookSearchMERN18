import { User } from "../models/index.js";
import { signToken, AuthenticationError } from "../utils/auth.js";

interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  savedBooks: Book[];
  bookCount: number;
}

interface Context {
  user?: User;
}

interface Book {
  authors: string[];
  description: string;
  bookId: string;
  image: string;
  link: string;
  title: string;
}

const resolvers = {
  Query: {
    me: async (
      _parent: any,
      _args: any,
      context: Context
    ): Promise<User | null> => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
  },
  Mutation: {
    login: async (
      _parent: any,
      {
        username,
        password,
        email,
      }: { username: string; password: string; email: string }
    ): Promise<{ token: string; user: any }> => {
      const user = await User.findOne({
        $or: [{ username: username }, { email: email }],
      });
      if (!user) {
        throw AuthenticationError;
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw AuthenticationError;
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    createUser: async (
      _parent: any,
      {
        username,
        password,
        email,
      }: { username: string; password: string; email: string }
    ): Promise<{ token: string; user: any }> => {
      const user = await User.create({ username, password, email });
      if (!user) {
        throw AuthenticationError;
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    saveBook: async (
      _parent: any,
      { book }: { book: Book },
      context: Context
    ): Promise<{ user: any }> => {
      if (context.user) {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: book } },
            { new: true, runValidators: true }
          );
          if (!updatedUser) {
            throw new Error("Couldn't find user with this id!");
          }
          return updatedUser as any;
        } catch (err) {
          console.log(err);
          throw new Error("Couldn't save book.");
        }
      } else {
        throw AuthenticationError;
      }
    },
    deleteBook: async (
      _parent: any,
      { bookId }: { bookId: string },
      context: Context
    ): Promise<{ user: any }> => {
      if (context.user) {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId: bookId } } },
            { new: true }
          );
          if (!updatedUser) {
            throw new Error("Couldn't find user with this id!");
          }
          return updatedUser as any;
        } catch (err) {
          console.log(err);
          throw new Error("Couldn't delete book.");
        }
      } else {
        throw AuthenticationError;
      }
    },
  },
};

export default resolvers;
