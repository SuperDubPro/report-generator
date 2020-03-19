import React from 'react';
import logo from './logo.svg';
import './App.css';
import { default as Form } from './components/Form'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Form> </Form>
    </div>
  );
}

export default App;
