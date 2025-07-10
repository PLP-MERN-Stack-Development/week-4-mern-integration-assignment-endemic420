// src/components/BlogList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils'; // Utility for classNames
import { Loader2 } from 'lucide-react'; // Lucide icon for loading

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch blog posts from your backend
    axios
      .get('http://localhost:5000/api/posts') // Adjust to your backend API
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch posts');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post._id} className={cn('shadow-md')}>
              <CardHeader className={undefined}>
                <CardTitle className={undefined}>{post.title}</CardTitle>
              </CardHeader>
              <CardContent className={undefined}>
                <p className="text-gray-600">{post.content.slice(0, 100)}...</p>
                <a
                  href={`/post/${post._id}`}
                  className="text-blue-500 hover:underline mt-2 inline-block"
                >
                  Read More
                </a>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-full">No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default BlogList;