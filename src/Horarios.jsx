
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Importación corregida con PhoneCall para evitar pantalla blanca
import { ChevronLeft, ChevronRight, Search, PhoneCall } from 'lucide-react';

export default function Horarios() {
  const navigate = useNavigate();

  // Datos de las líneas
  const lineas = [
    { 
      nombre: "Linea 1", 
      estaciones: "E1 - E 16", 
      semana: "5:00 AM - 11 PM", 
      domingo: "6:00 AM - 10 PM" 
    },
    { 
      nombre: "Linea 2", 
      estaciones: "E1 - E 11", 
      semana: "5:00 AM - 11 PM", 
      domingo: "6:00 AM - 10 PM" 
    }
  ];

  // Nuevas preguntas solicitadas sobre cambios y festivos
  const preguntasHorario = [
    "¿Hay cambios de horario hoy?",
    "¿Cuál es el horario en días festivos?",
    "¿Cómo me entero de cambios programados?"
  ];

  return (
    <div className="relative z-10 flex flex-col h-full w-full bg-white/10 backdrop-blur-sm">
      {/* Cabecera Roja */}
      <header className="bg-[#E30613] text-white p-4 pt-12 flex items-center shadow-md">
        <button onClick={() => navigate('/')} className="cursor-pointer">
          <ChevronLeft size={32} strokeWidth={3} />
        </button>
        <h1 className="flex-1 text-center text-3xl font-extrabold tracking-tight">
          Horario
        </h1>
      </header>

      <main className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
        {/* Renderizado de tarjetas de líneas */}
        <div className="flex flex-col gap-6">
          {lineas.map((linea, index) => (
            <div key={index} className="flex flex-col shadow-xl rounded-2xl overflow-hidden border border-gray-200">
              <div className="flex">
                <div className="bg-[#E30613] text-white p-4 w-24 flex items-center justify-center font-extrabold text-xl">
                  {linea.nombre}
                </div>
                <div className="bg-gray-400 flex-1 p-4 flex items-center justify-center font-extrabold text-gray-900 text-lg italic">
                  {linea.estaciones}
                </div>
              </div>
              <div className="bg-[#FFD700] p-4 flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <span className="bg-black text-[#FFD700] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">L - S</span>
                  <span className="font-extrabold text-gray-900">{linea.semana}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-black text-[#FFD700] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">D - F</span>
                  <span className="font-extrabold text-gray-900">{linea.domingo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sección de preguntas sobre cambios y festivos */}
        <div className="flex flex-col mt-4 border-t border-gray-300 pt-4">
          <h3 className="text-gray-800 font-extrabold italic mb-4">Información Adicional</h3>
          {preguntasHorario.map((pregunta, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-400/30">
              <span className="text-[14px] font-extrabold text-gray-800 italic leading-tight">
                {pregunta}
              </span>
              <ChevronRight className="text-[#E30613]" size={24} strokeWidth={3} />
            </div>
          ))}
        </div>

        {/* Botón de Contacto con Icono y Mascota */}
        <div className="mt-auto relative pb-6 pt-10">
          <button className="w-full bg-[#E30613] text-white font-extrabold py-4 px-6 rounded-2xl text-left flex items-center shadow-xl text-lg italic">
            <PhoneCall className="mr-3" size={24} /> 
            Llamanos o Escribenos
          </button>
          <div 
            className="absolute -right-10 -top-5 w-29 h-39 bg-contain bg-no-repeat drop-shadow-lg z-20" 
            style={{ backgroundImage: "url('./src/assets/imagenes de fondo/icono robot de chat.png')" }}
          ></div>
        </div>
      </main>
    </div>
  );
}