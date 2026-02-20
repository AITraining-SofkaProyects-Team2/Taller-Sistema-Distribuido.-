import express from 'express';

const app = express();
app.use(express.json());


import ticketsRouter from './routes/tickets';
app.use('/api/tickets', ticketsRouter);


// Test-only endpoints for seeding/clearing tickets
if (process.env.NODE_ENV === 'test') {
  // Dynamic import for compatibility with ts-node/vitest
  app.post('/__test__/seed', async (req, res) => {
    const { seedTickets } = await import('./repositories/ticketRepository');
    const { count } = req.body;
    seedTickets(count || 0);
    res.status(204).end();
  });
  app.post('/__test__/clear', async (_req, res) => {
    const { clearTickets } = await import('./repositories/ticketRepository');
    clearTickets();
    res.status(204).end();
  });
}

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;

if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Reports Query service listening on port ${PORT}`);
  });
}
