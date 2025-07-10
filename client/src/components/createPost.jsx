import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaSpinner } from 'react-icons/fa';
import { cn } from '@/lib/utils';

const CreatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', content: '', category: '' });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch post (if editing) and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await axios.get('http://localhost:5000/api/categories'); // Update URL
        setCategories(categoriesRes.data);
        if (id) {
          const postRes = await axios.get(`http://localhost:5000/api/posts/${id}`); // Update URL
          setFormData({
            title: postRes.data.title,
            content: postRes.data.content,
            category: postRes.data.category._id,
          });
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (id) {
        await axios.put(`http://localhost:5000/api/posts/${id}`, formData, config); // Update URL
      } else {
        await axios.post('http://localhost:5000/api/posts', formData, config); // Update URL
      }
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to save post');
      setLoading(false);
    }
  };

  // Update form data
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-300" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        {id ? 'Edit Post' : 'Create Post'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
        {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">
            Title
          </label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter post title"
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600" type={undefined}          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">
            Category
          </label>
          <Select
            onValueChange={(value) => setFormData({ ...formData, category: value })}
            value={formData.category}
          >
            <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className= "bg-transparent">
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id} className= "bg-transparent ">
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">
            Content
          </label>
          <Textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your post content..."
            rows={6}
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white" variant={undefined} size={undefined}        >
          {loading ? <FaSpinner className="h-5 w-5 animate-spin" /> : 'Save Post'}
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;