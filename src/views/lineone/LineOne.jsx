import { Navigate, useNavigate } from 'react-router-dom'
import { GoChevronLeft } from 'react-icons/go';

import ('./lineone.css')

export function LineOne() {
    const Navigate = useNavigate ();

  return (

    <div className='container-map'>

        <header className='headerMap'> 
            <button onClick={() => Navigate ('/qr-travel')}><GoChevronLeft/></button>
            <span><p>Linea 1 </p></span>
        </header>

    </div>
    
  )
}

export default LineOne;