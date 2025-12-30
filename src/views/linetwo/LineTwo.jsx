import { GoChevronLeft } from "react-icons/go";
import { Navigate, useNavigate } from "react-router-dom";

import ('./linetwo.css')

function LineTwo() {
  const Navigate = useNavigate();

  return (
  
  <div className="container-lineaDos">
    
    <header className="header-lineaDos">
      <button onClick={() =>Navigate ('/qr-travel')}><GoChevronLeft/></button>
      <span><p>Linea 2</p></span>

    </header>

    </div>
  )
}

export default LineTwo;
