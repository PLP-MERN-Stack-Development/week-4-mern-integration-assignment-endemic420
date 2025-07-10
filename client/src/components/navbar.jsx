import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeContext } from '../App';
import { useAuth } from '@/hooks/useAuth';
import { FaMoon, FaSun, FaSignOutAlt } from 'react-icons/fa';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-white">
          PLP Blog
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-600 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
              >
                Dashboard
              </Link>
              <Link
                to="/create"
                className="text-gray-600 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
              >
                Create Post
              </Link>
              <Button
                variant="outline"
                size="icon"
                onClick={handleLogout}
                className="text-gray-600 dark:text-gray-200 border-gray-300 dark:border-gray-600"
              >
                <FaSignOutAlt className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-gray-600 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400"
              >
                Signup
              </Link>
            </>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="text-gray-600 dark:text-gray-200 border-gray-300 dark:border-gray-600"
          >
            {theme === 'light' ? <FaMoon className="h-5 w-5" /> : <FaSun className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;