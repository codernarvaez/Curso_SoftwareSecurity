import React from 'react';
import './App.css';
import Login from './Fragments/Login';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './Fragments/Home';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='*' element={<Navigate to='/login' />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;