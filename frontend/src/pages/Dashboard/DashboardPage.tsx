import React from "react";
import TicketList from "./TicketList";
import Layout from "../../components/layout/Layout";
import Filters from "./Filters";

const DashboardPage: React.FC = () => {
  return (
    <Layout>
      <h1 className="text-3xl font-bold text-indigo-700 mb-8">Dashboard de Gestión de Tickets</h1>
      <Filters />
      <TicketList />
    </Layout>
  );
};

export default DashboardPage;
