import React from 'react';

import { default as StartPage } from './components/StartPage';
import { default as Header } from "./components/Header";

function App() {
  return (
    <div className="App">
      <Header />
      <StartPage> </StartPage>
    </div>
  );
}

export default App;
