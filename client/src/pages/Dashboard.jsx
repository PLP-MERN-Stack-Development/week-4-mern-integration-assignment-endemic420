import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaSpinner, FaPencilAlt } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const Dashboard = () => {
  const { user, logout, isInitialized } = useAuth();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  console.log('Dashboard rendering:', { user, isInitialized, loading, error });

  // Fetch user posts and categories
  useEffect(() => {
    const fetchData = async () => {
      console.log('Starting fetchData');
      try {
        const token = localStorage.getItem('token');
        console.log('Token in Dashboard:', token);
        if (!token) {
          throw new Error('No token found');
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };
        console.log('Fetching posts with config:', config);
        const [postsRes, categoriesRes] = await Promise.all([
          axios.get(
            selectedCategory
              ? `http://localhost:5000/api/posts/my-posts?categoryId=${selectedCategory}`
              : 'http://localhost:5000/api/posts/my-posts',
            config
          ),
          axios.get('http://localhost:5000/api/categories'),
        ]);
        console.log('Posts response:', postsRes.data);
        console.log('Categories response:', categoriesRes.data);
        setPosts(postsRes.data);
        setCategories(categoriesRes.data);
        setLoading(false);
        console.log('fetchData complete, loading set to false');
      } catch (err) {
        console.error('Fetch error:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        setError(
          err.response?.status === 401
            ? 'Session expired. Please log in again.'
            : 'Failed to fetch posts. Please try again.'
        );
        if (err.response?.status === 401) {
          console.log('401 detected, logging out and redirecting to login');
          logout();
          navigate('/login', { replace: true });
        } else {
          setLoading(false);
          console.log('Non-401 error, loading set to false');
        }
      }
    };

    if (isInitialized && user) {
      console.log('Fetching data for user:', user);
      fetchData();
    } else if (isInitialized && !user) {
      console.log('No user, redirecting to login');
      setError('Please log in to access the dashboard.');
      navigate('/login', { replace: true });
    } else {
      console.log('Waiting for auth initialization');
    }
  }, [user, isInitialized, selectedCategory, logout, navigate]);

  if (!isInitialized || loading) {
    console.log('Rendering loading state');
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="h-8 w-8 animate-spin text-gray-600 dark:text-white" />
      </div>
    );
  }

  if (error) {
    console.log('Rendering error state:', error);
    return <div className="text-center text-red-500 dark:text-red-400">{error}</div>;
  }

  console.log('Rendering dashboard content:', { posts, categories });

  return (
    <main className = "body:bg-gray-500 w-full h-full bg-gray-100 dark:bg-gray-400">
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-700">
        Welcome, {user?.name || 'User'}
      </h1>
      <div className="mb-6">
        <Select onValueChange={setSelectedCategory} value={selectedCategory}>
          <SelectTrigger className="w-[200px] bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:text-black hover:dark:text-gray-800 hover:dark:bg-gray-300">
            <SelectValue placeholder="All Categories" className = "" />
          </SelectTrigger>
          <SelectContent className = "bg-gray-100 dark:bg-gray-700 ">         
            {categories.map((category) => (
              <SelectItem key={category._id} value={category.name} className= "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white hover:text-black hover:dark:text-black hover:bg-gray-100 hover:dark:bg-gray-300" >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Card
              key={post._id}
              className={cn('shadow-md bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white border-none')}
            >
              <CardHeader className={undefined}>
                <CardTitle className="text-gray-800 font-w-bold dark:text-white">
                  {post.title}
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Category: {post.category?.name || 'Uncategorized'}
                </p>
              </CardHeader>
              <CardContent className = "bg-gray-100 dark:bg-gray-800">
                <p className="text-gray-600 dark:text-gray-400">
                  {post.content.slice(0, 100)}...
                </p>
                <Link
                  to={`/edit/${post._id}`}
                  className="text-gray-400 dark:text-gray-200 hover:underline hover:text-gray-900 hover:dark:text-blue-500 mt-2 inline-block"
                >
                  <FaPencilAlt className="h-4 w-4 mr-1 inline text-black" /> Edit
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-600 dark:text-gray-400">
            No posts available.{' '}
            <Link to="/create" className="text-blue-500 dark:text-blue-400 hover:underline">
              Create one now!
            </Link>
          </p>
        )}
      </div>
    </div>
    </main>
  );
};

export default Dashboard;