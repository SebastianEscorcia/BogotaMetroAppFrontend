
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, PhoneCall } from 'lucide-react';

export default function Recarga() {
  const navigate = useNavigate();
  const opciones = ["¿Cómo recargar por internet?", "Puntos de recarga físicos", "Problemas con mi recarga", "Ver saldo disponible"];

  return (
    <div className="relative z-10 flex flex-col h-full w-full">
      <header className="bg-[#E30613] text-white p-6 pt-14 flex items-center shadow-lg">
        <button onClick={() => navigate('/')} className="cursor-pointer"><ChevronLeft size={28} /></button>
        <h1 className="flex-1 text-center text-3xl font-extrabold">Recarga</h1>
      </header>
      <main className="p-6 flex-1 flex flex-col overflow-y-auto">
        <h2 className="text-black text-xl font-extrabold mb-4 text-center italic">Gestiona tu saldo</h2>
        <div className="flex flex-col mb-8">
          {opciones.map((texto, index) => (
            <div key={index} className="flex items-center justify-between py-4 border-b border-gray-300">
              <span className="font-extrabold text-gray-800">{texto}</span>
              <ChevronRight className="text-[#E30613]" size={24} />
            </div>
          ))}
        </div>
        <div className="mt-auto relative pb-8">
          <button className="w-full bg-[#E30613] text-white font-extrabold py-5 rounded-2xl flex items-center px-6">
            <PhoneCall className="mr-3" size={24} /> Llámanos o escríbenos
          </button>
          <div className="absolute -right-3 -top-10 w-27 h-39 bg-contain bg-no-repeat" style={{ backgroundImage: "url('./src/assets/imagenes de fondo/icono robot de chat.png')" }}></div>
        </div>
      </main>
    </div>
  );
}