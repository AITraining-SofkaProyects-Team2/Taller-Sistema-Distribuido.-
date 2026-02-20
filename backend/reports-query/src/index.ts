import express from 'express';
import ticketRoutes from './routes/tickets.routes';

const app = express();
app.use(express.json());

app.use('/api/tickets', ticketRoutes);

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
