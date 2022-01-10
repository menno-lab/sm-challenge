import React, { useState } from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
import PostReader from './components/PostReader';

function App() {

  const [isLoggedIn, setisLoggedIn] = useState<boolean>(false);
  const [slToken, setslToken] = useState("");

  // if user is logged in, return the application
  if (isLoggedIn) {
    return (
      <div className="App">
        <PostReader setisLoggedIn={setisLoggedIn} slToken={slToken} />
      </div>     
    )
  }

  // if not logged in or token expired/invalid, return login page
  return (
    <div className="App">
      <LoginPage setisLoggedIn={setisLoggedIn} setslToken={setslToken} />
    </div>
  );
}

export default App;
