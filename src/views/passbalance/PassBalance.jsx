import { GoChevronLeft } from 'react-icons/go';
import { Navigate, useNavigate } from 'react-router-dom';
import {FondoPag} from '../../components/common';

import './PassBalance.css'

export function PassBalance() {
  const navigate = useNavigate();

  return (

    <FondoPag>
      
      <div>
        <header className='header-pass'>
            <button className='button-go' onClick={() => navigate('/homeBalance')}>
            <GoChevronLeft /></button>
            <h1>Pasar saldo</h1>
          </header>

    


        <h2 className='Question-pass1'>¿A quien le vas a pasar saldo?</h2>

        <div className='input-pass'>
          <label htmlFor="Numero de celular">Numero de celular</label>
          <input type="number" />
          <p>El numero de celular debe iniciar en 3 y debe ser de 10 digitos.</p>

        </div>

        <div className='Question-pass2'>
        <p>¿Cuanta plata quieres pasar?</p>
        </div>

        <div className='Buttons-pass'>
          <button>$5.000</button>
          <button>$10.000</button>
          <button>$50.000</button>
          <button>$100.000</button>
        </div>
        
        <div className='valeu-pass'>
          <label htmlFor="">Ingrese otro valor</label>
          <input type="number" />
          <p>El valor debe estar entre $1 y $10.000.000</p>
        </div>

        <div className='balance-pass'>
        <button>Mi saldo</button>
        <label htmlFor="$1.500"><u><strong>$1.500</strong></u></label>
        </div>
      

        
    
    </div>

    </FondoPag>
  )
}

export default PassBalance;