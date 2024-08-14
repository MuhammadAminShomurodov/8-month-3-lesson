import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'antd/dist/reset.css'; // Import Ant Design styles

import StudentList from './pages/StudentList';
import StudentForm from './pages/StudentForm';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute'; // Adjust the import path as needed

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute element={<StudentList />} />} />
      <Route path="/add" element={<PrivateRoute element={<StudentForm />} />} />
      <Route path="/edit/:id" element={<PrivateRoute element={<StudentForm />} />} />
    </Routes>
  </Router>
);

export default App;
