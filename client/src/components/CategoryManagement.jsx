import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaSpinner, FaTrash } from 'react-icons/fa';
import { cn } from '@/lib/utils';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories'); // Update URL
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch categories');
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Add category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(
        'http://localhost:5000/api/categories', // Update URL
        { name: newCategory },
        config
      );
      setCategories([...categories, response.data]);
      setNewCategory('');
      setSubmitting(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add category');
      setSubmitting(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/categories/${id}`, config); // Update URL
      setCategories(categories.filter((category) => category._id !== id));
      setSubmitting(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category');
      setSubmitting(false);
    }
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
        Manage Categories
      </h1>
      {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
      <form onSubmit={handleAddCategory} className="mb-6 max-w-md">
        <div className="flex space-x-2">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category name"
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600" type={undefined}          />
          <Button
            type="submit"
            disabled={submitting || !newCategory.trim()}
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white" variant={undefined} size={undefined}          >
            {submitting ? <FaSpinner className="h-5 w-5 animate-spin" /> : 'Add Category'}
          </Button>
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.length > 0 ? (
          categories.map((category) => (
            <Card
              key={category._id}
              className={cn('shadow-md bg-white dark:bg-gray-800 border-none')}
            >
              <CardHeader className={undefined}>
                <CardTitle className="text-gray-800 dark:text-white">
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent className={undefined}>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteCategory(category._id)}
                  disabled={submitting} className={undefined}                >
                  <FaTrash className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-600 dark:text-gray-300">
            No categories available.
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;