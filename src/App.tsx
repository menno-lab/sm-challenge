import React, { useState } from 'react';
import './App.css';
import List from './components/List';

interface IState {
  people: {
    name: string
    age: number
    url: string
    note?: string
  }[]
}

function App() {

  const [people, setpeople] = useState<IState['people']>([
    {
      name: "manfred",
      url: "https://media1.popsugar-assets.com/files/thumbor/WKtUknaQaTiKyXhcRc3h-HD0BcQ/0x73:1640x1713/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2020/10/26/002/n/1922398/03e845f35f9755e6aa1b97.06354587_/i/Nicolas-Cage.jpg",
      age: 69,
      note: "something"
    }
  ])


  return (
    <div className="App">
      <h1>Supermetrics Front-end Assignment</h1>
      <List people={people} />
    </div>
  );
}

export default App;
