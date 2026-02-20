import React from "react";

const Filters: React.FC = () => {
  // TODO: Add state, priority, incident type, date range filters
  return (
    <section className="bg-indigo-50 p-8 rounded-2xl shadow-xl border border-indigo-100 mb-8">
      <h2 className="text-2xl font-bold text-indigo-700 mb-8">Filtros</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-semibold text-indigo-700">Estado</label>
          <select className="w-full rounded border-indigo-200 p-2 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200">
            <option value="">Todos</option>
            <option value="RECIBIDA">Recibida</option>
            <option value="VALIDADA">Validada</option>
            <option value="ENCOLADA">Encolada</option>
            <option value="PRIORIZADA">Priorizada</option>
            <option value="EN PROGRESO">En Progreso</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-semibold text-indigo-700">Prioridad</label>
          <select className="w-full rounded border-indigo-200 p-2 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200">
            <option value="">Todas</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Media</option>
            <option value="BAJA">Baja</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-semibold text-indigo-700">Tipo de Incidente</label>
          <select className="w-full rounded border-indigo-200 p-2 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200">
            <option value="">Todos</option>
            <option value="NO_SERVICE">Sin servicio</option>
            <option value="INTERMITTENT_SERVICE">Servicio intermitente</option>
            <option value="SLOW_CONNECTION">Conexión lenta</option>
            <option value="ROUTER_ISSUE">Problema con el router</option>
            <option value="BILLING_QUESTION">Consulta de facturación</option>
            <option value="OTHER">Otro</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-semibold text-indigo-700">Rango de Fechas</label>
          <div className="flex gap-2">
            <input type="date" className="rounded border-indigo-200 p-2 w-full bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200" />
            <input type="date" className="rounded border-indigo-200 p-2 w-full bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-semibold text-indigo-700">Buscar por ID</label>
          <input type="text" className="rounded border-indigo-200 p-2 w-full bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200" placeholder="ID de ticket" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-semibold text-indigo-700">Buscar por Línea</label>
          <input type="text" className="rounded border-indigo-200 p-2 w-full bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200" placeholder="Número de línea" />
        </div>
      </div>
    </section>
  );
};

export default Filters;
