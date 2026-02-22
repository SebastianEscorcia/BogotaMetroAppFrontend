

import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./assets/styles/layout.css";

export default function BogotaMetroApp() {
    const navigate = useNavigate();

    return (
        <div className="welcome-container">
            {/*  diseño de bienvenida */}
            <h1>Bienvenido al Metro de Bogotá</h1>
            <button onClick={() => navigate('/home')}>
                Ingresar
            </button>
        </div>
    );
}