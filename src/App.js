// asset
import './assets/css/reset.css';
import './assets/css/common.css';
import './assets/css/global.css';
import './assets/css/button.css';
import './assets/css/main.css';
import './assets/css/foodchoicer.css';
import './assets/css/auth-form.css';

// React
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

// Context Provider
import AuthProvider from './components/context/auth/AuthProvider';

// Component
import Header from './components/Header'
import Main from './components/Main';
import Footer from './components/Footer';
import FoodChoicer from './components/FoodChoicer';

function App() {

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className='main'>
            <Main />
          </main>
          <FoodChoicer />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
