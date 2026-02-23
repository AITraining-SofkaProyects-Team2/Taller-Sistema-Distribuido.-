import React, { useEffect, useState } from "react";
import { ticketsService } from "../../services/tickets.service";

const Metrics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [byPriority, setByPriority] = useState<Record<string, number>>({});
  const [byStatus, setByStatus] = useState<Record<string, number>>({});

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await ticketsService.getMetrics();
        // Expected shape: { metrics: [{ status, priority, count }, ...] } or a more structured object
        // Backend returns structured metrics: { totalTickets, byStatus, byPriority, byType }
        const total = Number(res?.totalTickets ?? 0);
        const pri = res?.byPriority ?? {};
        const stat = res?.byStatus ?? {};

        if (mounted) {
          setTotal(total);
          setByPriority(pri);
          setByStatus(stat);
        }
      } catch (err: any) {
        if (mounted) setError(err?.message ?? 'Error cargando métricas');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="bg-white p-6 rounded-xl shadow border border-indigo-50 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Métricas Agregadas</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-50 rounded-lg p-4 flex flex-col items-center">
          <span className="text-3xl font-bold text-indigo-700">{loading ? '…' : total}</span>
          <span className="text-gray-500">Total de tickets</span>
        </div>
        <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center">
          {Object.keys(byPriority).length === 0 ? (
            <span className="text-gray-500">Sin datos</span>
          ) : (
            Object.entries(byPriority).map(([k, v]) => (
              <span key={k} className="text-green-700 font-bold">{k}: {v}</span>
            ))
          )}
          <span className="text-gray-500 mt-2">Por prioridad</span>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center">
          {Object.keys(byStatus).length === 0 ? (
            <span className="text-gray-500">Sin datos</span>
          ) : (
            Object.entries(byStatus).map(([k, v]) => (
              <span key={k} className="text-blue-700 font-bold">{k}: {v}</span>
            ))
          )}
          <span className="text-gray-500 mt-2">Por estado</span>
        </div>
      </div>
    </section>
  );
};

export default Metrics;
