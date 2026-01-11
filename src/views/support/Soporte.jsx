import { Button, FondoPag } from "../../components/common";
import { SupportButton } from "../../components/supportfaq/SupportButton";
import { useCategoryFaq, useNavigateTo } from "../../hooks";
import { routeMapFaq } from "../../helpers";
import { AiFillCaretLeft } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import "./soporte.css";

export const Soporte = () => {
  const { faqCategorys, loading, error } = useCategoryFaq();

  const { goTo } = useNavigateTo();
  if (loading) {
    return (
      <FondoPag>
        <div className="soporte-loading">
          <p>Cargando categorías...</p>
        </div>
      </FondoPag>
    );
  }

  if (error) {
    return (
      <FondoPag>
        <div className="soporte-error">
          <p>Error al cargar categorías</p>
        </div>
      </FondoPag>
    );
  }

  return (
    <FondoPag>
      <div className="soporte">
        <header>
          <AiFillCaretLeft aria-label="Volver" />
          <h1>Soporte técnico</h1>
        </header>

        <main>
          <h2>¿Cómo podemos ayudarte?</h2>

          <div className="search-container">
            <CiSearch aria-hidden="true" />
            <input
              type="search"
              className="search-input"
              placeholder="Buscar en preguntas frecuentes..."
              aria-label="Buscar ayuda"
            />
          </div>

          <div className="faq-buttons">
            {faqCategorys.map((cat) => (
              <Button
                key={cat.id}
                className="faq-btn"
                aria-label={`Ver preguntas sobre ${cat.name}`}
                onClick={() => goTo(routeMapFaq[cat.name])}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          <SupportButton />
        </main>
      </div>
    </FondoPag>
  );
};
