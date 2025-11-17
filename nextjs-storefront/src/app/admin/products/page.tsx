import Link from 'next/link';
import React from 'react';

// This is a placeholder for the actual product table
const ProductTablePlaceholder = () => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <p>Product table will be here...</p>
    <p>It will display a list of all products with options to edit or delete.</p>
  </div>
);

export default function ProductsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/add" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add New Product
        </Link>
      </div>
      <ProductTablePlaceholder />
    </div>
  );
}
