'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ImageUploader } from '@/components/admin/product/ImageUploader';
import axios from 'axios';

const ProductForm = () => {
  const { register, handleSubmit, setValue, getValues } = useForm();
  const [isGenerating, setIsGenerating] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      // Assuming a temporary product is created first to get an ID
      const createdResponse = await axios.post('/api/v1/admin/products', data);
      alert('Product created successfully! (Placeholder)');
      console.log(createdResponse.data);
    } catch (error) {
      console.error('Failed to create product', error);
      alert('Failed to create product.');
    }
  };

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    try {
      // This is a simplified flow. Ideally, you'd save a draft first to get a product ID.
      // For this mock, we'll pretend we have a product ID (e.g., 1).
      const productId = 1;
      const response = await axios.post(`/api/v1/admin/products/${productId}/generate-content`,
        ['en', 'id'] // Target languages
      );

      const content = response.data.data;

      // Populate form fields with AI content
      setValue('nameEn', content.en.title);
      setValue('descriptionEn', content.en.description);

      alert('AI content generated and populated!');
    } catch (error) {
      console.error('AI generation failed', error);
      alert('Failed to generate AI content.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setValue('mainImageUrl', url);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ImageUploader onUploadSuccess={handleImageUpload} />

      <div>
        <label htmlFor="nameZhCn" className="block text-sm font-medium text-gray-700">Product Name (Chinese)</label>
        <input {...register('nameZhCn')} id="nameZhCn" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </div>

      <button type="button" onClick={handleAiGenerate} disabled={isGenerating} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
        {isGenerating ? 'Generating...' : '✨ Generate with AI'}
      </button>

      <div>
        <label htmlFor="nameEn" className="block text-sm font-medium text-gray-700">Product Name (English) - AI</label>
        <input {...register('nameEn')} id="nameEn" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50" />
      </div>
      <div>
        <label htmlFor="descriptionEn" className="block text-sm font-medium text-gray-700">Description (English) - AI</label>
        <textarea {...register('descriptionEn')} id="descriptionEn" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50" />
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category ID</label>
        <input {...register('categoryId')} id="categoryId" type="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </div>
      <div>
        <label htmlFor="priceCny" className="block text-sm font-medium text-gray-700">Price (CNY)</label>
        <input {...register('priceCny')} id="priceCny" type="number" step="0.01" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </div>
      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
        <input {...register('stock')} id="stock" type="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Create Product
      </button>
    </form>
  );
};

export default function AddProductPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <ProductForm />
      </div>
    </div>
  );
}
