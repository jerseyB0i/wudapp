import 'dotenv/config';
import http from 'http';
import { buildApp, buildSocketServer, registerRoutes } from './app.js';
import { config } from './infrastructure/config.js';
import { logger } from './infrastructure/logger.js';

async function bootstrap() {
	const fastify = await buildApp();
	const httpServer = http.createServer(fastify.server);
	const io = await buildSocketServer(httpServer);

	await registerRoutes(fastify, io);
	await fastify.ready();

	httpServer.listen(config.PORT, config.HOST, () => {
		logger.info(
			`Wudapp server running on http://${config.HOST}:${config.PORT}`
		);
	});
}

bootstrap().catch(err => {
	console.error(err);
	process.exit(1);
});
