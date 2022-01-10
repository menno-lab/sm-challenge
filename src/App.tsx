import React, { useState } from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
import PostReader from './components/PostReader';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  const [isLoggedIn, setisLoggedIn] = useState<boolean>(false);
  const [slToken, setslToken] = useState("");

  function ComponentToRender(): JSX.Element {
    // if user is logged in, return the application
    if (isLoggedIn) {
      return (
          <PostReader setisLoggedIn={setisLoggedIn} slToken={slToken} />    
      )
    }
    // if not logged in or token expired/invalid, return login page    
    return (      
      <LoginPage setisLoggedIn={setisLoggedIn} setslToken={setslToken} />    
    )    
  }
  
//   return (
//     <div className="App">
//        <BrowserRouter>
//         <Routes>
//           {
//             isLoggedIn ? (                  
//               <Route path="/posts" element={<PostReader setisLoggedIn={setisLoggedIn} slToken={slToken} />} />
//             ) :
//               <Route path="/login" element={<LoginPage setisLoggedIn={setisLoggedIn} setslToken={setslToken} />} />
//           }          
//         </Routes>
//       </BrowserRouter>
//     </div>
//   );
// }

return (
  <div className="App">
     <ComponentToRender />
  </div>
);
}

export default App;
