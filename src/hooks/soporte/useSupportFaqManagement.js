import { useCallback, useEffect, useState } from "react";
import {
  createSupportFaq,
  deleteSupportFaq,
  getFaqSupport,
  updateSupportFaq,
} from "../../services/faqs-soporte";

const mapFaq = (faq = {}) => {
  const categoryFaqId = faq.categoryFaqId ?? faq.categoryId ?? faq.categoryFaq?.id;

  return {
    ...faq,
    categoryFaqId,
    isActive: faq.isActive ?? faq.active ?? true,
  };
};

export const useSupportFaqManagement = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchFaqs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFaqSupport();
      setFaqs((data || []).map(mapFaq));
    } catch (err) {
      setError(err.message || "Error al cargar preguntas frecuentes");
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateFaq = async (faqData) => {
    try {
      setLoading(true);
      setError(null);
      const payload = {
        question: faqData.question?.trim(),
        answer: faqData.answer?.trim(),
        isActive: faqData.isActive ?? true,
        categoryFaqId: Number(faqData.categoryFaqId),
      };
      const newFaq = await createSupportFaq(payload);
      setFaqs((prev) => [...prev, mapFaq(newFaq)]);
      setSuccess("Pregunta frecuente creada exitosamente");
      return newFaq;
    } catch (err) {
      setError(err.message || "Error al crear la pregunta frecuente");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFaq = async (id, faqData) => {
    try {
      setLoading(true);
      setError(null);
      const payload = {
        question: faqData.question?.trim(),
        answer: faqData.answer?.trim(),
        isActive: faqData.isActive ?? true,
        categoryFaqId: Number(faqData.categoryFaqId),
      };
      const updatedFaq = await updateSupportFaq(id, payload);
      setFaqs((prev) => prev.map((faq) => (faq.id === id ? mapFaq(updatedFaq) : faq)));
      setSuccess("Pregunta frecuente actualizada exitosamente");
      return updatedFaq;
    } catch (err) {
      setError(err.message || "Error al actualizar la pregunta frecuente");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFaq = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await deleteSupportFaq(id);
      setFaqs((prev) => prev.filter((faq) => faq.id !== id));
      setSuccess("Pregunta frecuente eliminada exitosamente");
    } catch (err) {
      setError(err.message || "Error al eliminar la pregunta frecuente");
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
    fetchFaqs();
  }, [fetchFaqs]);

  const stats = {
    total: faqs.length,
    active: faqs.filter((faq) => faq.isActive).length,
    inactive: faqs.filter((faq) => !faq.isActive).length,
  };

  return {
    faqs,
    loading,
    error,
    success,
    stats,
    fetchFaqs,
    handleCreateFaq,
    handleUpdateFaq,
    handleDeleteFaq,
    clearMessages,
  };
};