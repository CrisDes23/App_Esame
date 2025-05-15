// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './Pages/Welcome';
import Select from './Pages/Select';
import Result from './Pages/Result';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />}/>
        <Route path="/select" element={<Select />}/>
        <Route path="/result" element={<Result />}/>
      </Routes>
    </Router>
  )

};



export default App;
