import { useSupportFaq } from "../../hooks";
import { SupportButton } from "./SupportButton";
import { FondoPag } from "../common";
import "./faq.css";
export const RenderSupportFaq = ({ labelTitle, categoryId }) => {
  const { supportFaq, error, loading } = useSupportFaq();
  if (loading) {
    return (
      <FondoPag>
        <div className="faq-loading">
          <p>Cargando preguntas frecuentes...</p>;
        </div>
      </FondoPag>
    );
  }

  if (error) {
    return (
      <FondoPag>
        <div className="faq-error">
          <p>Error al cargar FAQs</p>;
        </div>
      </FondoPag>
    );
  }

  const filteredFaqs = supportFaq.filter(
    (faq) => faq.categoryId === categoryId
  );
  console.log(filteredFaqs);
  return (
    <FondoPag>
      <div className="faq-view">
        <h2>{labelTitle}</h2>
        <ul>
          {filteredFaqs.map((faq) => (
            <li key={faq.id}>
              <strong>{faq.question}</strong>
              <p>{faq.answer}</p>
            </li>
          ))}
        </ul>
        <SupportButton />
      </div>
    </FondoPag>
  );
};
