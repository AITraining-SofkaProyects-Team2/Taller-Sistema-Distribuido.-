import React from "react";
import TicketList from "./TicketList";
import Filters from "./Filters";
import Metrics from "./Metrics";
import Graphs from "./Graphs";
import ExportButton from "./ExportButton";
import RefreshButton from "./RefreshButton";
import Layout from "../../components/layout/Layout";

const DashboardPage: React.FC = () => {
  return (
    <Layout>
      <h1>Dashboard de Gestión de Tickets</h1>
      <Filters />
      <Metrics />
      <Graphs />
      <ExportButton />
      <RefreshButton />
      <TicketList />
    </Layout>
  );
};

export default DashboardPage;
