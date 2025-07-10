import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaSpinner, FaPencilAlt } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch post by ID
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/posts/${id}`) // Update URL if needed
      .then((response) => {
        setPost(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch post');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-300" />
      </div>
    );
  }

  if (error || !post) {
    return <div className="text-center text-red-500 dark:text-red-400">{error || 'Post not found'}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className={cn('shadow-md bg-white dark:bg-gray-800 border-none')}>
        <CardHeader className={undefined}>
          <CardTitle className="text-2xl text-gray-800 dark:text-white">
            {post.title}
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Category: {post.category.name}
          </p>
        </CardHeader>
        <CardContent className={undefined}>
          <p className="text-gray-600 dark:text-gray-300">{post.content}</p>
          {user && (
            <Link
              to={`/edit/${post._id}`}
              className="mt-4 inline-flex items-center text-blue-500 dark:text-blue-400 hover:underline"
            >
              <FaPencilAlt className="h-4 w-4 mr-1" /> Edit Post
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PostDetail;