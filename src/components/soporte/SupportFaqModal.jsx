import { useEffect, useMemo, useState } from "react";
import {
  MdAdd,
  MdCancel,
  MdCheckCircle,
  MdClose,
  MdEdit,
  MdHourglassEmpty,
  MdSave,
} from "react-icons/md";

const getFaqCategoryId = (faq = {}) => faq.categoryFaqId ?? faq.categoryId ?? faq.categoryFaq?.id ?? "";

export const SupportFaqModal = ({
  isOpen,
  onClose,
  onSubmit,
  faq,
  mode,
  categories = [],
}) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [categoryFaqId, setCategoryFaqId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const activeCategories = useMemo(
    () => categories.filter((category) => category.isActive),
    [categories],
  );

  useEffect(() => {
    if (mode === "edit" && faq) {
      setQuestion(faq.question || "");
      setAnswer(faq.answer || "");
      setCategoryFaqId(getFaqCategoryId(faq));
      setIsActive(faq.isActive ?? faq.active ?? true);
      return;
    }

    setQuestion("");
    setAnswer("");
    setCategoryFaqId(activeCategories[0]?.id ?? "");
    setIsActive(true);
  }, [mode, faq, isOpen, activeCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim() || !categoryFaqId) return;

    setLoading(true);
    try {
      const payload = {
        question: question.trim(),
        answer: answer.trim(),
        isActive,
        categoryFaqId,
      };

      if (mode === "edit") {
        await onSubmit(faq.id, payload);
      } else {
        await onSubmit(payload);
      }

      onClose();
    } catch (error) {
      console.error("Error guardando FAQ:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <span className="modal-title-icon">{mode === "edit" ? <MdEdit /> : <MdAdd />}</span>
            {mode === "edit" ? "Editar Pregunta Frecuente" : "Crear Pregunta Frecuente"}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <MdClose />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Categoría</label>
              <select
                className="form-select"
                value={categoryFaqId}
                onChange={(e) => setCategoryFaqId(Number(e.target.value))}
                required
              >
                {activeCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Pregunta</label>
              <input
                type="text"
                className="form-input"
                placeholder="Escribe la pregunta frecuente"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Respuesta</label>
              <textarea
                className="form-input"
                rows={5}
                placeholder="Escribe la respuesta"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
              />
            </div>

            {mode === "edit" && (
              <div className="form-group">
                <label className="form-label">Estado</label>
                <select
                  className="form-select"
                  value={isActive ? "true" : "false"}
                  onChange={(e) => setIsActive(e.target.value === "true")}
                >
                  <option value="true">Activa</option>
                  <option value="false">Inactiva</option>
                </select>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              <MdCancel /> Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !question.trim() || !answer.trim() || !categoryFaqId}
            >
              {loading ? (
                <>
                  <MdHourglassEmpty /> Guardando...
                </>
              ) : mode === "edit" ? (
                <>
                  <MdSave /> Actualizar
                </>
              ) : (
                <>
                  <MdCheckCircle /> Crear Pregunta
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupportFaqModal;