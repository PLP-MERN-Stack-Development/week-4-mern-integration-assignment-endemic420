import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaSpinner } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect only on initial mount if user is logged in
  useEffect(() => {
    if (user && window.location.pathname === '/login') {
      console.log('User already logged in, redirecting to dashboard:', user);
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions
    setLoading(true);
    setError(null);
    try {
      console.log('Sending login request:', formData);
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email.trim(),
        password: formData.password.trim(),
      });
      console.log('Login response:', response.data);
      if (!response.data?.token || !response.data?.user) {
        throw new Error('Invalid login response: missing token or user');
      }
      await login(response.data.token, response.data.user);
      console.log('Token stored:', localStorage.getItem('token'));
      console.log('Navigating to dashboard');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Login error:', {
        status: err.response?.status,
        message: err.response?.data?.message,
        data: err.response?.data,
        error: err.message,
      });
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className = "w-full h-full bg-gray-100 dark:bg-gray-800">
    <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 dark:text-red-400 text-center">{error}</p>}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">
              Email
            </label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">
              Password
            </label>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !formData.email || !formData.password}
            className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white" variant={undefined} size={undefined}          >
            {loading ? <FaSpinner className="h-5 w-5 animate-spin" /> : 'Login'}
          </Button>
        </form>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-500 dark:text-blue-400 hover:underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
    </main>
  );
};

export default Login;