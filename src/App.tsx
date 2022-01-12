import { useState, useEffect } from 'react';
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
      // check if url contains a search parameter
      const params = window.location.href.split("posts/")[1];
      // if yes, redirect to the right path
      if (params) {
        setRedirect("/posts/"+params);
      } else {
        // redirect to all posts
        setRedirect("/posts");
      }
    } else {
      // if no token found, go to login page
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
          <Route path="/posts/:author?">
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
