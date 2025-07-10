import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaSpinner } from 'react-icons/fa';
import { cn } from '@/lib/utils';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, categoriesRes] = await Promise.all([
          axios.get(
            selectedCategory
              ? `http://localhost:5000/api/posts?categoryId=${selectedCategory}`
              : 'http://localhost:5000/api/posts'
          ),
          axios.get('http://localhost:5000/api/categories'),
        ]);
        setPosts(postsRes.data);
        setCategories(categoriesRes.data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.status === 401
            ? 'Please log in to access posts'
            : err.response?.status === 404
            ? 'Categories not found. Please contact an admin.'
            : 'Failed to fetch data'
        );
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
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Blog Posts</h1>
      <div className="mb-6">
        <Select onValueChange={setSelectedCategory} value={selectedCategory}>
          <SelectTrigger className="w-[200px] bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className = "">
            <SelectItem value="" className = "">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem  className = "" key={category._id} value={category._id}>
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
              <CardHeader className = "">
                <CardTitle className="text-gray-800 dark:text-white">
                  {post.title}
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Category: {post.category?.name || 'Uncategorized'}
                </p>
              </CardHeader>
              <CardContent className = "">
                <p className="text-gray-600 dark:text-gray-300">
                  {post.content.slice(0, 100)}...
                </p>
                <Link
                  to={`/post/${post._id}`}
                  className="text-blue-500 dark:text-blue-400 hover:underline mt-2 inline-block"
                >
                  Read More
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-600 dark:text-gray-300">
            No posts available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;