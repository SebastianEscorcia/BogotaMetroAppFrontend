import { Button, FondoPag } from "../../components/common";
import { useCategoryFaq } from "../../hooks";
import { AiFillCaretLeft } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import Robot from "../../assets/img/imgs/icono-robot-chat.png";
import "./soporte.css";

export const Soporte = () => {
  const { faqCategorys, loading, error } = useCategoryFaq();

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
              >
                {cat.name}
              </Button>
            ))}
          </div>

          <div className="contact-support">
            <Button 
              className="btn-contact-support"
              aria-label="Contactar con soporte"
            >
              <p>Llámanos o escríbenos</p>
              <img
                src={Robot}
                alt="Robot asistente del Metro de Bogotá"
              />
            </Button>
          </div>
        </main>
      </div>
    </FondoPag>
  );
};