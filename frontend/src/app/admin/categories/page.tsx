'use client';

import React, { useState, useEffect } from 'react';
import { Category } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface CategoryFormData {
  nameZhCn: string;
  nameEn: string;
  nameId: string;
  slug: string;
  description: string;
  parentId?: number | null;
}

const initialFormData: CategoryFormData = {
  nameZhCn: '',
  nameEn: '',
  nameId: '',
  slug: '',
  description: '',
  parentId: null,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<CategoryFormData>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // TODO: Implement API call to fetch categories
      // const response = await categoryApi.getCategories();
      // setCategories(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-generate slug from English name
    if (name === 'nameEn' && !editingCategory) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev) => ({
        ...prev,
        slug,
      }));
    }

    // Clear error for this field
    if (errors[name as keyof CategoryFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CategoryFormData> = {};

    if (!formData.nameZhCn.trim()) {
      newErrors.nameZhCn = '请输入中文名称';
    }

    if (!formData.nameEn.trim()) {
      newErrors.nameEn = '请输入英文名称';
    }

    if (!formData.nameId.trim()) {
      newErrors.nameId = '请输入印尼语名称';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = '请输入URL别名';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'URL别名只能包含小写字母、数字和连字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setFormData(initialFormData);
    setErrors({});
    setShowModal(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      nameZhCn: category.nameZhCn,
      nameEn: category.nameEn,
      nameId: category.nameId,
      slug: category.slug,
      description: category.description || '',
      parentId: category.parentId || null,
    });
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData(initialFormData);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      if (editingCategory) {
        // TODO: Implement API call to update category
        // await categoryApi.updateCategory(editingCategory.id, formData);
        alert('分类已更新');
      } else {
        // TODO: Implement API call to create category
        // await categoryApi.createCategory(formData);
        alert('分类已创建');
      }

      handleCloseModal();
      fetchCategories();
    } catch (error: any) {
      console.error('Failed to save category:', error);
      alert(error.response?.data?.message || '操作失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`确定要删除分类 "${category.nameZhCn}" 吗？`)) {
      return;
    }

    try {
      // TODO: Implement API call to delete category
      // await categoryApi.deleteCategory(category.id);
      alert('分类已删除');
      fetchCategories();
    } catch (error: any) {
      console.error('Failed to delete category:', error);
      alert(error.response?.data?.message || '删除失败，请重试');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">分类管理</h1>
              <p className="text-gray-600 mt-1">管理商品分类信息</p>
            </div>
            <Button onClick={handleOpenCreateModal}>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 4v16m8-8H4" />
              </svg>
              新建分类
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">总分类数</div>
              <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">一级分类</div>
              <div className="text-2xl font-bold text-primary-600">
                {categories.filter((c) => !c.parentId).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">二级分类</div>
              <div className="text-2xl font-bold text-blue-600">
                {categories.filter((c) => c.parentId).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">启用状态</div>
              <div className="text-2xl font-bold text-green-600">
                {categories.filter((c) => c.isActive).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Table */}
        <Card>
          <CardHeader className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">分类列表</h2>
          </CardHeader>
          <CardContent className="p-0">
            {categories.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                暂无分类数据
                <br />
                <Button variant="outline" size="sm" className="mt-4" onClick={handleOpenCreateModal}>
                  创建第一个分类
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        中文名称
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        英文名称
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        印尼语名称
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        URL别名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        商品数量
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-900">{category.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{category.nameZhCn}</div>
                          {category.parentId && (
                            <div className="text-xs text-gray-500">
                              父分类ID: {category.parentId}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{category.nameEn}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{category.nameId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-600">{category.slug}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{category.productCount || 0}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              category.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {category.isActive ? '启用' : '禁用'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleOpenEditModal(category)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => handleDelete(category)}
                              className="text-red-600 hover:text-red-900"
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingCategory ? '编辑分类' : '新建分类'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={submitting}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Chinese Name */}
                <div>
                  <label htmlFor="nameZhCn" className="block text-sm font-medium text-gray-700 mb-1">
                    中文名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nameZhCn"
                    name="nameZhCn"
                    value={formData.nameZhCn}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.nameZhCn ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="电子产品"
                  />
                  {errors.nameZhCn && <p className="mt-1 text-sm text-red-500">{errors.nameZhCn}</p>}
                </div>

                {/* English Name */}
                <div>
                  <label htmlFor="nameEn" className="block text-sm font-medium text-gray-700 mb-1">
                    英文名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nameEn"
                    name="nameEn"
                    value={formData.nameEn}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.nameEn ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Electronics"
                  />
                  {errors.nameEn && <p className="mt-1 text-sm text-red-500">{errors.nameEn}</p>}
                </div>

                {/* Indonesian Name */}
                <div>
                  <label htmlFor="nameId" className="block text-sm font-medium text-gray-700 mb-1">
                    印尼语名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nameId"
                    name="nameId"
                    value={formData.nameId}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.nameId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Elektronik"
                  />
                  {errors.nameId && <p className="mt-1 text-sm text-red-500">{errors.nameId}</p>}
                </div>

                {/* Slug */}
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    URL别名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.slug ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="electronics"
                  />
                  {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug}</p>}
                  <p className="mt-1 text-xs text-gray-500">
                    URL友好的别名，只能包含小写字母、数字和连字符
                  </p>
                </div>

                {/* Parent Category */}
                <div>
                  <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 mb-1">
                    父分类
                  </label>
                  <select
                    id="parentId"
                    name="parentId"
                    value={formData.parentId || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        parentId: value ? Number(value) : null,
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">无（作为一级分类）</option>
                    {categories
                      .filter((c) => !c.parentId && (!editingCategory || c.id !== editingCategory.id))
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.nameZhCn} ({category.nameEn})
                        </option>
                      ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">选择父分类以创建二级分类</p>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    描述
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="分类的详细描述..."
                  />
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                    className="flex-1"
                    disabled={submitting}
                  >
                    取消
                  </Button>
                  <Button type="submit" className="flex-1" disabled={submitting}>
                    {submitting ? '提交中...' : editingCategory ? '更新' : '创建'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
