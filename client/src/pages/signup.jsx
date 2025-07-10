import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaSpinner } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
      });
      console.log('Signup response:', response.data); // Debug token
      localStorage.setItem('token', response.data.token); // Ensure token is stored
      login(response.data.token, response.data.user);
      console.log('Token stored:', localStorage.getItem('token')); // Debug storage
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', {
        status: err.response?.status,
        message: err.response?.data?.message,
        data: err.response?.data,
      });
      setError(err.response?.data?.message || 'Failed to signup. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">
          Signup
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 dark:text-red-400 text-center">{error}</p>}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">
              Name
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600" type={undefined}            />
          </div>
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
            disabled={loading || !formData.name || !formData.email || !formData.password}
            className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white" variant={undefined} size={undefined}          >
            {loading ? <FaSpinner className="h-5 w-5 animate-spin" /> : 'Signup'}
          </Button>
        </form>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 dark:text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;