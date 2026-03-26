import { useCallback, useEffect, useState } from "react";
import {
  createFaqCategory,
  deleteFaqCategory,
  getAllsFaqCategorys,
  updateFaqCategory,
} from "../../services/faqs-soporte";

const mapCategory = (category = {}) => ({
  ...category,
  isActive: category.isActive ?? category.active ?? true,
});

export const useFaqCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllsFaqCategorys();
      setCategories((data || []).map(mapCategory));
    } catch (err) {
      setError(err.message || "Error al cargar categorías FAQ");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateCategory = async (name) => {
    try {
      setLoading(true);
      setError(null);
      const newCategory = await createFaqCategory({ name: name.trim() });
      setCategories((prev) => [...prev, mapCategory(newCategory)]);
      setSuccess("Categoría creada exitosamente");
      return newCategory;
    } catch (err) {
      setError(err.message || "Error al crear la categoría");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (id, categoryData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCategory = await updateFaqCategory(id, categoryData);
      setCategories((prev) =>
        prev.map((category) =>
          category.id === id ? mapCategory(updatedCategory) : category,
        ),
      );
      setSuccess("Categoría actualizada exitosamente");
      return updatedCategory;
    } catch (err) {
      setError(err.message || "Error al actualizar la categoría");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteFaqCategory(id);
      setCategories((prev) => prev.filter((category) => category.id !== id));
      setSuccess("Categoría eliminada exitosamente");
    } catch (err) {
      setError(err.message || "Error al eliminar la categoría");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const stats = {
    total: categories.length,
    active: categories.filter((category) => category.isActive).length,
    inactive: categories.filter((category) => !category.isActive).length,
  };

  return {
    categories,
    loading,
    error,
    success,
    stats,
    fetchCategories,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    clearMessages,
  };
};