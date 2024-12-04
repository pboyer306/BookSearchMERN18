import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';  // Import Apollo Client

import Navbar from './components/Navbar';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: '/graphql', // Replace with your Apollo Server GraphQL endpoint
  cache: new InMemoryCache(),
});

function App() {
  return (
    // Wrap your application with ApolloProvider and pass the client to it
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
