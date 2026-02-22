
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Simulación de carga
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const assets = {
    fondo: "/src/assets/imagenes de fondo/imagendefondo (1).png",
    logoPrincipal: "/src/assets/imagenes de fondo/bogota sin limites.png",
    logoMetroPay: "/src/assets/logo-metro-pay.png",
    iconNotificacion: "/src/assets/imagenes de fondo/icono notificacion.png",
    iconUsuario: "/src/assets/user-icon-red.png",
    iconMovimientos: "/src/assets/icon-mov-white.png",
    iconPlanificador: "/src/assets/icon-planificador.png",
    iconAyuda: "/src/assets/icon-ayuda-custom.png",
    iconosGrilla: [
      { img: "/src/assets/icon-tarjeta.png", label: "Tarjeta Metro APP" },
      { img: "/src/assets/icon-experiencia.png", label: "Adapta tu experiencia" },
      { img: "/src/assets/icon-viaje.png", label: "Viaje" },
      { img: "/src/assets/icon-saldo.png", label: "Saldo" }
    ]
  };

  // --- LOADER PERSONALIZADO ---
  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <div className="relative flex flex-col items-center">
          <img src={assets.logoPrincipal} alt="Cargando..." className="h-24 animate-pulse mb-4" />
          <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#E30613] animate-[loading_2s_ease-in-out_infinite]"></div>
          </div>
          <span className="mt-4 font-black italic text-[#E30613] text-sm uppercase">Cargando Bogotá...</span>
        </div>
        <style>{`
          @keyframes loading {
            0% { width: 0%; transform: translateX(-100%); }
            50% { width: 100%; transform: translateX(0%); }
            100% { width: 0%; transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full flex justify-center bg-gray-900 overflow-hidden">
      <div className="relative w-full max-w-[430px] h-full flex flex-col bg-white shadow-2xl overflow-hidden">
        
        {/* FONDO CON DESENFOQUE */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${assets.fondo})` }}
        >
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1.5px]"></div>
        </div>

        <div className="relative z-10 flex flex-col h-full">
          
          {/* HEADER */}
          <header className="flex justify-between items-center px-8 pt-12 pb-5">
            <div className="w-8 h-8 flex flex-col justify-between p-1 cursor-pointer">
              <div className="h-1 bg-[#E30613] rounded-full w-full"></div>
              <div className="h-1 bg-[#E30613] rounded-full w-3/4"></div>
              <div className="h-1 bg-[#E30613] rounded-full w-full"></div>
            </div>
            <img src={assets.logoPrincipal} alt="Logo" className="h-12 object-contain" />
            <div className="bg-white/90 p-2 rounded-full shadow-lg">
              <img src={assets.iconNotificacion} alt="Notificaciones" className="w-6 h-6" />
            </div>
          </header>

          {/* MAIN CONTENT */}
          <main className="flex-1 overflow-y-auto px-8 py-5 space-y-10 pb-44 custom-scrollbar">
            
            {/* SECCIÓN USUARIO */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <img src={assets.iconUsuario} alt="User" className="w-8 h-8" />
                <span className="text-xl font-black italic text-gray-900 uppercase">Usuario</span>
              </div>
              <div className="flex justify-between items-center">
                <button className="bg-[#E30613] text-white flex items-center gap-2 px-4 h-[28px] rounded-2xl font-black italic text-[11px] shadow-xl border-b-2 border-red-900 active:scale-95 transition-transform">
                  <img src={assets.iconMovimientos} alt="" className="w-4 h-4" />
                  MOVIMIENTOS
                </button>
                <img src={assets.logoMetroPay} alt="Metro Pay" className="h-10 object-contain" />
              </div>
            </section>

            {/* GRILLA ICONOS CORREGIDA */}
            <section className="grid grid-cols-4 gap-3">
              {assets.iconosGrilla.map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <button 
                    className="w-14 h-14 bg-[#E30613] rounded-full flex items-center justify-center shadow-lg border-2 border-white/50 active:scale-90 transition-transform"
                    onClick={() => {
                      if(item.label === "Adapta tu experiencia") {
                        navigate('/personalizacion');
                      } else if (item.label === "Viaje") {
                        navigate('/viaje');
                      }
                    }}
                  >
                    <img src={item.img} alt={item.label} className="w-8 h-8 object-contain" />
                  </button>
                  <span className="text-[7px] font-black italic text-gray-900 text-center uppercase leading-tight">{item.label}</span>
                </div>
              ))}
            </section>

            {/* PLANIFICADOR CORREGIDO */}
            <section className="mt-4">
              <button 
                onClick={() => navigate('/viaje')}
                className="w-full bg-[#E30613] text-white py-3.5 rounded-2xl flex items-center px-4 shadow-xl border-b-2 border-red-900 active:scale-95 transition-all"
              >
                <img src={assets.iconPlanificador} alt="" className="w-9 h-9 mr-3" />
                <span className="font-black italic text-[11px] uppercase text-left leading-tight">¿A donde vaz? planifica tu viaje</span>
              </button>
            </section>

            {/* ESTADOS TIEMPO REAL */}
            <section className="mt-14 bg-white/95 rounded-2xl p-5 shadow-lg border border-gray-100">
              <h3 className="text-center font-black italic text-gray-900 mb-4 text-[9px] uppercase">Estados de las lineas tiempo real</h3>
              <div className="flex justify-between gap-1">
                {['Mantenimiento', 'Nov.Tecnicas', 'En Operación'].map((text, i) => (
                  <div key={i} className="bg-white py-1.5 px-1 rounded-full text-[6px] font-black italic flex items-center justify-center gap-1 border shadow-sm flex-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${i===0 ? 'bg-red-600' : i===1 ? 'bg-yellow-400' : 'bg-green-500'}`}></div>
                    {text}
                  </div>
                ))}
              </div>
            </section>

            {/* AYUDA */}
            <section className="mt-16">
              <button 
                onClick={() => navigate('/soporte')} 
                className="w-full bg-[#E30613] py-5 rounded-[3rem] flex items-center justify-center gap-5 shadow-2xl border-b-4 border-red-900 active:scale-95 transition-all"
              >
                <img src={assets.iconAyuda} alt="Ayuda" className="w-12 h-12" />
                <span className="text-2xl font-black italic text-white uppercase tracking-tighter">¿Necesitas ayuda?</span>
              </button>
            </section>

          </main>

          {/* NAVBAR INFERIOR */}
          <nav className="absolute bottom-0 w-full bg-[#E30613] text-white flex justify-around items-center py-5 rounded-t-[2.5rem] shadow-[0_-10px_25px_rgba(0,0,0,0.2)]">
            {['Inicio', 'Pagar con QR', 'Turismo'].map((item, i) => (
              <div 
                key={i} 
                className={`flex flex-col items-center ${i > 0 ? 'opacity-70' : ''} cursor-pointer`}
                onClick={() => i === 0 && navigate('/home')}
              >
                <span className="text-[10px] font-black italic uppercase">{item}</span>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}