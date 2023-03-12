import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import { PubSub } from 'graphql-subscriptions';
import { useServer } from 'graphql-ws/lib/use/ws';
import http from 'http';
import { getSession } from 'next-auth/react';
import { WebSocketServer } from 'ws';
import { resolvers } from './graphql/resolvers/index.js';
import { typeDefs } from './graphql/typeDefs/index.js';
import { GraphQLContext, Session, SubscriptionContext } from './utils/types.js';

const { json } = bodyParser;

const main = async () => {
	dotenv.config();

	const schema = makeExecutableSchema({ typeDefs, resolvers });

	const app = express();
	const httpServer = http.createServer(app);

	const wsServer = new WebSocketServer({
		server: httpServer,
		path: '/subscriptions',
	});

	const prisma = new PrismaClient();
	const pubsub = new PubSub();

	const serverCleanup = useServer(
		{
			schema,
			context: async (ctx: SubscriptionContext): Promise<GraphQLContext> => ({
				prisma,
				pubsub,
				session: ctx?.connectionParams?.session ?? null,
			}),
		},
		wsServer,
	);

	const server = new ApolloServer({
		schema,
		cache: 'bounded',
		csrfPrevention: true,
		plugins: [
			ApolloServerPluginDrainHttpServer({ httpServer }),
			ApolloServerPluginDrainHttpServer({ httpServer }),
			{
				async serverWillStart() {
					return {
						async drainServer() {
							await serverCleanup.dispose();
						},
					};
				},
			},
		],
	});

	await server.start();

	const corsOptions = {
		origin: process.env.CLIENT_ORIGIN,
		credentials: true,
	};

	app.use(
		'/graphql',
		cors<cors.CorsRequest>(corsOptions),
		json(),
		expressMiddleware(server, {
			context: async ({ req }): Promise<GraphQLContext> => ({
				prisma,
				pubsub,
				session: (await getSession({ req })) as Session,
			}),
		}),
	);

	const PORT = process.env.PORT || 4000;

	await new Promise<void>((resolve) =>
		httpServer.listen({ port: PORT }, resolve),
	);

	console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
};

main().catch((error) => console.log(`Main() - Error: ${error}`));
