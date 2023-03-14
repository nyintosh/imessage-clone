import { User } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { CreateUsernameResponse, GraphQLContext } from '../../utils/types.js';

const resolvers = {
	Query: {
		searchUsers: async (
			_: any,
			args: { username: string },
			context: GraphQLContext,
		): Promise<Array<User>> => {
			const { username: searchedUsername } = args;
			const { prisma, session } = context;

			if (!session?.user) {
				throw new GraphQLError('Not authorized!');
			}

			const activeUsername = session.user.username;

			try {
				const users = await prisma.user.findMany({
					where: {
						username: {
							contains: searchedUsername,
							not: activeUsername,
							mode: 'insensitive',
						},
					},
				});

				return users;
			} catch (error) {
				const err = error as any;

				console.log(`Query.searchUsers() - Error: ${err}`);
				throw new GraphQLError(err?.message);
			}
		},
	},
	Mutation: {
		createUsername: async (
			_: any,
			args: { username: string },
			context: GraphQLContext,
		): Promise<CreateUsernameResponse> => {
			const { username } = args;
			const { prisma, session } = context;

			if (!session?.user) {
				throw new GraphQLError('Not authorized!');
			}

			const activeUserId = session.user.id;

			try {
				const isUserExist = await prisma?.user.findUnique({
					where: {
						username,
					},
				});

				if (isUserExist) {
					throw new GraphQLError('Username already taken');
				}

				await prisma?.user.update({
					where: {
						id: activeUserId,
					},
					data: {
						username,
					},
				});

				return {
					success: true,
				};
			} catch (error) {
				const err = error as any;

				console.log(`Mutation.createUsername() - Error: ${err}`);
				throw new GraphQLError(err?.message);
			}
		},
	},
};

export default resolvers;
