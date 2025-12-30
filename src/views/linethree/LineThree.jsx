import {Navigate, useNavigate} from "react-router-dom";
import { GoChevronLeft } from "react-icons/go";

import ('./linethree.css')

function LineThree() {
    const Navigate = useNavigate();

  return (
  
  <div className="container-linethree">
    
    <header className="header-linethree">
        <button onClick={() => Navigate ('/qr-travel')}> <GoChevronLeft/></button>
        <span><p>Linea 3</p></span>
        
        </header>
    </div>

  )
}

export default LineThree