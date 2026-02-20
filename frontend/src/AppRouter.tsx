import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import IncidentReportPage from './pages/IncidentReport/IncidentReportPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import StressTestPage from './pages/StressTest/StressTestPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem', background: '#f3f4f6' }}>
        <Link to="/" style={{ marginRight: 16 }}>Reportar Incidente</Link>
        <Link to="/dashboard" style={{ marginRight: 16 }}>Dashboard</Link>
        <Link to="/stress">Prueba de Estrés</Link>
      </nav>
      <Routes>
        <Route path="/" element={<IncidentReportPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/stress" element={<StressTestPage onBack={() => window.history.back()} />} />
      </Routes>
    </BrowserRouter>
  );
}
