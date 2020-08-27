import React from 'react';
import ReactDOM from 'react-dom';

import ApolloClient from 'apollo-boost';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const client = new ApolloClient({
  uri: 'http://192.168.100.3:2000/graphql',
  //uri: 'http://192.168.10.104:4000/graphql', 
  //uri: 'http://localhost:4000/graphql',
});

ReactDOM.render(
  // <React.StrictMode>
    <App client={client}/>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
