import React from 'react';

import { default as Form } from './components/Form';
import { default as Header } from './components/Header';
import { default as Table } from './components/Table';

function App() {
  return (
    <div className="App">
      <Header> </Header>
      <Form> </Form>
      <div style={{borderTop:'4px solid darkgrey'}}>
         этот раздел находится в разработке
        <Table> </Table>
      </div>
    </div>
  );
}

export default App;
