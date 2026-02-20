import React from "react";

const Metrics: React.FC = () => {
  // TODO: Show total tickets, distribution by state, priority, type
  return (
    <section className="bg-white p-6 rounded-xl shadow border border-indigo-50 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Métricas Agregadas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-50 rounded-lg p-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-indigo-700">123</span>
          <span className="text-gray-500">Total de tickets</span>
        </div>
        <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-green-700">ALTA: 34</span>
          <span className="text-yellow-700 font-bold">MEDIA: 56</span>
          <span className="text-green-700 font-bold">BAJA: 33</span>
          <span className="text-gray-500 mt-2">Por prioridad</span>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center">
          <span className="text-blue-700 font-bold">EN PROGRESO: 12</span>
          <span className="text-indigo-700 font-bold">PRIORIZADA: 18</span>
          <span className="text-gray-700 font-bold">RECIBIDA: 93</span>
          <span className="text-gray-500 mt-2">Por estado</span>
        </div>
      </div>
    </section>
  );
};

export default Metrics;
