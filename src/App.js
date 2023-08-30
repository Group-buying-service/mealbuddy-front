import logo from './logo.svg';
// React
import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// Context Provider
import AuthProvider from './components/context/auth/AuthProvider';
import AuthContext from './components/context/auth/AuthContext';

// Component
import Header from './components/Header'
import Main from './components/Main';

// asset
import './assets/css/reset.css'

function App() {

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header/>
          <main className='main'>
            <Main/>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
