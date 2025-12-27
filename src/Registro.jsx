
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, PhoneCall } from 'lucide-react'; // Agregamos PhoneCall

export default function Registro() {
  const navigate = useNavigate(); //
  const opciones = [
    "Regístrate con cédula de ciudadanía CC",
    "Registro para extranjero",
    "Registro para menores de edad TI",
    "Fecha de expedición inválida",
    "No llegó mensaje de texto con el código de registro",
    "Me aparece aviso \"cliente inactivo\""
  ]; //

  return (
    <div className="relative z-10 flex flex-col h-full w-full">
      <header className="bg-[#E30613] text-white p-6 pt-14 flex items-center shadow-lg">
        <button onClick={() => navigate('/')} className="cursor-pointer">
          <ChevronLeft size={28} />
        </button>
        <h1 className="flex-1 text-center text-3xl font-extrabold capitalize tracking-tight">
          Registro
        </h1>
      </header>

      <main className="p-6 flex-1 overflow-y-auto flex flex-col">
        <h2 className="text-black text-xl font-extrabold mb-4 text-center italic">
          ¿Cómo podemos ayudarte?
        </h2>
        
        <div className="flex items-center justify-between border-b-2 border-gray-500 mb-6 pb-1">
          <span className="font-extrabold text-xl text-gray-800">Buscar</span>
          <Search size={22} className="text-gray-700" />
        </div>

        <div className="flex flex-col mb-8">
          {opciones.map((texto, index) => (
            <div key={index} className="flex items-center justify-between py-4 border-b border-gray-300 cursor-pointer active:bg-white/40 transition-all">
              <span className="text-[14px] font-extrabold text-gray-800 pr-4 leading-tight">{texto}</span>
              <ChevronRight className="text-[#E30613]" size={24} />
            </div>
          ))}
        </div>

        {/* --- CÓDIGO DE LA MASCOTA Y CONTACTO AGREGADO AQUÍ --- */}
        <div className="mt-auto relative pb-8">
          <button 
            className="w-full bg-[#E30613] text-white font-extrabold py-5 px-6 rounded-2xl text-left flex items-center shadow-xl hover:bg-red-800 transition-colors capitalize cursor-pointer"
          >
            <PhoneCall className="mr-3" size={24} />
            Llámanos o escríbenos
          </button>
          
          {/* Robot Mascota Flotante */}
          <div 
            className="absolute -right-6 -top-10 w-27 h-35 bg-contain bg-no-repeat drop-shadow-lg" 
            style={{ backgroundImage: "url('./src/assets/imagenes de fondo/icono robot de chat.png')" }}
          ></div>
        </div>
        {/* --------------------------------------------------- */}
      </main>
    </div>
  );
}