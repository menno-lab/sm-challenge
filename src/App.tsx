import { useState, useEffect } from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
import PostReader from './components/PostReader';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

function App() {

  const [isLoggedIn, setisLoggedIn] = useState<boolean>(false);
  const [slToken, setslToken] = useState("");
  const [redirect, setRedirect] = useState("");

  // check local storage for sl_token
  useEffect(() => {
    const sl_token: any = JSON.parse(localStorage.getItem('sl_token') || '{}');
    if ('sl_token' in sl_token) {
      // if token is found in local storage, the login can be persisted
      setslToken(sl_token.sl_token);
      setisLoggedIn(true);
      setRedirect("/posts");
    } else {
      setRedirect("/login");
    }
  }, [isLoggedIn]);

  return (
    <div className="App">
      <BrowserRouter>
      {
        redirect ? <Redirect to={redirect} /> : ""
      }
        <Switch>
          <Route path="/login">
            <LoginPage setisLoggedIn={setisLoggedIn} setslToken={setslToken} />
          </Route>
          <Route path="/posts">
            <PostReader setisLoggedIn={setisLoggedIn} slToken={slToken} />
          </Route>
          <Route path="/">
            <Redirect to="/login"/>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
