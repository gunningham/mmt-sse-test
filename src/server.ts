import * as express from 'express';
import { Server, createServer } from 'http';
import { PORT } from './constants';

export const startServer = (app: express.Application): Server => {
  const httpServer = createServer(app);

  return httpServer.listen({ port: PORT }, (): void => {
    process.stdout.write(`Server ready at http://localhost:${PORT}\n`);
  });
};
