
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaChevronLeft, FaBell, FaExclamationCircle, 
  FaCog, FaCheckCircle, FaRegClock, FaPlus 
} from 'react-icons/fa';
import './Personalizacion.css';

const Notificaciones = () => {
  const navigate = useNavigate();
  const audioRef = useRef(new Audio('https://actions.google.com/sounds/v1/alarms/beep_loop.ogg'));
  
  const [notificaciones, setNotificaciones] = useState([
    { id: 1, titulo: 'Retraso en Linea', desc: 'Estimados pasajeros, la linea presenta un retraso de 10 minutos.', tipo: 'retraso' },
    { id: 2, titulo: 'Mantenimiento en Linea', desc: 'Estación en mantenimiento el dia 25 de julio 2025.', tipo: 'mantenimiento' },
    { id: 3, titulo: 'Servicio Restablecido', desc: 'El servicio en la linea ha sido restablecido', tipo: 'restablecido' }
  ]);

  const [alarmas, setAlarmas] = useState([
    { id: 4, titulo: 'Estacion Portal Américas', desc: 'sonara 5 minutos antes de llegar', activa: true, tiempoTotal: 206 }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [nuevoItem, setNuevoItem] = useState({ titulo: '', m: '', s: '', tipoIcono: 'retraso' });

  useEffect(() => {
    const timer = setInterval(() => {
      setAlarmas(prev => prev.map(al => {
        if (al.activa && al.tiempoTotal > 0) {
          if (al.tiempoTotal === 1) audioRef.current.play(); 
          return { ...al, tiempoTotal: al.tiempoTotal - 1 };
        }
        return al;
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAgregarAlerta = () => {
    const totalSegundos = (parseInt(nuevoItem.m || 0) * 60) + parseInt(nuevoItem.s || 0);
    
    if (totalSegundos > 0) {
      const nuevaAl = {
        id: Date.now(),
        titulo: nuevoItem.titulo || 'Nueva Alarma',
        desc: 'sonara al finalizar el tiempo programado',
        activa: true,
        tiempoTotal: totalSegundos
      };
      setAlarmas([nuevaAl, ...alarmas]);
    } else {
      const nuevaNotif = {
        id: Date.now(),
        titulo: nuevoItem.titulo || 'Nuevo Aviso',
        desc: 'Alerta de usuario registrada',
        tipo: nuevoItem.tipoIcono
      };
      setNotificaciones([nuevaNotif, ...notificaciones]);
    }
    setShowModal(false);
    setNuevoItem({ titulo: '', m: '', s: '', tipoIcono: 'retraso' });
  };

  const getIcon = (tipo) => {
    switch(tipo) {
      case 'retraso': return <FaExclamationCircle className="status-icon icon-red" />;
      case 'mantenimiento': return <FaCog className="status-icon icon-yellow" />;
      case 'restablecido': return <FaCheckCircle className="status-icon icon-green" />;
      default: return <FaRegClock className="status-icon icon-dark" />;
    }
  };

  return (
    <div className="mobile-container city-background">
      <div className="app-screen">
        <header className="header-red">
          <FaChevronLeft className="icon-back" onClick={() => navigate(-1)} />
          <h1 className="header-title-adapta">Notificaciones y Alarmas</h1>
        </header>

        <div className="app-content-scrollable">
          <h2 className="section-subtitle">Tus Notificaciones <FaBell size={14}/></h2>
          {notificaciones.map(n => (
            <div key={n.id} className="card-wrapper fade-in">
              <div className="row-item">
                <div className="icon-circle-white">{getIcon(n.tipo)}</div>
                <div className="btn-white-label">{n.titulo}</div>
                <span className="time-now">Ahora</span>
              </div>
              <p className="text-micro-aviso">{n.desc}</p>
            </div>
          ))}

          <h2 className="section-subtitle mt-15">Tus Alarmas <FaRegClock size={14}/></h2>
          {alarmas.map(al => (
            <div key={al.id} className="card-wrapper fade-in">
              <div className="row-item">
                <div className="icon-circle-white"><FaRegClock className="status-icon icon-dark" /></div>
                <div className="btn-white-label">
                  <div className="alarm-title-small">{al.titulo}</div>
                  <div className="timer-countdown">{Math.floor(al.tiempoTotal/60)}:{(al.tiempoTotal%60).toString().padStart(2,'0')}</div>
                </div>
                <div className={`switch-mini ${al.activa ? 'active' : ''}`} 
                     onClick={() => setAlarmas(alarmas.map(a => a.id === al.id ? {...a, activa: !a.activa} : a))}>
                  <div className="handle-mini"></div>
                </div>
              </div>
              <p className="text-micro-aviso">{al.desc}</p>
            </div>
          ))}

          <button className="btn-nueva-alerta" onClick={() => setShowModal(true)}>
            <FaPlus /> Nueva Alarma
          </button>
          
          <button className="btn-aplicar-footer" onClick={() => navigate('/home')}>Aplicar Ajustes</button>
        </div>

        {/* MODAL FUNCIONAL */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 className="modal-title">Crear Alerta</h3>
              <input type="text" placeholder="Titulo" className="modal-input" 
                     value={nuevoItem.titulo} onChange={(e) => setNuevoItem({...nuevoItem, titulo: e.target.value})} />
              
              <div className="icon-selector-row">
                <FaExclamationCircle className={nuevoItem.tipoIcono === 'retraso' ? 'sel red' : ''} onClick={() => setNuevoItem({...nuevoItem, tipoIcono: 'retraso'})} />
                <FaCog className={nuevoItem.tipoIcono === 'mantenimiento' ? 'sel gray' : ''} onClick={() => setNuevoItem({...nuevoItem, tipoIcono: 'mantenimiento'})} />
                <FaCheckCircle className={nuevoItem.tipoIcono === 'restablecido' ? 'sel green' : ''} onClick={() => setNuevoItem({...nuevoItem, tipoIcono: 'restablecido'})} />
              </div>

              <div className="modal-time-row">
                <input type="number" placeholder="MM" value={nuevoItem.m} onChange={(e) => setNuevoItem({...nuevoItem, m: e.target.value})} />
                <input type="number" placeholder="SS" value={nuevoItem.s} onChange={(e) => setNuevoItem({...nuevoItem, s: e.target.value})} />
                <button className="btn-modal-close" onClick={() => setShowModal(false)}>Cerrar</button>
              </div>

              <button className="btn-modal-save" onClick={handleAgregarAlerta}>
                <FaPlus /> Nueva Alarma
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notificaciones;