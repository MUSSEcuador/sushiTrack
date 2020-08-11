import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { ApolloProvider } from "@apollo/react-hooks";

import { ThemeProvider } from "@material-ui/styles";

import theme from "./theme";
import CssBaseline from "@material-ui/core/CssBaseline";

import PrivateRoute from "./components/common/PrivateRoute";
import "./App.css";
import Login from "./components/main/Login";
import Track from "./components/tracking/Track";

function App(props) {
  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={props.client}>
        <CssBaseline />
        <Router>
          <div className="App">
            <Route exact path="/" component={Login} />
            <Route exact path="/login" component={Login} />
            <Switch>
              <PrivateRoute exact path="/track" component={Track} />
            </Switch>
          </div>
        </Router>
      </ApolloProvider>
    </ThemeProvider>
  );
}

export default App;
