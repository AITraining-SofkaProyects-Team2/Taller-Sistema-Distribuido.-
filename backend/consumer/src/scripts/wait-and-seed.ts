import { spawn } from 'child_process';
import net from 'net';

function parseAmqpUrl(url: string) {
  try {
    const u = new URL(url);
    return { host: u.hostname, port: parseInt(u.port || '5672', 10) };
  } catch {
    return null;
  }
}

async function waitForPort(host: string, port: number, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    await new Promise((res) => setTimeout(res, 500));
    try {
      await new Promise<void>((resolve, reject) => {
        const socket = net.createConnection({ host, port }, () => {
          socket.end();
          resolve();
        });
        socket.on('error', (err) => {
          socket.destroy();
          reject(err);
        });
        socket.setTimeout(2000, () => {
          socket.destroy();
          reject(new Error('timeout'));
        });
      });
      return;
    } catch {
      // try again
    }
  }
  throw new Error(`Timeout waiting for ${host}:${port}`);
}

async function run() {
  // DB
  const dbHost = process.env.DB_HOST || 'db';
  const dbPort = parseInt(process.env.DB_PORT || '5432', 10);

  // RabbitMQ
  let rmqHost = process.env.RABBITMQ_HOST || '';
  let rmqPort = process.env.RABBITMQ_PORT ? parseInt(process.env.RABBITMQ_PORT, 10) : undefined;
  if (!rmqHost) {
    const url = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
    const parsed = parseAmqpUrl(url);
    if (parsed) {
      rmqHost = parsed.host;
      rmqPort = parsed.port;
    }
  }
  rmqHost = rmqHost || 'rabbitmq';
  rmqPort = rmqPort || 5672;

  try {
    console.log(`Waiting for DB ${dbHost}:${dbPort} ...`);
    await waitForPort(dbHost, dbPort);
    console.log(`DB reachable: ${dbHost}:${dbPort}`);

    console.log(`Waiting for RabbitMQ ${rmqHost}:${rmqPort} ...`);
    await waitForPort(rmqHost, rmqPort);
    console.log(`RabbitMQ reachable: ${rmqHost}:${rmqPort}`);

    // Run seed (compiled JS)
    console.log('Running seed script...');
    await new Promise<void>((resolve, reject) => {
      const ps = spawn('node', ['dist/scripts/seed.js'], { stdio: 'inherit' });
      ps.on('exit', (code) => (code === 0 ? resolve() : reject(new Error('seed failed'))));
      ps.on('error', reject);
    });
    console.log('Seed finished; starting server');

    // Start main process
    const server = spawn('node', ['dist/index.js'], { stdio: 'inherit' });
    const forward = (sig: NodeJS.Signals) => {
      server.kill(sig);
    };
    process.on('SIGTERM', () => forward('SIGTERM'));
    process.on('SIGINT', () => forward('SIGINT'));
  } catch (err) {
    console.error('wait-and-seed failed', err);
    process.exit(1);
  }
}

run();
