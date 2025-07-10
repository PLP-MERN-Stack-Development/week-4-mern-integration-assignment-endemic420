import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaSpinner, FaPencilAlt } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user posts and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [postsRes, categoriesRes] = await Promise.all([
          axios.get(
            selectedCategory
              ? `http://localhost:5000/api/posts/my-posts?categoryId=${selectedCategory}`
              : 'http://localhost:5000/api/posts/my-posts',
            config
          ), // Update URL
          axios.get('http://localhost:5000/api/categories'), // Update URL
        ]);
        setPosts(postsRes.data);
        setCategories(categoriesRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-300" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 dark:text-red-400">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Welcome, {user.name}
      </h1>
      <div className="mb-6">
        <Select onValueChange={setSelectedCategory} value={selectedCategory}>
          <SelectTrigger className="w-[200px] bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className={undefined}>
            <SelectItem value="" className={undefined}>All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category._id} className={undefined}>
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
              className={cn('shadow-md bg-white dark:bg-gray-800 border-none')}
            >
              <CardHeader className={undefined}>
                <CardTitle className="text-gray-800 dark:text-white">
                  {post.title}
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Category: {post.category.name}
                </p>
              </CardHeader>
              <CardContent className={undefined}>
                <p className="text-gray-600 dark:text-gray-300">
                  {post.content.slice(0, 100)}...
                </p>
                <Link
                  to={`/edit/${post._id}`}
                  className="text-blue-500 dark:text-blue-400 hover:underline mt-2 inline-block"
                >
                  <FaPencilAlt className="h-4 w-4 mr-1 inline" /> Edit
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-600 dark:text-gray-300">
            No posts available.{' '}
            <Link to="/create" className="text-blue-500 dark:text-blue-400 hover:underline">
              Create one now!
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;