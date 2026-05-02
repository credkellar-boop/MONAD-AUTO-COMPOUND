// frontend/src/App.js
import React from 'react';
import Dashboard from './components/Dashboard';
import './App.css'; // Add basic styling here if needed

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Omnichain Auto-Compounder</h1>
      </header>
      <main>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
