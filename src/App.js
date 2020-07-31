import React from 'react';
import './App.css';
import { ApolloProvider } from '@apollo/react-hooks';

import { ThemeProvider } from "@material-ui/styles";
import theme from "./theme";

import MainPage from './components/main/MainPage';



function App(props) {
  return (
    <ThemeProvider theme={theme}>
    <ApolloProvider client={props.client}>
    <div className="App">
      <MainPage/>
    </div>
    </ApolloProvider>
    </ThemeProvider>
  );
}

export default App;
