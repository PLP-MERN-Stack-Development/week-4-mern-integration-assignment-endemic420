import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Home from '@/pages/Home';
import PostDetail from '@/components/PostDetails';
import CreatePost from '@/components/createPost';
import Navbar from '@/components/navbar';
import Login from '@/pages/login';
import Signup from '@/pages/signup';
import Dashboard from '@/pages/Dashboard';
import CategoryManagement from '@/components/CategoryManagement';
import ProtectedRoute from '@/components/protectedRoute';
import AdminRoute from '@/components/AdminRoute';

// Theme context for dark/light mode
export const ThemeContext = createContext(null)
const App = () => {
  const [theme, setTheme] = useState('light');

  // Toggle between dark and light mode
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={cn(theme === 'dark' ? 'dark' : '', 'min-h-screen')}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<Dashboard />} />}
            />
            <Route
              path="/create"
              element={<ProtectedRoute element={<CreatePost />} />}
            />
            <Route
              path="/edit/:id"
              element={<ProtectedRoute element={<CreatePost />} />}
            />
            <Route
              path="/categories"
              element={<AdminRoute element={<CategoryManagement />} />}
            />
          </Routes>
        </Router>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
