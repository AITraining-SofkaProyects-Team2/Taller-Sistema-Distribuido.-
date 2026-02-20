import React, { useState } from "react";

interface Incident {
  id: string;
  lineNumber: string;
  email: string;
  incidentType: string;
  priority: "ALTA" | "MEDIA" | "BAJA";
  status: string;
  description?: string;
  createdAt: string;
}

// Mock de tickets
const mockTickets: Incident[] = Array.from({ length: 53 }, (_, i) => ({
  id: `TCK-${1000 + i}`,
  lineNumber: `300${i % 10}1234${i}`,
  email: `cliente${i}@isp.com`,
  incidentType: ["NO_SERVICE", "INTERMITTENT_SERVICE", "SLOW_CONNECTION", "ROUTER_ISSUE", "BILLING_QUESTION", "OTHER"][i % 6],
  priority: ["ALTA", "MEDIA", "BAJA"][i % 3] as "ALTA" | "MEDIA" | "BAJA",
  status: ["RECIBIDA", "VALIDADA", "ENCOLADA", "PRIORIZADA", "EN PROGRESO"][i % 5],
  description: i % 6 === 5 ? "Otro tipo de incidente" : undefined,
  createdAt: new Date(Date.now() - i * 3600 * 1000).toISOString(),
}));

const PAGE_SIZE = 10;

const TicketList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<keyof Incident>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const total = mockTickets.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Ordenamiento
  const sortedTickets = [...mockTickets].sort((a, b) => {
    if (sortBy === "createdAt") {
      return sortOrder === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "priority") {
      const prio = { ALTA: 3, MEDIA: 2, BAJA: 1 };
      return sortOrder === "asc"
        ? prio[a.priority] - prio[b.priority]
        : prio[b.priority] - prio[a.priority];
    }
    if (sortBy === "status") {
      return sortOrder === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return 0;
  });

  const tickets = sortedTickets.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSort = (field: keyof Incident) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <section className="bg-white p-8 rounded-2xl shadow-xl shadow-indigo-100 border border-indigo-50">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Listado de Tickets</h2>
        <div className="flex gap-4">
          <span className="text-gray-500">Total: <span className="font-semibold text-indigo-600">{total}</span></span>
          <span className="text-gray-500">Página <span className="font-semibold text-indigo-600">{page + 1}</span> de <span className="font-semibold text-indigo-600">{totalPages}</span></span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-indigo-100 rounded-lg">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("id")}>ID</th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("lineNumber")}>Número de Línea</th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("email")}>Email</th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("incidentType")}>Tipo de Incidente</th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("priority")}>Prioridad</th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("status")}>Estado</th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort("createdAt")}>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-4">
                  No hay tickets para mostrar.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-indigo-50 transition">
                  <td className="px-4 py-2 font-mono text-sm text-indigo-700">{ticket.id}</td>
                  <td className="px-4 py-2">{ticket.lineNumber}</td>
                  <td className="px-4 py-2">{ticket.email}</td>
                  <td className="px-4 py-2">{ticket.incidentType}</td>
                  <td className="px-4 py-2">
                    <span className={
                      ticket.priority === "ALTA"
                        ? "bg-red-100 text-red-700 px-2 py-1 rounded"
                        : ticket.priority === "MEDIA"
                        ? "bg-yellow-100 text-yellow-700 px-2 py-1 rounded"
                        : "bg-green-100 text-green-700 px-2 py-1 rounded"
                    }>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={
                      ticket.status === "EN PROGRESO"
                        ? "bg-blue-100 text-blue-700 px-2 py-1 rounded"
                        : ticket.status === "PRIORIZADA"
                        ? "bg-indigo-100 text-indigo-700 px-2 py-1 rounded"
                        : "bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    }>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-500">{new Date(ticket.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end items-center gap-4 mt-6">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 rounded bg-indigo-100 text-indigo-700 font-semibold disabled:bg-gray-100 disabled:text-gray-400 transition"
        >
          Anterior
        </button>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 rounded bg-indigo-100 text-indigo-700 font-semibold disabled:bg-gray-100 disabled:text-gray-400 transition"
        >
          Siguiente
        </button>
      </div>
    </section>
  );
};

export default TicketList;
